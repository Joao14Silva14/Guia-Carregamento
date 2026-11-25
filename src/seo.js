import { LANGS, langInfo, langPath } from "./i18n/index.js";

export const DEFAULT_ORIGIN = "https://guia-carregamento.vercel.app";
export const TARIFF_URL = "https://goldenergy.pt/mobilidade-eletrica/carregar-em-casa/";
export const ERSE_URL = "https://www.erse.pt/atividade/regulacao/tarifas-e-precos-eletricidade/";
export const FAQ_IDS = [1, 2, 3, 4];
export const alternateLinks = origin => [
  ...LANGS.map(l => [l.code === "pt" ? "pt-PT" : l.code, origin + langPath(l.code)]),
  ["x-default", origin + langPath("en")],
];

export function pageMetadata(code, t, origin = DEFAULT_ORIGIN) {
  const canonical = origin + langPath(code);
  const lang = langInfo(code).html;
  const title = t("meta.title"), description = t("meta.desc");
  const image = origin + "/img/guia-partilha.jpg";
  return { title, description, canonical, lang, image, alt: t("seo.ogAlt"),
    schema: {
      "@context": "https://schema.org", "@type": "WebPage", "@id": canonical,
      url: canonical, name: title, description, inLanguage: lang,
      publisher: { "@type": "Organization", name: "Goldenergy", url: "https://goldenergy.pt/" },
      about: { "@type": "Thing", name: t("hero.title").replace("{vz}", t("hero.titleVz")) },
    },
  };
}

export function syncPageMetadata(code, t, doc = document) {
  const canonical = doc.querySelector('link[rel="canonical"]');
  const origin = canonical ? new URL(canonical.href).origin : DEFAULT_ORIGIN;
  const m = pageMetadata(code, t, origin);
  const set = (selector, value) => { const el = doc.querySelector(selector); if (el) el.setAttribute("content", value); };
  doc.title = m.title;
  if (canonical) canonical.href = m.canonical;
  set('meta[name="description"]', m.description);
  set('meta[property="og:url"]', m.canonical);
  for (const [key, val] of Object.entries({title:m.title, description:m.description, "image:alt":m.alt})) set(`meta[property="og:${key}"]`, val);
  for (const [key, val] of Object.entries({title:m.title, description:m.description, "image:alt":m.alt})) set(`meta[name="twitter:${key}"]`, val);
  const ld = doc.getElementById("guide-schema");
  if (ld) ld.textContent = JSON.stringify(m.schema);
}
