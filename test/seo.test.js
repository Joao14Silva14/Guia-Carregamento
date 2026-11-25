import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { LANGS, langPath, localizeURL, localeFromURL } from "../src/i18n/index.js";
import { alternateLinks, FAQ_IDS, ERSE_URL, TARIFF_URL } from "../src/seo.js";
import { generate } from "../scripts/prerender.mjs";

const origin = "https://seo.example";
const vercel = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url),"utf8"));
const doc = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("stable locales, legacy links, campaign query and shared vehicle", () => {
  assert.equal(localeFromURL("/", ""), "pt");
  assert.equal(localeFromURL("/", "?lang=ES"), "es");
  assert.equal(localeFromURL("/de/", "?lang=pt"), "de");
  assert.equal(localeFromURL("/", "?lang=invalid"), "pt");
  assert.equal(localizeURL(new URL(origin+"/?lang=fr&utm_source=goldenergy#marca=BMW&modelo=iX1"),"fr").href,
    origin+"/fr/?utm_source=goldenergy#marca=BMW&modelo=iX1");
});

test("production generator exposes five localized pages without JavaScript", async () => {
  const dir = await mkdtemp(join(tmpdir(),"guia-seo-"));
  try {
    const template = doc.replace('/src/main.jsx','/assets/main-MOCK.js');
    await writeFile(join(dir,"index.html"),template);
    await generate(dir,origin,{renderPage: async(code,dict)=>`<main><h1>${dict.ui['hero.title'].replace('{vz}',dict.ui['hero.titleVz'])}</h1><div role="search">${dict.ui['search.label']}<input id="q"></div><details><summary>${dict.ui['seo.heading']}</summary><h2>${dict.ui['seo.q1']}</h2><p>${dict.ui['seo.a1']}</p><a href="${TARIFF_URL}">${dict.ui['seo.tariff']}</a><a href="${ERSE_URL}">${dict.ui['seo.erse']}</a></details></main>`});
    const xml=await readFile(join(dir,"sitemap.xml"),"utf8");
    assert.equal((xml.match(/<loc>/g)||[]).length,5);
    assert.equal(vercel.trailingSlash,true);
    for (const code of ["es","en","fr","de"]) assert.ok(vercel.redirects.some(r=>r.source==="/"&&r.destination===`/${code}/`&&r.has?.some(p=>p.key==="lang"&&p.value===code)));
    const robots=await readFile(join(dir,"robots.txt"),"utf8");
    assert.match(robots,/User-agent: OAI-SearchBot\nAllow: \/\n/);
    assert.match(robots,/User-agent: GPTBot\nDisallow: \/\n/);
    assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
    for (const l of LANGS) {
      const html=await readFile(join(dir,langPath(l.code),"index.html"),"utf8");
      assert.equal((html.match(/<title>/g)||[]).length,1);
      assert.equal((html.match(/<meta name="description"/g)||[]).length,1);
      assert.equal((html.match(/<h1>/g)||[]).length,1);
      assert.equal((html.match(/<h2>/g)||[]).length,1);
      assert.ok(html.includes('role="search"'));
      assert.ok(html.includes("Como programar") || html.includes("How do I schedule") || html.includes("Comment programmer") || html.includes("Wie plane") || html.includes("¿Cómo se programa"));
      assert.equal((html.match(/<link rel="canonical"/g)||[]).length,1);
      assert.equal((html.match(/<link rel="alternate"/g)||[]).length,6);
      assert.ok(html.includes(`<html lang="${l.html}">`));
      assert.ok(html.includes(`href="${origin+langPath(l.code)}"`));
      for (const [code, href] of alternateLinks(origin)) assert.ok(html.includes(`hreflang="${code}" href="${href}"`));
      for (const href of [TARIFF_URL,ERSE_URL]) assert.ok(html.includes(`<a href="${href}">`));
      assert.ok(html.includes('name="twitter:card"'));
      assert.ok(html.includes('src="/assets/main-MOCK.js"'));
      assert.ok(xml.includes(`<loc>${origin+langPath(l.code)}</loc>`));
      const schema=JSON.parse(html.match(/id="guide-schema" type="application\/ld\+json">([^<]+)/)[1]);
      assert.equal(schema['@type'],'WebPage');
      assert.equal(schema.inLanguage,l.html);
      assert.equal(schema.url,origin+langPath(l.code));
    }
  } finally { await rm(dir,{recursive:true,force:true}); }
});
