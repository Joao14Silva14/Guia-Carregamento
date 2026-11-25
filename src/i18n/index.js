/* ===================== i18n: idiomas, deteção e persistência =====================
   Caminhos estáveis por idioma. Ligações antigas ?lang= continuam a abrir o guia.
   Os textos estão em src/i18n/{pt,es,en,fr,de}.json:
     "ui" → textos da página (chaves)
     "g"  → textos dos guias (chave = texto original em PT, com {app}, {inicio}, {fim} e <b>…</b>)
     "m"  → textos das maquetas das apps (chave = texto PT; # substitui números e horas) */
const LANGS = [
  { code: "pt", label: "PT", name: "Português", html: "pt-PT", hl: "pt_PT", cc: "pt", num: "pt-PT" },
  { code: "es", label: "ES", name: "Español", html: "es", hl: "es", cc: "es", num: "es-ES" },
  { code: "en", label: "EN", name: "English (UK)", html: "en-GB", hl: "en_GB", cc: "gb", num: "en-GB" },
  { code: "fr", label: "FR", name: "Français", html: "fr", hl: "fr", cc: "fr", num: "fr-FR" },
  { code: "de", label: "DE", name: "Deutsch", html: "de", hl: "de", cc: "de", num: "de-DE" },
];
const LANG_CODES = LANGS.map(l => l.code);
const LANG_KEY = "ge-guia-lang";
const langInfo = c => LANGS.find(l => l.code === c) || LANGS[0];

/* O caminho explícito é estável para utilizadores e motores de pesquisa. */
function localeFromURL(pathname, search = "") {
  const path = /^\/(es|en|fr|de)\/?$/.exec(pathname);
  if (path) return path[1];
  const legacy = new URLSearchParams(search).get("lang")?.toLowerCase();
  return LANG_CODES.includes(legacy) ? legacy : "pt";
}
const langPath = code => code !== "pt" && LANG_CODES.includes(code) ? `/${code}/` : "/";
function localizeURL(u, code) { u.pathname = langPath(code); u.searchParams.delete("lang"); return u; }
function detectLang() {
  try { return localeFromURL(window.location.pathname, window.location.search); } catch { return "pt"; }
}
function preferredLanguage() {
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (LANG_CODES.includes(saved)) return saved;
    for (const l of navigator.languages?.length ? navigator.languages : [navigator.language || ""]) {
      const c = String(l).slice(0, 2).toLowerCase();
      if (LANG_CODES.includes(c)) return c;
    }
    return "en";
  } catch { return null; }
}
function persistLang(code, { store = true } = {}) {
  try { document.documentElement.lang = langInfo(code).html; } catch { }
  if (store) { try { window.localStorage.setItem(LANG_KEY, code); } catch { } }
}
/* Interpolação simples: «Olá {nome}» + { nome: "Ana" } */
const fill = (s, vars) => !vars ? s : String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));

/* Tradução das maquetas: troca cada nó de texto do HTML pelo equivalente no dicionário.
   Números e horas passam a «#» na chave e voltam a ser inseridos pela mesma ordem. */
const NUM_RE = /\d+(?:[:.,\u00a0\u202f ]\d+)*/g;
const ENT = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#39;": "'", "&nbsp;": "\u00a0" };
const decodeEnt = s => s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, m => ENT[m]);
const encodeEnt = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function trText(raw, m) {
  if (!m) return null;
  const t = raw.trim(); if (!t) return null;
  if (m[t] != null) return m[t];
  const nums = t.match(NUM_RE); if (!nums) return null;
  const k = t.replace(NUM_RE, "#"); const v = m[k]; if (v == null) return null;
  let i = 0; return v.replace(/#/g, () => (nums[i] != null ? nums[i++] : "#"));
}
function trHTML(html, m) {
  if (!m) return html;
  return html.replace(/(<style[\s\S]*?<\/style>)|>([^<>]+)</g, (all, style, txt) => {
    if (style || !txt || !/[A-Za-zÀ-ÿ]/.test(txt)) return all;
    const dec = decodeEnt(txt), r = trText(dec, m);
    if (r == null) return all;
    const lead = dec.match(/^\s*/)[0], trail = dec.match(/\s*$/)[0];
    return ">" + encodeEnt(lead + r + trail) + "<";
  });
}
export { LANGS, LANG_CODES, langInfo, detectLang, localeFromURL, langPath, localizeURL, preferredLanguage, persistLang, fill, trText, trHTML };
