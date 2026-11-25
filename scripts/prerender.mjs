// Publica o mesmo resumo para todas as pessoas e crawlers. O React completa a interatividade.
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";

import { LANGS, langPath } from "../src/i18n/index.js";
import { alternateLinks, DEFAULT_ORIGIN, ERSE_URL, TARIFF_URL, pageMetadata } from "../src/seo.js";

const escape = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const meta = (attr, key, value) => `<meta ${attr}="${key}" content="${escape(value)}">`;

export function render(template, code, t, origin, appMarkup) {
  const m = pageMetadata(code, t, origin);
  const og = {
    type: "website", site_name: "Goldenergy", url: m.canonical, title: m.title, description: m.description,
    image: m.image, "image:type": "image/jpeg", "image:width": 727, "image:height": 473, "image:alt": m.alt,
  };
  const tw = { card: "summary_large_image", title: m.title, description: m.description, image: m.image, "image:alt": m.alt };
  const alternates = alternateLinks(origin).map(([l, href]) => `<link rel="alternate" hreflang="${l}" href="${escape(href)}">`);
  const head = [
    `<title>${escape(m.title)}</title>`, meta("name", "description", m.description),
    `<link rel="canonical" href="${escape(m.canonical)}">`, ...alternates,
    ...Object.entries(og).map(([k,v])=>meta("property",`og:${k}`,v)),
    ...Object.entries(tw).map(([k,v])=>meta("name",`twitter:${k}`,v)),
    `<script id="guide-schema" type="application/ld+json">${JSON.stringify(m.schema).replace(/</g,"\\u003c")}</script>`,
  ].join("\n    ");
  const rootMarkup = appMarkup;
  const metaFallback = /<title>[^<]*<\/title>/;
  const contentFallback = /<div id="root"><\/div>/;
  if (!metaFallback.test(template) || !contentFallback.test(template)) throw new Error("Vite HTML template not recognised");
  const noScript = `<noscript><p class="ge-noscript">${escape(t("seo.fallback"))}</p></noscript>`;
  return template.replace("<!--LOCALIZED_NOSCRIPT-->", noScript)
    .replace(/<html lang="[^"]+">/, `<html lang="${m.lang}">`)
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace(metaFallback, () => head)
    .replace(contentFallback, () => `<div id="root">${rootMarkup}</div>`);
}

export async function generate(dist, origin = DEFAULT_ORIGIN, { renderPage = null } = {}) {
  const u = new URL(origin);
  if (u.protocol !== "https:" || u.pathname !== "/" || u.search || u.hash || u.username || u.password) throw new Error("SITE_ORIGIN must be a public HTTPS origin");
  origin = u.origin;
  const template = await readFile(join(dist, "index.html"), "utf8");
  let ssr;
  if (!renderPage) {
    const { createServer } = await import("vite");
    ssr = await createServer({ configFile: resolve("vite.config.js"), server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
    const [component, pt] = await Promise.all([
      ssr.ssrLoadModule("/src/Guia.jsx"), readFile(new URL("../src/i18n/pt.json", import.meta.url), "utf8").then(JSON.parse),
    ]);
    const dictionaries = new Map([["pt", pt]]);
    renderPage = async code => {
      let dict = dictionaries.get(code);
      if (!dict) {
        dict = JSON.parse(await readFile(new URL(`../src/i18n/${code}.json`, import.meta.url), "utf8"));
        dictionaries.set(code, dict);
      }
      return renderToString(React.createElement(component.default, { initialLang: code, initialDict: dict, ptDict: pt, loadDict: null }));
    };
  }
  try {
    for (const {code} of LANGS) {
      const dict = JSON.parse(await readFile(new URL(`../src/i18n/${code}.json`, import.meta.url), "utf8"));
      const t = key => { if (!dict.ui[key]) throw new Error(`${code}: missing ${key}`); return dict.ui[key]; };
      const folder = join(dist, code === "pt" ? "" : code);
      await mkdir(folder, {recursive:true});
      const appMarkup = await renderPage(code, dict);
      for (const key of ["search.label", "seo.q1", "seo.a1"]) {
        if (!appMarkup.includes(t(key))) throw new Error(`${code}: server-rendered guide is missing ${key}`);
      }
      if (!appMarkup.includes('id="q"') || !appMarkup.includes('role="search"')) throw new Error(`${code}: server-rendered guide is missing the vehicle search`);
      const html = render(template,code,t,origin,appMarkup);
      await writeFile(join(folder,"index.html"),html);
    }
  } finally {
    if (ssr) await ssr.close();
  }
  const urls = LANGS.map(l => `  <url><loc>${escape(origin+langPath(l.code))}</loc></url>`).join("\n");
  await writeFile(join(dist,"sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  // Search and training controls are independent. GPTBot opt-out is a configurable brand decision.
  await writeFile(join(dist,"robots.txt"),`User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await generate(resolve(process.argv[2] || "dist"), process.env.SITE_ORIGIN || DEFAULT_ORIGIN);
  console.log("SEO: 5 localized HTML pages, sitemap.xml and robots.txt");
}
