/* ===================== i18n: idiomas, deteção e persistência =====================
   Ordem de escolha: ?lang= no URL → preferência guardada → idioma do navegador → inglês.
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

function detectLang() {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q && LANG_CODES.includes(q.toLowerCase())) return q.toLowerCase();
  } catch (e) { }
  try {
    const s = window.localStorage.getItem(LANG_KEY);
    if (s && LANG_CODES.includes(s)) return s;
  } catch (e) { }
  try {
    const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]);
    for (const l of list) { const c = String(l).slice(0, 2).toLowerCase(); if (LANG_CODES.includes(c)) return c; }
  } catch (e) { }
  return "en";
}
/* Guarda a escolha, atualiza <html lang> e o URL (?lang=xx), mantendo o #hash partilhável */
function persistLang(code, { url = true, store = true } = {}) {
  const info = langInfo(code);
  try { document.documentElement.lang = info.html; } catch (e) { }
  if (store) { try { window.localStorage.setItem(LANG_KEY, code); } catch (e) { } }
  if (url) {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("lang", code);
      window.history.replaceState(window.history.state, "", u.pathname + u.search + u.hash);
    } catch (e) { }
  }
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
export { LANGS, LANG_CODES, langInfo, detectLang, persistLang, fill, trText, trHTML };
