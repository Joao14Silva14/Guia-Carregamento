import React, { useState, useEffect, useRef, useMemo } from "react";
import { BRANDS, GUIDES, ALIAS, TOP, norm, initials, logoUrl, photoFor, evUrl, STORE, deviceHTML, DEVICE_CSS, themeFor, appLabel, SKIN, shotFor, CAR_SVG, LOGO, setMS, setDays, storeLinks } from "./engine.js";
import { LANGS, langInfo, persistLang, fill, trHTML } from "./i18n/index.js";
/*
 * Goldenergy · Guia para programar o carregamento do carro elétrico nas horas de vazio — INTERFACE
 * React 18 + Tailwind CSS. Textos em src/i18n/*.json (PT é a fonte). Dados e maquetas em src/engine.js.
 * Estrutura: cabeçalho fixo (idioma + carro) → topo com pesquisa → guia em 2 colunas (passos | telemóvel)
 *            → tarifário e solar → fontes e notas legais.
 */

/* ===================== Oferta comercial (editar aqui) =====================
   Valores de goldenergy.pt/mobilidade-eletrica/carregar-em-casa (17-11-2026). VALIDAR com Marketing/Jurídico antes de publicar.
   Os textos das notas legais estão em i18n (chaves offer.*). */
const OFFER = {
  precoNum: 0.0889,   /* €/kWh no vazio, sem IVA */
  consumo100: 15,     /* kWh aos 100 km, consumo médio assumido */
  iva: 0.23,
  descontoClientes: "+35%",
  telefone: "800 501 070",
  telefoneHref: "tel:+351800501070",
  adesao: "https://goldenergy.pt/mobilidade-eletrica/carregar-em-casa/",
  pagina: "https://goldenergy.pt/mobilidade-eletrica/carregar-em-casa/",
  precosPdf: "https://goldenergy.pt/resources/data/website/documentos/precos_lp_carregar_em_casa.pdf",
  solar: "https://goldenergy.pt/paineis-solares/",
};
const IMG = { hero: "/img/electric-love-casa.webp" };
const ERSE_2027 = "https://www.erse.pt/media/uhpieyio/comunicado_novos-per%C3%ADodos-hor%C3%A1rios-_vfinal31julho2026.pdf";
const CYC = { diario: ["22:00", "08:00"], semanal: ["00:00", "07:00"] };
const USE_UTM = false;
const utm = (url, content) => !USE_UTM ? url : url + (url.includes("?") ? "&" : "?") + "utm_source=guia-carregamento&utm_medium=referral&utm_campaign=carregar-em-casa&utm_content=" + content;
const track = (id, extra) => { try { (window.dataLayer = window.dataLayer || []).push({ event: "cta_click", cta_id: id, ...(extra || {}) }); } catch (e) { } };
/* Imagens externas (logótipos jsdelivr, fotos Wikimedia/EV Database): "auto" desliga-as dentro de iframes com CSP restritiva */
const REMOTE_IMAGES = "auto";
const REMOTE = REMOTE_IMAGES === "auto"
  ? (() => { try { return typeof window !== "undefined" && window.self === window.top; } catch (e) { return false; } })()
  : !!REMOTE_IMAGES;
const OTHER = { name: "__other", guide: "generic", app: "", families: [], other: true };
const cx = (...a) => a.filter(Boolean).join(" ");
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lastSunday = (y, m) => { const d = new Date(y, m + 1, 0); d.setDate(d.getDate() - d.getDay()); return d; };
const isSummer = (d = new Date()) => { const y = d.getFullYear(); return d >= lastSunday(y, 2) && d < lastSunday(y, 9); };
const BRAND_HUE = n => { let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const famLabel = (b, f) => (b.name === "Smart" && /^\d$/.test(f.name) ? "#" + f.name : f.name);
function guideFor(b, f) { if (!b) return null; const gk = (f && f.guide) || b.guide; return { gk, g: GUIDES[gk] || GUIDES.generic }; }

/* ===================== i18n em runtime ===================== */
/* Lua (vazio) e sol (fora de vazio) junto aos termos de cada idioma */
const VZ = {
  pt: { re: /(fora d[oe] vazio|\bvazio\b)/gi, sun: s => /^fora/i.test(s) },
  es: { re: /(fuera de(?:l| las horas)? valle|\bvalle\b)/gi, sun: s => /^fuera/i.test(s) },
  en: { re: /(\boff-peak\b|\bpeak\b)/gi, sun: s => /^peak/i.test(s) },
  fr: { re: /(heures? pleines?|heures? creuses?)/gi, sun: s => /pleine/i.test(s) },
  de: { re: /(Hochtarif\w*|Niedertarif\w*)/g, sun: s => /^Hoch/.test(s) },
};
function makeI18n(lang, dict, pt) {
  const ui = (dict && dict.ui) || {}, pui = (pt && pt.ui) || {};
  const g = (dict && dict.g) || {}, m = (dict && dict.m) || {};
  const info = langInfo(lang);
  const t = (k, vars) => fill(ui[k] != null ? ui[k] : pui[k] != null ? pui[k] : k, vars);
  const nf = (() => { try { return new Intl.NumberFormat(info.num, { style: "currency", currency: "EUR" }); } catch (e) { return null; } })();
  const nfx = (() => { try { return new Intl.NumberFormat(info.num, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); } catch (e) { return null; } })();
  return {
    lang, info, t, m: lang === "pt" ? null : m,
    tg: s => (s && g[s] != null ? g[s] : s),
    tm: s => (s && m[s] != null ? m[s] : s),
    eur: x => (nf ? nf.format(x) : x.toFixed(2).replace(".", ",") + " €"),
    num4: x => (nfx ? nfx.format(x) : String(x)),
    vz: VZ[lang] || VZ.pt,
    days: String(t("mock.days")).split(","),
  };
}
const I18n = React.createContext(null);
const useL = () => React.useContext(I18n);
/* Texto com <b>…</b> e {variáveis} (que podem ser nós React); acrescenta lua/sol aos termos de vazio */
function Tx({ k, vars, text, plain }) {
  const L = useL();
  const src = text != null ? text : L.t(k);
  const out = [];
  String(src).split(/(<b>.*?<\/b>|\{\w+\})/g).forEach((part, i) => {
    if (!part) return;
    const v = /^\{(\w+)\}$/.exec(part);
    if (v) out.push(<React.Fragment key={i}>{vars && vars[v[1]] != null ? vars[v[1]] : part}</React.Fragment>);
    else if (part.startsWith("<b>")) out.push(<b key={i} className="font-bold text-[color:var(--ge-ink)]">{plain ? part.slice(3, -4) : vzText(part.slice(3, -4), i, L)}</b>);
    else out.push(...(plain ? [part] : vzText(part, i, L)));
  });
  return <>{out}</>;
}
const vzText = (str, k, L) => String(str).split(L.vz.re).map((t, j) =>
  !t ? null : (j % 2 === 1) ? (L.vz.sun(t) ? <Fv key={k + "-" + j}>{t}</Fv> : <Vz key={k + "-" + j}>{t}</Vz>) : t);

/* Texto dos guias: <b>…</b>, {app}, {inicio}, {fim} → nós React (traduzido pela chave PT) */
function Rich({ text, b, p, link = false }) {
  const L = useL();
  const out = [];
  String(L.tg(text)).split(/(<b>.*?<\/b>|\{app\}|\{inicio\}|\{fim\})/g).forEach((part, i) => {
    if (!part) return;
    if (part === "{app}") out.push(b.app ? (link ? <AppName key={i} name={b.app} /> : <b key={i} className="font-bold text-[color:var(--ge-ink)]">{b.app}</b>) : (b.other ? L.t("app.fromBrand") : L.t("app.officialOf", { brand: b.name })));
    else if (part === "{inicio}" || part === "{fim}") out.push(<Time key={i}>{part === "{inicio}" ? p.s : p.e}</Time>);
    else if (part.startsWith("<b>")) out.push(<b key={i} className="font-bold text-[color:var(--ge-ink)]">{vzText(part.slice(3, -4), i, L)}</b>);
    else out.push(...vzText(part, i, L));
  });
  return <>{out}</>;
}
const plainText = (L, text, b, p) => String(L.tg(text)).replace(/<\/?b>/g, "").replace(/\{app\}/g, b.app || (b.other ? L.t("app.fromBrand") : L.t("app.officialOf", { brand: b.name }))).replace(/\{inicio\}/g, p.s).replace(/\{fim\}/g, p.e);
const famName = (L, b, f) => famLabel(b, f).replace(/\((comercial|quadriciclo|pick-up)\)/, (m0, k) => "(" + L.t("fam." + k) + ")");
const brandName = (L, b) => (b.other ? L.t("other.brand") : b.name);

/* ===================== Ícones (traço simples) ===================== */
const IC = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  check: <path d="m5 12 5 5L20 7" />,
  chevL: <path d="m15 18-6-6 6-6" />,
  chevR: <path d="m9 6 6 6-6 6" />,
  chevD: <path d="m6 9 6 6 6-6" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  plug: <><path d="M9 2v6M15 2v6" /><path d="M6 8h12v4a6 6 0 0 1-12 0z" /><path d="M12 18v4" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z" /></>,
  ext: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></>,
  chat: <path d="M4 19.5 5.3 15A8 8 0 1 1 9 18.7z" />,
  car: <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3H3z" /><circle cx="7.5" cy="13" r=".8" /><circle cx="16.5" cy="13" r=".8" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  sunIc: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
};
const Icon = ({ n, className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{IC[n]}</svg>
);
const GPlay = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false"><path d="M4.2 2.6 13.8 12l-9.6 9.4c-.4-.2-.7-.7-.7-1.3V3.9c0-.6.3-1.1.7-1.3z" fill="#00A0FF" /><path d="m17.1 8.7-3.3 3.3-9.6-9.4c.2-.1.5-.1.8 0l12.1 6.1z" fill="#00D46A" /><path d="m17.1 15.3-12.1 6.1c-.3.1-.6.1-.8 0l9.6-9.4 3.3 3.3z" fill="#FF3A44" /><path d="m20.6 13.1-3.5 2.2-3.3-3.3 3.3-3.3 3.5 2.2c.8.5.8 1.7 0 2.2z" fill="#FFC500" /></svg>
);
const Apple = ({ className = "h-5 w-5" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" /></svg>
);
/* Lua = vazio · Sol = fora de vazio */
const Moon = ({ className = "mr-[0.2em] inline-block h-[1.05em] w-[1.05em] align-[-0.16em]" }) => (
  <svg viewBox="0 0 24 24" className={cx("flex-none", className)} aria-hidden="true" focusable="false"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="#382F83" stroke="#382F83" strokeWidth="1.5" strokeLinejoin="round" /></svg>
);
const Sun = ({ className = "mr-[0.2em] inline-block h-[1.1em] w-[1.1em] align-[-0.18em]" }) => (
  <svg viewBox="0 0 24 24" className={cx("flex-none", className)} aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.5" fill="#FFC845" stroke="#7A4B00" strokeWidth="1.6" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5" stroke="#7A4B00" strokeWidth="1.6" strokeLinecap="round" /></svg>
);
const Vz = ({ children }) => { const L = useL(); return <span className="whitespace-nowrap"><Moon />{children != null ? children : L.t("vz.word")}</span>; };
const Fv = ({ children }) => { const L = useL(); return <span className="whitespace-nowrap"><Sun />{children != null ? children : L.t("fv.word")}</span>; };
const Time = ({ children }) => <span className="whitespace-nowrap rounded-md bg-[color:var(--ge-mint)] px-1.5 font-bold tabular-nums text-[color:var(--ge-success)]">{children}</span>;
const Ext = () => { const L = useL(); return <span className="sr-only"> ({L.t("a11y.newWindow")})</span>; };
const A = ({ href, children, className, onClick }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cx("ge-link", className)}>{children}<Ext /></a>
);
/* Nome da app com ligação para a loja do sistema operativo de quem visita */
function AppName({ name }) {
  const L = useL();
  const s = storeLinks(name, L.info.hl, L.info.cc);
  if (!s) return <b className="font-bold">{name}</b>;
  const store = STORE === "apple" ? "App Store" : "Google Play";
  return (
    <a href={STORE === "apple" ? s.apple : s.google} target="_blank" rel="noopener noreferrer" onClick={() => track("app_store_" + STORE)} className="ge-link font-bold">
      {name}<span className="sr-only"> ({L.t("a11y.openIn", { store })})</span><Icon n="ext" className="ml-0.5 inline-block h-[0.85em] w-[0.85em] align-[-0.05em]" />
    </a>
  );
}

/* ===================== Componentes base ===================== */
/* Logótipo da marca (com iniciais quando a imagem falha) — tamanho fixo, sem saltos de layout */
function BrandLogo({ b, size = "md" }) {
  const [fail, setFail] = useState(false);
  const dim = { xs: "h-7 w-7 text-[10px] rounded-lg p-1", sm: "h-9 w-9 text-xs rounded-xl p-1", md: "h-12 w-12 text-sm rounded-xl p-1.5", lg: "h-14 w-14 text-base rounded-2xl p-1.5" }[size];
  const isOther = !b || b.other;
  return (
    <span className={cx("brand-logo flex flex-none items-center justify-center overflow-hidden border border-[color:var(--ge-line-soft)] bg-white", dim)} aria-hidden="true">
      {isOther ? <Icon n="car" className="h-3/4 w-3/4 text-[color:var(--ge-muted)]" />
        : (fail || !REMOTE) ? <b className="flex h-full w-full items-center justify-center rounded-md font-black tracking-tight" style={{ background: "hsl(" + BRAND_HUE(b.name) + " 45% 93%)", color: "hsl(" + BRAND_HUE(b.name) + " 55% 28%)" }}>{initials(b.name)}</b>
        : <img src={logoUrl(b.name)} alt="" loading="lazy" decoding="async" width="48" height="48" className="h-full w-full object-contain" onError={() => setFail(true)} />}
    </span>
  );
}
/* Fotografia do modelo: esqueleto enquanto carrega, silhueta se falhar */
function CarPhoto({ photo, alt, className }) {
  const [state, setState] = useState("load");
  useEffect(() => setState("load"), [photo && photo.src]);
  if (!photo || state === "fail") return <span className={cx("flex items-center justify-center bg-[color:var(--ge-soft)] text-[#9A95A8] [&>svg]:w-3/4", className)} dangerouslySetInnerHTML={{ __html: CAR_SVG }} />;
  return (
    <span className={cx("relative block overflow-hidden bg-[color:var(--ge-soft)]", className)}>
      {state === "load" && <span className="ge-skel absolute inset-0" aria-hidden="true" />}
      <img src={photo.src} alt={alt} loading="lazy" decoding="async" onLoad={() => setState("ok")} onError={() => setState("fail")}
        className={cx("h-full w-full object-cover motion-safe:transition-opacity motion-safe:duration-200", state === "ok" ? "opacity-100" : "opacity-0")} />
    </span>
  );
}
/* Fontes das maquetas (Google Fonts): só a família da app mostrada, uma vez */
const GFONTS = { "Inter": "Inter:wght@300;400;500;600;700", "Montserrat": "Montserrat:wght@500;600;700", "DM Sans": "DM+Sans:wght@400;500;700", "Poppins": "Poppins:wght@400;500;600", "Roboto": "Roboto:wght@400;500;700", "Source Sans 3": "Source+Sans+3:wght@300;400;600" };
const fontsLoaded = new Set();
function loadMockFont(ff) {
  const m = /'([^']+)'/.exec(ff || ""), fam = m && m[1];
  if (!fam || !GFONTS[fam] || fontsLoaded.has(fam) || typeof document === "undefined") return;
  fontsLoaded.add(fam);
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + GFONTS[fam] + "&display=swap";
  document.head.appendChild(l);
}
function useMedia(q) {
  const get = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q).matches : null);
  const [d, setD] = useState(get);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(q), on = () => setD(mq.matches); on();
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, [q]);
  return d;
}
/* Telemóvel com a ilustração do ecrã da app (traduzida), com transição suave entre ecrãs */
function PhoneMock({ g, b, p, gk, screen, family, photo }) {
  const L = useL();
  const s = g.screens[screen];
  const { k, T, key } = themeFor(g, s, b);
  const cap = L.tm(s.cap || s.t || "") || L.t("mock.screen");
  const label = L.tm(appLabel(k, T, b)) + " · " + cap;
  const shot = shotFor(gk, b, screen);
  const [shotFail, setShotFail] = useState(false);
  const html = useMemo(() => {
    setDays(L.days); setMS({ screen, family, photo });
    const h = trHTML(deviceHTML(g, b, p), L.m);
    return L.m ? h.replace(/\((comercial|quadriciclo|pick-up)\)/g, (_, k) => "(" + L.t("fam." + k) + ")") : h;
  }, [g, b, p.s, p.e, screen, family, photo, L]);
  const sk = (SKIN && SKIN[key]) || {};
  useEffect(() => { loadMockFont(sk.ff); loadMockFont(sk.hf); }, [sk.ff, sk.hf]);
  return (
    <figure className="m-0 flex flex-col items-center">
      <div key={gk + "-" + screen} className="ge-in ge-phone w-[272px] max-w-full">
        {shot && !shotFail
          ? <img src={shot} alt={L.t("mock.realShot", { label })} decoding="async" onError={() => setShotFail(true)} className="w-full rounded-[2.5rem] border-[.55rem] border-[#0A0A0A] bg-white shadow-[var(--sh-3)]" />
          : <><div className="gm" lang={L.info.html} aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} /><span className="sr-only">{L.t("mock.illustration", { label })}</span></>}
      </div>
      <figcaption className="mt-3 max-w-[272px] text-center text-sm leading-snug text-[color:var(--ge-muted)]">
        <b className="font-bold text-[color:var(--ge-ink)]">{cap}</b>
        <span className="block text-xs">{L.t("mock.disclaimer")}</span>
      </figcaption>
    </figure>
  );
}
/* Botões das duas lojas: a do sistema detetado primeiro e em destaque */
function StoreButtons({ app, size = "md" }) {
  const L = useL();
  const s = storeLinks(app, L.info.hl, L.info.cc);
  if (!s) return null;
  const items = [["google", "Google Play", <GPlay key="g" />], ["apple", "App Store", <Apple key="a" />]];
  if (STORE === "apple") items.reverse();
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([id, label, ic], i) => (
        <a key={id} href={s[id]} target="_blank" rel="noopener noreferrer" onClick={() => track("app_store_" + id, { app })}
          className={cx("ge-btn", i === 0 ? "ge-btn--ink" : "ge-btn--ghost", size === "sm" ? "min-h-[44px] px-4 text-[0.95rem]" : "px-5")}>
          {ic}<span><span className="sr-only">{L.t("store.get", { app })} </span>{label}</span><Ext />
        </a>
      ))}
    </div>
  );
}
const Callout = ({ tone = "tip", title, icon, children }) => (
  <aside className={cx("flex gap-3.5 rounded-[var(--r-m)] border p-4 sm:p-5", tone === "power" ? "border-[#CFC9EA] bg-[#F3F1FB]" : tone === "warn" ? "border-[#F2DDB0] bg-[color:var(--ge-amber-bg)]" : "border-[#BDEBD8] bg-[color:var(--ge-mint)]")}>
    <span className={cx("flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white", tone === "power" ? "text-[color:var(--ge-blue)]" : tone === "warn" ? "text-[color:var(--ge-warning)]" : "text-[color:var(--ge-success)]")}><Icon n={icon} /></span>
    <div className="min-w-0 flex-1">
      <h4 className="font-black leading-tight text-[color:var(--ge-ink)]">{title}</h4>
      <div className="mt-1 space-y-2 text-[0.98rem] leading-relaxed text-[#3A3648]">{children}</div>
    </div>
  </aside>
);

/* ===================== Cabeçalho: idioma ===================== */
function LangMenu({ lang, onChange }) {
  const L = useL();
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(0);
  const btn = useRef(null), list = useRef(null), wrap = useRef(null);
  const cur = langInfo(lang);
  useEffect(() => {
    if (!open) return;
    const i = Math.max(0, LANGS.findIndex(l => l.code === lang)); setAct(i);
    setTimeout(() => { const el = list.current && list.current.querySelectorAll("[role=option]")[i]; el && el.focus(); }, 0);
    const onDoc = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);
  const pick = c => { setOpen(false); btn.current && btn.current.focus(); if (c !== lang) onChange(c); };
  const onKey = e => {
    const n = LANGS.length;
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); btn.current && btn.current.focus(); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const i = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (act + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
      setAct(i); const el = list.current.querySelectorAll("[role=option]")[i]; el && el.focus();
    }
    if (e.key === "Tab") setOpen(false);
  };
  return (
    <div ref={wrap} className="relative">
      <button ref={btn} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={L.t("lang.label") + ": " + cur.name}
        onClick={() => setOpen(o => !o)} onKeyDown={e => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); } }}
        className="ge-focus flex h-11 min-w-[44px] items-center gap-1.5 rounded-full border border-[color:var(--ge-line)] bg-white px-3 text-sm font-bold text-[color:var(--ge-ink)] hover:border-[color:var(--ge-ink)] motion-safe:transition-colors">
        <Icon n="globe" className="h-[18px] w-[18px] text-[color:var(--ge-blue)]" /><span>{cur.label}</span>
        <Icon n="chevD" className={cx("hidden h-4 w-4 sm:block motion-safe:transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul ref={list} role="listbox" aria-label={L.t("lang.label")} onKeyDown={onKey}
          className="ge-in absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-2xl border border-[color:var(--ge-line-soft)] bg-white p-1.5 shadow-[var(--sh-3)]">
          {LANGS.map((l, i) => (
            <li key={l.code} role="option" aria-selected={l.code === lang} tabIndex={i === act ? 0 : -1} lang={l.html}
              onClick={() => pick(l.code)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(l.code); } }}
              className={cx("ge-focus flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl px-3 text-[0.98rem] outline-none hover:bg-[color:var(--ge-soft)] focus:bg-[color:var(--ge-soft)]", l.code === lang && "font-bold")}>
              <span className={cx("flex h-7 w-9 flex-none items-center justify-center rounded-md text-xs font-black", l.code === lang ? "bg-[color:var(--ge-green)] text-[color:var(--ge-ink)]" : "bg-[color:var(--ge-soft)] text-[color:var(--ge-muted)]")}>{l.label}</span>
              <span className="flex-1">{l.name}</span>
              {l.code === lang && <Icon n="check" className="h-4 w-4 text-[color:var(--ge-success)]" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ===================== Pesquisa (tolerante a erros) ===================== */
const INDEX = [];
BRANDS.forEach(b => b.families.forEach((f, fi) => {
  const name = norm(b.name + " " + f.name), extra = norm((ALIAS[b.name] || "") + " " + f.versions.map(v => v.name).join(" "));
  INDEX.push({ b, f, fi, name, txt: name + " " + extra, words: Array.from(new Set((name + " " + extra).split(/[^a-z0-9]+/).filter(Boolean))), top: TOP.indexOf(b.name) });
}));
/* Distância de edição curta (Damerau simplificada), limitada para ser rápida */
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j), pp = null;
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) {
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (pp && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, pp[j - 2] + 1);
      cur.push(v); if (v < best) best = v;
    }
    if (best > max) return max + 1;
    pp = prev; prev = cur;
  }
  return prev[b.length];
}
function searchCars(q) {
  const tq = norm(q.trim()); if (tq.length < 2) return [];
  const parts = tq.split(/\s+/).filter(Boolean), squash = tq.replace(/[^a-z0-9]/g, "");
  const out = [];
  for (const x of INDEX) {
    let score = 0, ok = true;
    for (const pt of parts) {
      if (x.words.some(w => w.startsWith(pt))) score += 4;
      else if (x.txt.includes(pt)) score += 3;
      else if (pt.length >= 3) {
        const max = pt.length >= 6 ? 2 : 1;
        const d = Math.min(...x.words.map(w => Math.min(lev(pt, w.slice(0, pt.length), max), lev(pt, w.slice(0, pt.length + 1), max), lev(pt, w, max))));
        if (d <= max) score += 2 - d * 0.5; else { ok = false; break; }
      } else { ok = false; break; }
    }
    if (!ok && squash.length >= 3 && x.txt.replace(/[^a-z0-9]/g, "").includes(squash)) { ok = true; score = 3 * parts.length; }
    if (!ok) continue;
    if (x.name.startsWith(tq)) score += 3;
    if (x.f.old) score -= 0.5;
    if (x.top > -1) score += 0.3;
    out.push({ ...x, score });
  }
  return out.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, 8);
}
function Hl({ s, q }) {
  const parts = norm(q.trim()).split(/\s+/).filter(p => p.length >= 2), ns = norm(s);
  const r = []; parts.forEach(pt => { const i = ns.indexOf(pt); if (i > -1) r.push([i, i + pt.length]); });
  if (!r.length) return s;
  r.sort((a, b) => a[0] - b[0]);
  const out = []; let last = 0;
  r.forEach(([a, z], k) => { if (a < last) return; out.push(s.slice(last, a)); out.push(<mark key={k} className="rounded-sm bg-[color:var(--ge-mint-2)] text-[color:var(--ge-ink)]">{s.slice(a, z)}</mark>); last = z; });
  out.push(s.slice(last)); return out;
}
function CarSearch({ onPick, onOther, inputRef, say }) {
  const L = useL();
  const [q, setQ] = useState(""), [open, setOpen] = useState(false), [act, setAct] = useState(-1), [maxH, setMaxH] = useState(null);
  const wrap = useRef(null);
  const hits = useMemo(() => searchCars(q), [q]);
  const show = open && norm(q.trim()).length >= 2;
  const count = hits.length + 1;
  useEffect(() => { if (norm(q.trim()).length >= 2) say(hits.length ? L.t("search.results", { n: hits.length }) : L.t("search.none")); }, [q]);
  /* Telemóvel: a lista nunca fica escondida pelo teclado */
  useEffect(() => {
    if (!show || typeof window === "undefined") return;
    const fit = () => {
      const vv = window.visualViewport, el = inputRef.current; if (!el) return;
      const h = (vv ? vv.height + vv.offsetTop : window.innerHeight) - el.getBoundingClientRect().bottom - 12;
      setMaxH(Math.max(160, Math.min(420, h)));
    };
    fit(); const vv = window.visualViewport;
    vv && vv.addEventListener("resize", fit); window.addEventListener("scroll", fit, { passive: true });
    return () => { vv && vv.removeEventListener("resize", fit); window.removeEventListener("scroll", fit); };
  }, [show]);
  const choose = i => {
    setOpen(false); setAct(-1);
    if (i >= hits.length) { setQ(""); onOther(); return; }
    const h = hits[i]; setQ(h.b.name + " " + h.f.name); onPick(h.b.name, h.fi);
  };
  const onKey = e => {
    if (!show) { if (e.key === "ArrowDown" && q.trim().length >= 2) { setOpen(true); e.preventDefault(); } return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setAct(a => (a + 1) % count); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAct(a => (a - 1 + count) % count); }
    else if (e.key === "Enter") { e.preventDefault(); choose(act > -1 ? act : 0); }
    else if (e.key === "Escape") { setOpen(false); setAct(-1); }
  };
  const onFocus = () => {
    setOpen(true);
    if (typeof window !== "undefined" && window.innerWidth < 768 && wrap.current && wrap.current.scrollIntoView) setTimeout(() => {
      const r = wrap.current.getBoundingClientRect(); if (r.top > 140 || r.top < 0) window.scrollBy({ top: r.top - 16, behavior: prefersReduced() ? "auto" : "smooth" });
    }, 250);
  };
  return (
    <div ref={wrap} className="relative">
      <label htmlFor="q" className="mb-2 block text-[1.05rem] font-bold text-[color:var(--ge-ink)]">{L.t("search.label")}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--ge-muted)]"><Icon n="search" className="h-[22px] w-[22px]" /></span>
        <input id="q" ref={inputRef} type="search" value={q} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} enterKeyHint="search"
          placeholder={L.t("search.placeholder")}
          role="combobox" aria-expanded={show} aria-controls="qres" aria-autocomplete="list" aria-describedby="qHint"
          aria-activedescendant={show && act > -1 ? "qo" + act : undefined}
          onChange={e => { setQ(e.target.value); setOpen(true); setAct(-1); }}
          onFocus={onFocus} onBlur={() => setTimeout(() => setOpen(false), 160)} onKeyDown={onKey}
          className="h-14 w-full rounded-2xl border-2 border-[color:var(--ge-line)] bg-white pl-12 pr-12 text-[1.05rem] text-[color:var(--ge-ink)] shadow-[var(--sh-1)] placeholder:text-[#77728A] hover:border-[#B9B3C6] focus:border-[color:var(--ge-success)] focus:outline-none focus:ring-4 focus:ring-[#40DDA6]/40 motion-safe:transition-[border-color,box-shadow] [&::-webkit-search-cancel-button]:hidden" />
        {q && <button type="button" onClick={() => { setQ(""); inputRef.current && inputRef.current.focus(); }} aria-label={L.t("search.clear")}
          className="ge-focus absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--ge-muted)] hover:bg-[color:var(--ge-soft)]"><Icon n="x" className="h-5 w-5" /></button>}
      </div>
      <p id="qHint" className="sr-only">{L.t("search.hint")}</p>
      {show && (
        <ul id="qres" role="listbox" aria-label={L.t("search.listLabel")} style={maxH ? { maxHeight: maxH } : undefined}
          className="ge-in absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[420px] overflow-y-auto overscroll-contain rounded-2xl border border-[color:var(--ge-line-soft)] bg-white p-1.5 shadow-[var(--sh-3)]">
          {hits.length === 0 && <li className="px-3 py-3 text-[0.98rem] text-[color:var(--ge-muted)]" role="presentation">{L.t("search.noneLong")}</li>}
          {hits.map((h, i) => (
            <li key={h.b.name + h.fi} id={"qo" + i} role="option" aria-selected={act === i}
              onMouseDown={e => e.preventDefault()} onClick={() => choose(i)} onMouseMove={() => act !== i && setAct(i)}
              className={cx("flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl px-2.5 py-1.5", act === i ? "bg-[color:var(--ge-mint)]" : "hover:bg-[color:var(--ge-soft)]")}>
              <BrandLogo b={h.b} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[1.02rem] font-bold text-[color:var(--ge-ink)]"><Hl s={h.b.name + " " + famName(L, h.b, h.f)} q={q} /></span>
                <span className="block truncate text-sm text-[color:var(--ge-muted)]">{h.f.old ? L.t("search.oldModel") + " · " : ""}{h.b.app ? L.t("search.appLine", { app: h.b.app }) : L.t("search.noApp")}</span>
              </span>
              <Icon n="chevR" className="h-4 w-4 flex-none text-[#9A95A8]" />
            </li>
          ))}
          <li id={"qo" + hits.length} role="option" aria-selected={act === hits.length}
            onMouseDown={e => e.preventDefault()} onClick={() => choose(hits.length)} onMouseMove={() => act !== hits.length && setAct(hits.length)}
            className={cx("mt-1 flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border-t border-[color:var(--ge-line-soft)] px-2.5 py-1.5", act === hits.length ? "bg-[color:var(--ge-mint)]" : "hover:bg-[color:var(--ge-soft)]")}>
            <BrandLogo b={OTHER} size="sm" />
            <span className="min-w-0 flex-1"><span className="block font-bold">{L.t("other.title")}</span><span className="block text-sm text-[color:var(--ge-muted)]">{L.t("other.sub")}</span></span>
          </li>
        </ul>
      )}
    </div>
  );
}

/* ===================== Custo aos 100 km (com explicação) ===================== */
function Cost100() {
  const L = useL();
  const [hover, setHover] = useState(false), [focus, setFocus] = useState(false), [pin, setPin] = useState(false);
  const open = hover || focus || pin;
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = () => { setHover(false); setFocus(false); setPin(false); };
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) close(); };
    const onKey = e => { if (e.key === "Escape") close(); };
    document.addEventListener("pointerdown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const isKbd = el => { try { return el.matches(":focus-visible"); } catch (e) { return true; } };
  const v = L.eur(OFFER.consumo100 * OFFER.precoNum * (1 + OFFER.iva));
  const calc = L.t("cost.calc", { kwh: OFFER.consumo100, price: L.num4(OFFER.precoNum) + " €/kWh", vat: Math.round(OFFER.iva * 100), v });
  return (
    <div ref={ref} className="relative inline-flex max-w-full">
      <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-white/80 py-1.5 pl-4 pr-1.5 text-[1.02rem] font-semibold text-[color:var(--ge-ink)]"
        onPointerEnter={e => e.pointerType === "mouse" && setHover(true)} onPointerLeave={e => e.pointerType === "mouse" && setHover(false)}>
        <Tx k="cost.lead" vars={{ v: <b className="text-2xl font-black tabular-nums text-[color:var(--ge-blue)]">{v}</b> }} />
        <button type="button" aria-label={L.t("cost.how")} aria-describedby="tipCusto" aria-expanded={open}
          onClick={() => setPin(x => !x)} onFocus={e => isKbd(e.currentTarget) && setFocus(true)} onBlur={() => setFocus(false)}
          className="ge-focus flex h-11 w-11 flex-none items-center justify-center rounded-full text-[color:var(--ge-blue)] hover:bg-white">
          <Icon n="info" className="h-6 w-6" />
        </button>
      </p>
      <span id="tipCusto" role="tooltip" className={cx("absolute left-0 top-full z-30 w-[min(26rem,calc(100vw-2.5rem))] pt-2", open ? "block" : "hidden")}>
        <span className="ge-in block rounded-2xl bg-[color:var(--ge-ink)] p-4 text-left text-sm leading-relaxed text-white shadow-[var(--sh-3)]">
          <b className="block text-base">{L.t("cost.howTitle")}</b>
          <span className="mt-1 block font-semibold tabular-nums text-[color:var(--ge-green)]">{calc}</span>
          <span className="mt-1 block text-white/85">{L.t("cost.note", { kwh: OFFER.consumo100 })}</span>
        </span>
      </span>
    </div>
  );
}

/* ===================== Escolha da marca e do modelo ===================== */
function BrandPicker({ b, f, onBrand, onModel, onOther }) {
  const L = useL();
  const [all, setAll] = useState(false);
  const top = TOP.map(n => BRANDS.find(x => x.name === n)).filter(Boolean).slice(0, 10);
  const chip = (x, on, onClick, label, key) => (
    <button key={key || x.name} type="button" aria-pressed={on} onClick={onClick} className="ge-brand-chip ge-focus">
      <BrandLogo b={x} size="xs" /><span className="truncate">{label || x.name}</span>
    </button>
  );
  return (
    <div className="mt-5">
      <p id="topLbl" className="mb-2 text-sm font-bold uppercase tracking-[.08em] text-[color:var(--ge-muted)]">{L.t("pick.quick")}</p>
      <div role="group" aria-labelledby="topLbl" className="flex flex-wrap gap-2">
        {top.map(x => chip(x, !!b && b.name === x.name, () => onBrand(x.name)))}
        <button type="button" aria-expanded={all} aria-controls="allBrands" onClick={() => setAll(a => !a)} className="ge-chip ge-focus pl-3.5">
          <Icon n="list" className="h-5 w-5 text-[color:var(--ge-blue)]" /><span>{all ? L.t("pick.lessBrands") : L.t("pick.allBrands", { n: BRANDS.length })}</span>
        </button>
      </div>
      {all && (
        <div id="allBrands" className="ge-in mt-3 rounded-2xl border border-[color:var(--ge-line-soft)] bg-white p-2">
          <ul className="grid max-h-[320px] grid-cols-2 gap-1 overflow-y-auto overscroll-contain sm:grid-cols-3 lg:grid-cols-4" aria-label={L.t("pick.allBrandsLabel")}>
            {BRANDS.map(x => (
              <li key={x.name}><button type="button" onClick={() => { onBrand(x.name); setAll(false); }} aria-pressed={!!b && b.name === x.name}
                className={cx("ge-brand-list-item ge-focus", b && b.name === x.name && "is-selected")}>
                <BrandLogo b={x} size="xs" /><span className="truncate">{x.name}</span></button></li>
            ))}
            <li><button type="button" onClick={() => { onOther(); setAll(false); }} className="ge-brand-list-item ge-focus"><BrandLogo b={OTHER} size="xs" /><span className="truncate">{L.t("other.short")}</span></button></li>
          </ul>
        </div>
      )}
      {b && !b.other && (
        <div className="ge-in mt-5 rounded-2xl bg-[color:var(--ge-soft)] p-3.5 sm:p-4">
          <p id="famLbl" className="mb-2.5 flex items-center gap-2 font-bold text-[color:var(--ge-ink)]"><BrandLogo b={b} size="xs" />{L.t("pick.model", { brand: b.name })}</p>
          <div role="group" aria-labelledby="famLbl" className="flex flex-wrap gap-2">
            {b.families.map((x, i) => (
              <button key={x.name} type="button" aria-pressed={f === x} onClick={() => onModel(i)} className="ge-model-chip ge-focus">
                <span className="model-chip-label">{famName(L, b, x)}</span>{x.old && <span className="model-chip-note">· {L.t("pick.old")}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      <button type="button" onClick={onOther} className="ge-link ge-focus mt-4 inline-flex min-h-[44px] items-center text-[0.98rem]">{L.t("pick.notListed")}</button>
    </div>
  );
}

/* ===================== Horário de vazio (informativo) ===================== */
function VazioPanel({ cyc, setCyc, p }) {
  const L = useL();
  const [more, setMore] = useState(false);
  const summer = isSummer();
  const rows = cyc === "diario"
    ? { vz: [["day.all", ["22:00 → 08:00"]]], fv: [["day.all", ["08:00 → 22:00"]]] }
    : {
      vz: [["day.wk", ["00:00 → 07:00"]], ["day.sat", summer ? ["00:00–09:00", "14:00–20:00", "22:00–24:00"] : ["00:00–09:30", "13:00–18:30", "22:00–24:00"]], ["day.sun", [L.t("day.allDay")]]],
      fv: [["day.wk", ["07:00 → 24:00"]], ["day.sat", summer ? ["09:00–14:00", "20:00–22:00"] : ["09:30–13:00", "18:30–22:00"]], ["day.sun", [L.t("day.none")]]],
    };
  const onKey = e => { if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) { e.preventDefault(); setCyc(cyc === "diario" ? "semanal" : "diario"); } };
  return (
    <section aria-labelledby="tvz" className="rounded-[var(--r-m)] border border-[#BDEBD8] bg-[color:var(--ge-mint)] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h3 id="tvz" className="text-sm font-bold uppercase tracking-[.08em] text-[color:var(--ge-success)]">{L.t("vz.title")}</h3>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[1.6rem] font-black leading-tight tabular-nums text-[color:var(--ge-ink)]" aria-live="polite">
            <span className="whitespace-nowrap"><Moon className="mr-1.5 inline-block h-6 w-6 align-[-0.12em]" />{p.s} → {p.e}</span>
            <span className="text-base font-semibold text-[color:var(--ge-muted)]">{L.t("vz.every")}</span>
          </p>
        </div>
        <div role="radiogroup" aria-label={L.t("vz.cycleLabel")} onKeyDown={onKey} className="grid grid-cols-2 rounded-full bg-white p-1 shadow-[var(--sh-1)] lg:w-[340px]">
          {[["diario", "vz.daily"], ["semanal", "vz.weekly"]].map(([val, k]) => (
            <button key={val} type="button" role="radio" aria-checked={cyc === val} tabIndex={cyc === val ? 0 : -1} onClick={() => setCyc(val)}
              className={cx("ge-focus min-h-[44px] rounded-full px-3 text-[0.95rem] font-bold motion-safe:transition-colors", cyc === val ? "bg-[color:var(--ge-ink)] text-white" : "text-[color:var(--ge-ink)] hover:bg-[color:var(--ge-soft)]")}>{L.t(k)}</button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[0.98rem] text-[#3A3648]">{cyc === "semanal" ? <Tx k="vz.weeklyNote" /> : <Tx k="vz.dailyNote" />} <span className="text-[color:var(--ge-muted)]">{L.t("vz.where")}</span></p>
      <button type="button" aria-expanded={more} aria-controls="vzMore" onClick={() => setMore(m => !m)} className="ge-link ge-focus mt-2 inline-flex min-h-[44px] items-center gap-1 text-[0.98rem]">
        {more ? L.t("vz.less") : L.t("vz.more")}<Icon n="chevD" className={cx("h-4 w-4 motion-safe:transition-transform", more && "rotate-180")} />
      </button>
      {more && (
        <div id="vzMore" className="ge-in mt-2 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[["vz", rows.vz], ["fv", rows.fv]].map(([kind, rs]) => (
              <div key={kind} className="rounded-2xl bg-white p-4">
                <p className={cx("font-black", kind === "vz" ? "text-[color:var(--ge-success)]" : "text-[color:var(--ge-ink)]")}>
                  {kind === "vz" ? <Vz>{L.t("vz.cap")}</Vz> : <Fv>{L.t("fv.cap")}</Fv>}
                  {kind === "vz" && cyc === "semanal" && <span className="ml-1 text-sm font-semibold text-[color:var(--ge-muted)]">· {L.t(summer ? "vz.summer" : "vz.winter")}</span>}
                  {kind === "fv" && <span className="ml-1 text-sm font-semibold text-[color:var(--ge-muted)]">· {L.t("fv.dearer")}</span>}
                </p>
                <ul className="mt-2 space-y-2">
                  {rs.map(([d, hs]) => (
                    <li key={d} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="text-[0.95rem] text-[color:var(--ge-muted)] sm:w-28 sm:flex-none">{L.t(d)}</span>
                      <span className="flex flex-wrap gap-1.5">{hs.map(h => <b key={h} className="rounded-lg bg-[color:var(--ge-soft)] px-2 py-0.5 text-[0.95rem] font-bold tabular-nums">{h}</b>)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Callout tone="warn" icon="info" title={L.t("vz.2027.title")}>
            <p><Tx k={cyc === "diario" ? "vz.2027.daily" : "vz.2027.weekly"} vars={{ t: <Time>{cyc === "diario" ? "22:30 → 08:00" : "00:30 → 07:00"}</Time> }} /> <A href={ERSE_2027}>{L.t("vz.2027.src")}</A></p>
          </Callout>
        </div>
      )}
    </section>
  );
}

/* ===================== Guia: passos + telemóvel ===================== */
function Guide({ G, b, f, v, setVer, p, cyc, setCyc, cur, n, screen, photo, finished, go, finish, desk, share }) {
  const L = useL();
  const { gk, g } = G;
  const last = cur === n - 1;
  const k0 = g.screens[g.screens.length - 1].k || g.k || "app";
  const where = L.t(k0 === "car" ? "guide.whereCar" : k0 === "wb" ? "guide.whereWb" : "guide.whereApp");
  const sub = b.other ? L.t("guide.subOther") : gk === "quad" ? L.t("guide.subQuad", { where }) : gk === "legacy" ? L.t("guide.subLegacy", { where }) : L.t("guide.sub", { where });
  const title = b.other ? L.t("other.title") : b.name + " " + famName(L, b, f);
  const oldNote = f && f.old && f.versions[0].note;
  const mock = <PhoneMock g={g} b={b} p={p} gk={gk} screen={screen} family={f} photo={photo} />;
  const stepBtn = (s, i, compact) => {
    const isCur = i === cur && !finished, past = i < cur || finished;
    return (
      <li key={i}>
        <button type="button" onClick={() => go(i)} aria-current={isCur ? "step" : undefined}
          className={cx("ge-step ge-focus flex w-full items-start gap-3.5 rounded-2xl border-2 p-3.5 text-left sm:p-4", isCur ? "is-cur border-[color:var(--ge-green)] bg-[#F1FCF7] shadow-[var(--sh-2)]" : "border-transparent hover:bg-[color:var(--ge-soft)]")}>
          <span aria-hidden="true" className={cx("mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-black motion-safe:transition-colors",
            isCur ? "bg-[color:var(--ge-green)] text-[color:var(--ge-ink)]" : past ? "bg-[color:var(--ge-success)] text-white" : "bg-[#EEEBF2] text-[color:var(--ge-muted)]")}>
            {past && !isCur ? <Icon n="check" className="h-4 w-4" /> : i + 1}
          </span>
          <span className={cx("min-w-0 flex-1 leading-relaxed", compact ? "text-[0.98rem]" : "text-[1.05rem]", isCur ? "text-[color:var(--ge-ink)]" : "text-[color:var(--ge-muted)]")}>
            <span className="sr-only">{L.t("step.of", { i: i + 1, n })}: </span><Rich text={s} b={b} p={p} />
          </span>
        </button>
      </li>
    );
  };
  return (
    <div>
      {/* Cabeçalho do guia: carro, versão e app */}
      <div className="ge-card flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {f && !b.other
            ? <CarPhoto photo={photo} alt={b.name + " " + f.name} className="h-[72px] w-[108px] flex-none rounded-xl sm:h-20 sm:w-[120px]" />
            : <BrandLogo b={b} size="lg" />}
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ge-muted)]">{!b.other && <BrandLogo b={b} size="xs" />}{b.other ? L.t("guide.general") : b.name}</p>
            <h2 id="tguia" tabIndex={-1} className="text-[length:var(--fs-h3)] font-black leading-tight focus:outline-none">{title}</h2>
            <p className="text-[0.98rem] text-[color:var(--ge-muted)]">{sub}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          {f && f.versions.length > 1 && (
            <label className="flex min-w-0 items-center gap-2 text-sm font-bold">
              <span className="flex-none">{L.t("guide.version")}</span>
              <span className="relative min-w-0 flex-1 md:w-64 md:flex-none">
                <select value={v ? f.versions.indexOf(v) : -1} onChange={e => setVer(+e.target.value)}
                  className="ge-focus h-11 w-full cursor-pointer appearance-none truncate rounded-xl border-2 border-[color:var(--ge-line)] bg-white pl-3 pr-9 text-[0.95rem] font-semibold hover:border-[#B9B3C6]">
                  <option value={-1}>{L.t("guide.versionAny")}</option>
                  {f.versions.map((x, i) => <option key={x.name + i} value={i}>{x.name}{x.note ? " · " + L.tg(x.note) : ""}</option>)}
                </select>
                <Icon n="chevD" className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
              </span>
            </label>
          )}
          {b.app && <div className="flex flex-col gap-1.5 md:items-end">
            <p className="text-sm text-[color:var(--ge-muted)]"><Tx k="guide.appIs" vars={{ app: <b className="font-bold text-[color:var(--ge-ink)]">{b.app}</b> }} /></p>
            <StoreButtons app={b.app} size="sm" />
          </div>}
          {v && v.id && <A href={evUrl(b, v)} className="text-sm">{L.t("guide.specs")}</A>}
        </div>
      </div>

      <div className="mt-4"><VazioPanel cyc={cyc} setCyc={setCyc} p={p} /></div>

      <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_288px] md:gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="text-[length:var(--fs-h3)] font-black">{L.t("guide.stepsTitle", { n })}</h3>
            <p className="text-sm font-bold tabular-nums text-[color:var(--ge-muted)]" aria-hidden="true">{finished ? L.t("step.done") : L.t("step.of", { i: cur + 1, n })}</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E7E4EC]" role="progressbar" aria-label={L.t("step.progress")} aria-valuemin={1} aria-valuemax={n} aria-valuenow={finished ? n : cur + 1} aria-valuetext={finished ? L.t("step.done") : L.t("step.of", { i: cur + 1, n })}>
            <div className="h-full rounded-full bg-[color:var(--ge-green)] motion-safe:transition-[width] motion-safe:duration-300" style={{ width: ((finished ? n : cur + 1) / n * 100) + "%" }} />
          </div>
          <Prep b={b} k0={k0} />

          {desk ? (
            <>
              <ol className="mt-4 flex flex-col gap-1.5" aria-label={L.t("guide.stepsLabel", { n })}>{g.steps.map((s, i) => stepBtn(s, i))}</ol>
              {!finished && <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => go(cur - 1)} disabled={cur === 0} className="ge-btn ge-btn--ghost"><Icon n="chevL" />{L.t("step.prev")}</button>
                {last ? <button type="button" onClick={finish} className="ge-btn ge-btn--green">{L.t("step.finish")}<Icon n="check" /></button>
                  : <button type="button" onClick={() => go(cur + 1)} className="ge-btn ge-btn--green">{L.t("step.next")}<Icon n="chevR" /></button>}
                <p className="ml-auto hidden items-center gap-1.5 text-sm text-[color:var(--ge-muted)] lg:flex"><Tx k="step.keys" vars={{ l: <kbd className="ge-kbd">←</kbd>, r: <kbd className="ge-kbd">→</kbd> }} /></p>
              </div>}
            </>
          ) : (
            <>
              {/* Telemóvel: um passo de cada vez, com o ecrã logo a seguir */}
              {!finished && <div id="stepNow" className="mt-4 scroll-mt-[calc(var(--hdr)+12px)] rounded-2xl border-2 border-[color:var(--ge-green)] bg-[#F1FCF7] p-4">
                <p className="text-sm font-bold uppercase tracking-[.08em] text-[color:var(--ge-success)]">{L.t("step.of", { i: cur + 1, n })}</p>
                <p key={cur} className="ge-in mt-1 text-[1.08rem] leading-relaxed"><Rich text={g.steps[cur]} b={b} p={p} /></p>
              </div>}
              <div className="mt-5">{mock}</div>
              <details className="group mt-5 rounded-2xl border border-[color:var(--ge-line-soft)] bg-white">
                <summary className="ge-focus flex min-h-[52px] cursor-pointer list-none items-center gap-3 rounded-2xl px-4 font-bold [&::-webkit-details-marker]:hidden">
                  <Icon n="list" className="h-5 w-5 text-[color:var(--ge-blue)]" /><span className="flex-1">{L.t("guide.allSteps", { n })}</span><Icon n="chevD" className="h-5 w-5 motion-safe:transition-transform group-open:rotate-180" />
                </summary>
                <ol className="flex flex-col gap-1 px-2 pb-2" aria-label={L.t("guide.stepsLabel", { n })}>{g.steps.map((s, i) => stepBtn(s, i, true))}</ol>
              </details>
            </>
          )}

          {finished && <Done p={p} share={share} restart={() => go(0)} />}

          <div className="mt-6 flex flex-col gap-3">
            {g.power && <Callout tone="power" icon="bolt" title={L.t("callout.power")}>
              <p><Rich text={g.power} b={b} p={p} /></p>
              <p className="text-[color:var(--ge-muted)]">{L.t("callout.powerNote")}</p>
            </Callout>}
            {g.tip && <Callout tone="tip" icon="bulb" title={L.t("callout.tip")}><p><Rich text={g.tip} b={b} p={p} /></p></Callout>}
            {oldNote && <Callout tone="warn" icon="info" title={L.t("callout.old")}><p>{L.t("callout.oldText", { note: L.tg(oldNote) })}</p></Callout>}
          </div>
          <Feedback gk={gk} b={b} f={f} />
          <p className="mt-4 text-sm text-[color:var(--ge-muted)]">{L.t("guide.reviewed", { date: L.t("guide.reviewedDate") })} {L.t("guide.menuNames")}</p>
        </div>
        {desk && <div className="sticky top-[calc(var(--hdr)+24px)] self-start print:hidden">{mock}</div>}
      </div>
    </div>
  );
}

/* Antes de começar (fechado por omissão: só abre quem precisa) */
function Prep({ b, k0 }) {
  const L = useL();
  const keys = k0 === "car" ? ["prep.car1", "prep.car2", "prep.car3"] : k0 === "wb" ? ["prep.wb1", "prep.wb2", "prep.wb3"] : ["prep.app1", "prep.app2", "prep.app3", "prep.app4"];
  const app = b.app ? <AppName name={b.app} /> : b.other ? L.t("app.fromBrand") : L.t("app.officialOf", { brand: b.name });
  return (
    <details className="group mt-4 rounded-2xl bg-[color:var(--ge-soft)]">
      <summary className="ge-focus flex min-h-[48px] cursor-pointer list-none items-center gap-3 rounded-2xl px-4 font-bold [&::-webkit-details-marker]:hidden">
        <Icon n="check" className="h-5 w-5 text-[color:var(--ge-success)]" /><span className="flex-1">{L.t("prep.title", { n: keys.length })}</span><Icon n="chevD" className="h-5 w-5 motion-safe:transition-transform group-open:rotate-180" />
      </summary>
      <ul className="space-y-2 px-4 pb-4">
        {keys.map(k => (
          <li key={k} className="flex gap-2.5 text-[0.98rem] leading-relaxed text-[#3A3648]">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--ge-success)]" />
            <span><Tx k={k} vars={{ app }} /></span>
          </li>
        ))}
      </ul>
    </details>
  );
}

/* Concluído: confirmar na primeira noite + guardar o guia */
function Done({ p, share, restart }) {
  const L = useL();
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (!el) return; try { el.focus({ preventScroll: true }); } catch (e) { } el.scrollIntoView && el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "center" }); }, []);
  return (
    <div ref={ref} tabIndex={-1} className="ge-in mt-5 rounded-2xl border-2 border-[color:var(--ge-green)] bg-[color:var(--ge-mint)] p-5 focus:outline-none sm:p-6">
      <h4 className="flex items-center gap-2.5 text-xl font-black text-[color:var(--ge-success)]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--ge-green)] text-[color:var(--ge-ink)]"><Icon n="check" className="h-4 w-4" /></span>{L.t("done.title")}</h4>
      <p className="mt-2"><Tx k="done.check" vars={{ t: <Time>{p.s}</Time> }} /></p>
      <p className="mt-1 text-[color:var(--ge-muted)]">{L.t("done.ifNot")}</p>
      <ShareGuide {...share} />
      <button type="button" onClick={restart} className="ge-link ge-focus mt-3 inline-flex min-h-[44px] items-center text-[0.98rem]">{L.t("done.again")}</button>
    </div>
  );
}
function ShareGuide({ linkUrl, carTitle, copyLink, copied }) {
  const L = useL();
  const [native, setNative] = useState(false);
  useEffect(() => { try { setNative(!!(navigator.share && window.matchMedia && window.matchMedia("(pointer: coarse)").matches)); } catch (e) { } }, []);
  const title = L.t("share.title", { car: carTitle });
  const url = linkUrl();
  const doShare = () => { track("guia_partilhar"); try { navigator.share({ title, url }).catch(() => { }); } catch (e) { } };
  const mail = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(L.t("share.body") + "\n" + url);
  const wa = "https://wa.me/?text=" + encodeURIComponent(title + "\n" + url);
  return (
    <div className="mt-5 border-t border-[#40DDA6]/60 pt-5 print:hidden">
      <p className="font-bold">{L.t(native ? "share.save" : "share.send")}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {native && <button type="button" onClick={doShare} className="ge-btn ge-btn--blue"><Icon n="share" />{L.t("share.share")}</button>}
        {!native && <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => track("guia_whatsapp")} className="ge-btn ge-btn--ghost"><Icon n="chat" />WhatsApp<Ext /></a>}
        {!native && <a href={mail} onClick={() => track("guia_email")} className="ge-btn ge-btn--ghost"><Icon n="mail" />{L.t("share.email")}</a>}
        <button type="button" onClick={copyLink} className="ge-btn ge-btn--ghost"><Icon n={copied ? "check" : "link"} />{L.t(copied ? "share.copied" : "share.copy")}</button>
      </div>
    </div>
  );
}
/* Este guia ajudou? Respostas fechadas, sem dados pessoais (evento guia_feedback no GTM) */
const MOTIVOS = ["fb.r1", "fb.r2", "fb.r3", "fb.r4"];
function Feedback({ gk, b, f }) {
  const L = useL();
  const [ans, setAns] = useState(null), [motivo, setMotivo] = useState(null);
  const send = (resposta, m) => { try { (window.dataLayer = window.dataLayer || []).push({ event: m ? "guia_feedback_motivo" : "guia_feedback", resposta, motivo: m || "", marca: b.other ? "outra" : b.name, modelo: f ? f.name : "", guia: gk, idioma: L.lang }); } catch (e) { } };
  const done = ans === "sim" || motivo;
  return (
    <div className="mt-6 rounded-2xl border border-[color:var(--ge-line-soft)] bg-white p-4 sm:p-5 print:hidden" aria-live="polite">
      {done ? <p className="flex items-center gap-2 font-bold text-[color:var(--ge-success)]"><Icon n="check" />{L.t(ans === "sim" ? "fb.thanks" : "fb.thanksNo")}</p>
        : ans === "nao" ? (
          <fieldset>
            <legend className="font-bold">{L.t("fb.what")}</legend>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {MOTIVOS.map(m => <button key={m} type="button" onClick={() => { setMotivo(m); send("nao", m); }} className="ge-btn ge-btn--ghost min-h-[44px] justify-start px-4 sm:justify-center">{L.t(m)}</button>)}
            </div>
          </fieldset>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <p className="flex-1 font-bold">{L.t("fb.q")}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setAns("sim"); send("sim"); }} className="ge-btn ge-btn--ghost min-h-[44px] flex-1 px-6 sm:flex-none">{L.t("fb.yes")}</button>
              <button type="button" onClick={() => { setAns("nao"); send("nao"); }} className="ge-btn ge-btn--ghost min-h-[44px] flex-1 px-6 sm:flex-none">{L.t("fb.no")}</button>
            </div>
          </div>
        )}
    </div>
  );
}

/* ===================== Barra fixa de passos (telemóvel) ===================== */
function StepBar({ show, cur, n, go, finish }) {
  const L = useL();
  const last = cur === n - 1;
  return (
    <div aria-hidden={!show} className={cx("fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--ge-line-soft)] bg-white/95 px-3 pb-[max(.625rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_-12px_rgba(23,20,36,.25)] backdrop-blur md:hidden print:hidden motion-safe:transition-transform motion-safe:duration-200", show ? "translate-y-0" : "pointer-events-none translate-y-full")}>
      <nav aria-label={L.t("step.nav")} className="mx-auto flex max-w-md items-center gap-2">
        <button type="button" tabIndex={show ? 0 : -1} onClick={() => go(cur - 1)} disabled={cur === 0} className="ge-btn ge-btn--ghost h-12 min-w-[48px] flex-1 px-3"><Icon n="chevL" /><span>{L.t("step.prevShort")}</span></button>
        <div className="flex w-16 flex-none flex-col items-center gap-1" aria-hidden="true">
          <span className="text-sm font-black tabular-nums">{cur + 1}/{n}</span>
          <span className="h-1 w-full overflow-hidden rounded-full bg-[#E7E4EC]"><span className="block h-full rounded-full bg-[color:var(--ge-green)]" style={{ width: ((cur + 1) / n * 100) + "%" }} /></span>
        </div>
        {last ? <button type="button" tabIndex={show ? 0 : -1} onClick={finish} className="ge-btn ge-btn--green h-12 flex-1 px-3">{L.t("step.finishShort")}<Icon n="check" /></button>
          : <button type="button" tabIndex={show ? 0 : -1} onClick={() => go(cur + 1)} className="ge-btn ge-btn--green h-12 flex-1 px-3">{L.t("step.nextShort")}<Icon n="chevR" /></button>}
      </nav>
    </div>
  );
}

/* ===================== Tarifário + solar ===================== */
function OfferNotes({ onColor }) {
  const L = useL();
  return (
    <div className={cx("mt-4 space-y-1 text-[13px] leading-relaxed", onColor ? "text-[color:var(--ge-ink)]" : "text-[color:var(--ge-muted)]")}>
      <p>*{L.t("offer.notePrice")}</p>
      <p>**{L.t("offer.noteDiscount")} <A href={OFFER.precosPdf} className={onColor ? "!text-[color:var(--ge-ink)] decoration-[color:var(--ge-ink)]" : ""}>{L.t("offer.prices")}</A>.</p>
    </div>
  );
}
function Promo() {
  const L = useL();
  const price = L.num4(OFFER.precoNum) + " €/kWh";
  return (
    <section aria-labelledby="tpromo" className="print:hidden">
      <h2 id="tpromo" className="sr-only">{L.t("promo.title")}</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <article className="flex flex-col rounded-[var(--r-l)] bg-[color:var(--ge-green)] p-6 sm:p-8">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white"><Moon className="h-6 w-6" /></span>
          <p className="text-sm font-bold uppercase tracking-[.08em] text-[color:var(--ge-blue)]">{L.t("offer.name")}</p>
          <h3 className="mt-1 text-[length:var(--fs-h2)] font-black leading-tight">{L.t("promo.tTitle")}</h3>
          <p className="mt-3 text-[1.05rem]"><Tx k="promo.tPrice" vars={{ price: <b className="whitespace-nowrap">{price}*</b> }} /></p>
          <ul className="mt-3 space-y-1.5">
            {["promo.t1", "promo.t2", "promo.t3"].map(k => (
              <li key={k} className="flex gap-2"><span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[color:var(--ge-ink)] text-[color:var(--ge-green)]"><Icon n="check" className="h-3 w-3" /></span><span><Tx k={k} vars={{ d: OFFER.descontoClientes }} /></span></li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row sm:flex-wrap">
            <a href={utm(OFFER.adesao, "promo")} target="_blank" rel="noopener noreferrer" onClick={() => track("promo_aderir")} className="ge-btn ge-btn--blue">{L.t("cta.join")}<Icon n="arrow" /><Ext /></a>
            <a href={OFFER.telefoneHref} onClick={() => track("promo_telefone")} className="ge-btn ge-btn--outline-ink"><Icon n="phone" />{OFFER.telefone}</a>
          </div>
          <p className="mt-3 text-sm">{L.t("wb.hours")}</p>
          <OfferNotes onColor />
        </article>
        <article className="flex flex-col rounded-[var(--r-l)] bg-[color:var(--ge-solar)] p-6 sm:p-8">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[color:var(--ge-warning)]"><Icon n="sunIc" className="h-6 w-6" /></span>
          <p className="text-sm font-bold uppercase tracking-[.08em] text-[color:var(--ge-ink)]">{L.t("promo.sKicker")}</p>
          <h3 className="mt-1 text-[length:var(--fs-h2)] font-black leading-tight">{L.t("promo.sTitle")}</h3>
          <p className="mt-3 text-[1.05rem]">{L.t("promo.sText")}</p>
          <div className="mt-auto pt-6">
            <a href={utm(OFFER.solar, "promo_solar")} target="_blank" rel="noopener noreferrer" onClick={() => track("promo_solar")} className="ge-btn ge-btn--ink">{L.t("promo.sCta")}<Icon n="arrow" /><Ext /></a>
          </div>
        </article>
      </div>
    </section>
  );
}
function Sources() {
  const L = useL();
  const v = L.eur(OFFER.consumo100 * OFFER.precoNum * (1 + OFFER.iva));
  const items = [
    <Tx k="src.mock" />,
    <Tx k="src.manuals" vars={{
      tesla: <A href="https://www.tesla.com/ownersmanual/modely/en_us/GUID-76995CEC-6402-4BFF-99FA-CEFA36E64A19.html">Tesla</A>,
      renault: <A href="https://www.user-manual.renault.com/pt/content/openr-link/veiculo/veiculo-eletrico">Renault</A>,
      bmw: <A href="https://faq.bmwusa.com/s/article/My-BMW-App-Charging-Charge-Climate-Timer-Charging-mode-Charge-in-time-frame-rlLVj?language=en_US">My BMW</A>,
      kia: <A href="http://webmanual.kia.com/DA_GEN2_V/AV/EUR/Portuguese/002_Features_electricvehicle.html">Kia</A>,
      vw: <A href="https://www.volkswagen.pt/conectividade-e-mobilidade/vw-connect-id/conforto">Volkswagen</A>,
      peugeot: <A href="https://www.peugeot.pt/conselhos-sugestoes/eletrificacao/carregamento/como-encontrar-pontos-de-carregamento-publicos-para-um-carro-eletrico.html">Peugeot</A>,
    }} />,
    <Tx k="src.models" vars={{ ev: <A href="https://ev-database.org/">EV Database</A> }} />,
    <Tx k="src.logos" vars={{ ds: <A href="https://github.com/filippofilip95/car-logos-dataset">car-logos-dataset</A> }} />,
    <Tx k="src.offer" vars={{ site: <A href={OFFER.pagina}>goldenergy.pt</A> }} />,
    <>{L.t("src.illus")}</>,
    <>{L.t("cost.howTitle")}: {L.t("cost.calc", { kwh: OFFER.consumo100, price: L.num4(OFFER.precoNum) + " €/kWh", vat: Math.round(OFFER.iva * 100), v })}. {L.t("cost.note", { kwh: OFFER.consumo100 })}</>,
    <Tx k="src.cycles" vars={{ erse: <A href={ERSE_2027}>ERSE</A> }} />,
  ];
  return (
    <details className="group ge-card [contain-intrinsic-size:auto_64px] [content-visibility:auto] print:hidden">
      <summary className="ge-focus flex min-h-[56px] cursor-pointer list-none items-center gap-3 rounded-[var(--r-l)] px-5 font-bold sm:px-7 [&::-webkit-details-marker]:hidden">
        <span className="flex-1">{L.t("src.title")}</span><Icon n="chevD" className="h-5 w-5 motion-safe:transition-transform group-open:rotate-180" />
      </summary>
      <ul className="list-disc space-y-2 px-5 pb-6 pl-10 text-sm leading-relaxed text-[color:var(--ge-muted)] sm:px-7 sm:pl-12">
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </details>
  );
}

/* ===================== Estilos: tokens de design + componentes ===================== */
const PAGE_CSS = `
.gm{overflow-wrap:break-word;-webkit-hyphens:auto;hyphens:auto}
:root{--ge-green:#40DDA6;--ge-blue:#382F83;--ge-purple:#522399;--ge-coral:#FF6F61;
--ge-ink:#171424;--ge-muted:#514D5F;--ge-surface:#FFFFFF;--ge-soft:#F6F4F8;--ge-line:#D9D5E0;--ge-line-soft:#E7E4EC;
--ge-success:#146B4F;--ge-warning:#7A4B00;--ge-mint:#E6FAF2;--ge-mint-2:#C9F5E5;--ge-amber-bg:#FFF6E5;--ge-solar:#FFC845;
--r-s:.5rem;--r-m:1rem;--r-l:1.75rem;--r-pill:999px;
--sh-1:0 1px 2px rgba(23,20,36,.06),0 1px 1px rgba(23,20,36,.04);--sh-2:0 12px 32px -18px rgba(23,20,36,.30);--sh-3:0 24px 60px -24px rgba(23,20,36,.38);
--ease:cubic-bezier(.2,.8,.2,1);--ease-out:cubic-bezier(.22,1,.36,1);--dur-1:120ms;--dur-2:200ms;--dur-3:320ms;
--fs-display:clamp(2.05rem,1.45rem + 2.6vw,3.5rem);--fs-h2:clamp(1.5rem,1.25rem + 1.1vw,2.25rem);--fs-h3:clamp(1.2rem,1.1rem + .45vw,1.5rem);--fs-body:clamp(1.0625rem,1.03rem + .15vw,1.125rem);
--hdr:76px}
@media (min-width:768px){:root{--hdr:88px}}
html{scroll-padding-top:calc(var(--hdr) + 16px);-webkit-text-size-adjust:100%;text-size-adjust:100%}
.ge{font-family:'Brandon Grotesque','Brandon Text',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:var(--fs-body);line-height:1.6;color:var(--ge-ink);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:clip}
.ge h1,.ge h2,.ge h3,.ge h4{letter-spacing:-.005em;text-wrap:balance}
.ge p{text-wrap:pretty}
.ge-focus:focus-visible,.ge-btn:focus-visible,.ge-chip:focus-visible,.ge-link:focus-visible{outline:3px solid var(--ge-blue);outline-offset:2px}
.ge-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:48px;padding:0 1.5rem;border-radius:var(--r-pill);border:2px solid transparent;font-weight:700;font-size:1rem;line-height:1.15;text-decoration:none;white-space:nowrap;cursor:pointer;-webkit-tap-highlight-color:transparent;
transition:background-color var(--dur-2) var(--ease),border-color var(--dur-2) var(--ease),color var(--dur-2) var(--ease),box-shadow var(--dur-2) var(--ease),transform var(--dur-1) var(--ease)}
.ge-btn:hover{box-shadow:var(--sh-2)}
.ge-btn:active{transform:translateY(1px) scale(.985);box-shadow:none}
.ge-btn:disabled{opacity:.4;cursor:not-allowed;box-shadow:none;transform:none}
.ge-btn--blue{background:var(--ge-blue);color:#fff}.ge-btn--blue:hover{background:#2A2366}
.ge-btn--green{background:var(--ge-green);color:var(--ge-ink)}.ge-btn--green:hover{background:#5FE6B7}
.ge-btn--ink{background:var(--ge-ink);color:#fff}.ge-btn--ink:hover{background:#2C2740}
.ge-btn--ghost{background:#fff;color:var(--ge-ink);border-color:var(--ge-line)}.ge-btn--ghost:hover:not(:disabled){border-color:var(--ge-ink);background:#fff}
.ge-btn--outline-ink{background:transparent;color:var(--ge-ink);border-color:var(--ge-ink)}.ge-btn--outline-ink:hover{background:rgba(255,255,255,.4)}
.ge-link{color:var(--ge-blue);font-weight:600;text-decoration:underline;text-decoration-color:var(--ge-green);text-decoration-thickness:2px;text-underline-offset:3px;border-radius:3px;transition:text-decoration-color var(--dur-2) var(--ease)}
.ge-link:hover{text-decoration-color:var(--ge-blue)}
.ge-card{background:#fff;border:1px solid var(--ge-line-soft);border-radius:var(--r-l);box-shadow:var(--sh-1)}
.ge-chip{display:inline-flex;align-items:center;gap:.5rem;min-height:44px;max-width:100%;padding:.25rem .875rem .25rem .375rem;border-radius:var(--r-pill);border:1.5px solid var(--ge-line);background:#fff;color:var(--ge-ink);font-weight:600;font-size:.98rem;cursor:pointer;-webkit-tap-highlight-color:transparent;
transition:border-color var(--dur-2) var(--ease),background-color var(--dur-2) var(--ease),box-shadow var(--dur-2) var(--ease),transform var(--dur-1) var(--ease)}
.ge-chip:hover{border-color:var(--ge-ink);box-shadow:var(--sh-2);transform:translateY(-1px)}
.ge-chip:active{transform:none;box-shadow:none}
.ge-chip[aria-pressed=true]{border-color:var(--ge-success);background:var(--ge-mint);box-shadow:inset 0 0 0 1px var(--ge-success)}
.ge-brand-list-item{display:flex;min-height:48px;width:100%;align-items:center;gap:.6rem;border:1px solid transparent;border-radius:12px;padding:.35rem .55rem;text-align:left;font-size:.95rem;font-weight:650;color:var(--ge-ink);transition:background-color var(--dur-2) var(--ease),border-color var(--dur-2) var(--ease)}
.ge-brand-list-item:hover{background:var(--ge-soft);border-color:var(--ge-line-soft)}
.ge-brand-list-item.is-selected{background:var(--ge-mint);border-color:var(--ge-success)}
.ge-brand-chip{display:inline-flex;align-items:center;gap:.65rem;min-height:50px;max-width:100%;padding:.35rem .95rem .35rem .4rem;border-radius:14px;border:1px solid var(--ge-line-soft);background:#fff;color:var(--ge-ink);font-weight:700;font-size:.98rem;box-shadow:var(--sh-1);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform var(--dur-1) var(--ease),border-color var(--dur-2) var(--ease),background-color var(--dur-2) var(--ease),box-shadow var(--dur-2) var(--ease)}
.ge-brand-chip .brand-logo{height:34px;width:34px;border:0;border-radius:10px;background:var(--ge-soft);padding:5px}
.ge-brand-chip .brand-logo img{mix-blend-mode:multiply}
.ge-brand-chip:hover{transform:translateY(-2px);border-color:#B9B2C8;box-shadow:var(--sh-2)}
.ge-brand-chip:active{transform:translateY(0);box-shadow:var(--sh-1)}
.ge-brand-chip[aria-pressed=true]{border-color:var(--ge-success);background:var(--ge-mint);box-shadow:inset 0 0 0 1px var(--ge-success),var(--sh-1)}
.ge-model-chip{display:inline-flex;align-items:center;justify-content:center;gap:.35rem;min-width:76px;min-height:48px;max-width:100%;padding:.55rem .95rem;border-radius:14px;border:1px solid var(--ge-line);background:#fff;color:var(--ge-ink);font-weight:650;font-size:.98rem;line-height:1.2;text-align:center;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform var(--dur-1) var(--ease),border-color var(--dur-2) var(--ease),background-color var(--dur-2) var(--ease),box-shadow var(--dur-2) var(--ease)}
.ge-model-chip .model-chip-label{min-width:0;text-align:center}
.ge-model-chip .model-chip-note{font-size:.72rem;font-weight:600;color:var(--ge-muted)}
.ge-model-chip:hover{transform:translateY(-1px);border-color:#B9B2C8;box-shadow:var(--sh-1)}
.ge-model-chip[aria-pressed=true]{border-color:var(--ge-success);background:var(--ge-mint);box-shadow:inset 0 0 0 1px var(--ge-success)}

.ge-step{transition:background-color var(--dur-2) var(--ease),border-color var(--dur-2) var(--ease),box-shadow var(--dur-2) var(--ease)}
.ge-kbd{display:inline-flex;min-width:1.6rem;height:1.6rem;align-items:center;justify-content:center;border-radius:.4rem;border:1px solid var(--ge-line);border-bottom-width:2px;background:#fff;font:600 .8rem/1 system-ui,sans-serif;color:var(--ge-ink)}
.ge-in{animation:geIn var(--dur-2) var(--ease-out) both}
@keyframes geIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ge-skel{background:linear-gradient(90deg,#EEEBF2 0,#F8F7FA 45%,#EEEBF2 90%);background-size:200% 100%;animation:geSk 1.2s linear infinite}
@keyframes geSk{to{background-position:-200% 0}}
@media (max-width:380px){.ge-phone{zoom:.9}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}.ge *,.ge *::before,.ge *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
@media print{.ge header,.ge nav{position:static!important}}`;

/* ===================== Página ===================== */
export default function GuiaCarregamento({ initialLang = "pt", initialDict = null, ptDict = null, loadDict = null }) {
  /* Idioma */
  const [lang, setLang] = useState(initialLang);
  const [dict, setDict] = useState(initialDict || ptDict);
  const L = useMemo(() => makeI18n(lang, dict, ptDict), [lang, dict, ptDict]);
  const changeLang = code => {
    const apply = d => { setDict(d); setLang(code); persistLang(code); track("idioma", { idioma: code }); };
    if (code === "pt" && ptDict) return apply(ptDict);
    if (loadDict) Promise.resolve(loadDict(code)).then(apply).catch(() => { });
  };
  useEffect(() => { persistLang(lang, { url: lang !== "pt" || /[?&]lang=/.test((typeof location !== "undefined" && location.search) || ""), store: false }); }, []);
  useEffect(() => {
    try { document.title = L.t("meta.title"); const m = document.querySelector('meta[name="description"]'); m && m.setAttribute("content", L.t("meta.desc")); } catch (e) { }
  }, [L]);

  /* Seleção */
  const [brandName, setBrandName] = useState("");
  const [famIdx, setFamIdx] = useState(-1);
  const [verIdx, setVerIdx] = useState(-1);
  const [cyc, setCyc] = useState("diario");
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");
  const [hdrHidden, setHdrHidden] = useState(false);
  const [guideIn, setGuideIn] = useState(false);
  const inputRef = useRef(null), guideRef = useRef(null), pickRef = useRef(null);
  const desk = useMedia("(min-width: 768px)") !== false;

  const b = brandName === "__other" ? OTHER : BRANDS.find(x => x.name === brandName) || null;
  const f = b && !b.other && famIdx > -1 ? b.families[famIdx] : null;
  const v = f ? (verIdx > -1 ? f.versions[verIdx] : null) : null;
  const ready = !!(b && (b.other || f));
  const photo = REMOTE && b && f && !b.other ? photoFor(b, f) : null;
  const p = useMemo(() => ({ s: CYC[cyc][0], e: CYC[cyc][1], days: [1, 1, 1, 1, 1, 1, 1] }), [cyc]);
  const G = ready ? guideFor(b, f) : null;
  const n = G ? G.g.steps.length : 0;
  const cur = Math.min(step, Math.max(0, n - 1));
  const screen = G ? Math.min(G.g.map[cur] || 0, G.g.screens.length - 1) : 0;
  const carTitle = b ? (b.other ? L.t("other.title") : b.name + (f ? " " + famName(L, b, f) : "")) : "";

  const say = t => { setMsg(""); setTimeout(() => setMsg(t), 60); };
  const scrollToEl = (el, block = "start") => { if (el && el.scrollIntoView) el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block }); };
  const openGuide = () => setTimeout(() => {
    const h = document.getElementById("tguia"); scrollToEl(guideRef.current);
    if (h) { try { h.focus({ preventScroll: true }); } catch (e) { } }
  }, 80);

  const resetGuide = () => { setStep(0); setFinished(false); };
  function pickBrand(name, fi) {
    const nb = BRANDS.find(x => x.name === name); if (!nb) return;
    const idx = fi != null ? fi : nb.families.length === 1 ? 0 : -1;
    setBrandName(name); setFamIdx(idx); setVerIdx(-1); resetGuide();
    if (idx > -1) { say(L.t("say.chosen", { car: nb.name + " " + nb.families[idx].name, n: guideFor(nb, nb.families[idx]).g.steps.length })); openGuide(); }
    else say(L.t("say.brand", { brand: nb.name }));
  }
  function pickModel(i) { setFamIdx(i); setVerIdx(-1); resetGuide(); say(L.t("say.chosen", { car: b.name + " " + b.families[i].name, n: guideFor(b, b.families[i]).g.steps.length })); openGuide(); }
  function pickOther() { setBrandName("__other"); setFamIdx(-1); setVerIdx(-1); resetGuide(); say(L.t("say.other")); openGuide(); }
  function changeCar() {
    track("alterar_carro");
    scrollToEl(pickRef.current, "start");
    setTimeout(() => { const el = inputRef.current; if (el) { try { el.focus({ preventScroll: true }); el.select(); } catch (e) { } } }, prefersReduced() ? 0 : 350);
  }
  function go(i) {
    if (!G) return;
    const k = Math.max(0, Math.min(n - 1, i)); setStep(k); setFinished(false);
    say(L.t("step.of", { i: k + 1, n }) + ": " + plainText(L, G.g.steps[k], b, p));
    if (!desk) setTimeout(() => {
      const el = document.getElementById("stepNow"); if (!el) return;
      const r = el.getBoundingClientRect(); if (r.top < 70 || r.top > window.innerHeight * 0.45) scrollToEl(el);
    }, 30);
  }
  function finish() { setFinished(true); say(L.t("done.title")); track("guia_concluido", { marca: b && b.name, guia: G && G.gk }); }

  /* Teclas ← / → mudam de passo quando o guia está visível (não interfere com campos de texto) */
  const keyState = useRef({});
  keyState.current = { G, cur, n, guideIn, finished, go, finish };
  useEffect(() => {
    const h = e => {
      const s = keyState.current;
      if (!s.G || !s.guideIn || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target, tag = (t && t.tagName || "").toLowerCase();
      if (["input", "select", "textarea"].includes(tag) || (t && t.isContentEditable) || (t && t.closest && t.closest("[role=radiogroup],[role=listbox]"))) return;
      if (e.key === "ArrowRight") { e.preventDefault(); if (s.cur < s.n - 1) s.go(s.cur + 1); else if (!s.finished) s.finish(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); if (s.cur > 0) s.go(s.cur - 1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  /* O guia está no ecrã? (barra de passos no telemóvel e atalhos de teclado) */
  useEffect(() => {
    const el = guideRef.current; if (!el || typeof IntersectionObserver === "undefined") { setGuideIn(!!ready); return; }
    const io = new IntersectionObserver(([en]) => setGuideIn(en.isIntersecting), { rootMargin: "-30% 0px -30% 0px" });
    io.observe(el); return () => io.disconnect();
  }, [ready]);
  /* Cabeçalho: no telemóvel esconde ao descer e volta ao subir */
  useEffect(() => {
    if (desk) { setHdrHidden(false); return; }
    let y0 = window.scrollY || 0, raf = 0;
    const on = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const y = window.scrollY || 0; if (Math.abs(y - y0) > 8) { setHdrHidden(y > y0 && y > 160); y0 = y; } }); };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); raf && cancelAnimationFrame(raf); };
  }, [desk]);

  /* Ligação partilhável: ?lang=xx#marca=…&modelo=…&versao=…&ciclo=… */
  const hashStr = () => {
    if (!b) return "";
    const u = new URLSearchParams();
    if (b.other) u.set("marca", "outra"); else { u.set("marca", b.name); if (f) u.set("modelo", f.name); if (v && f.versions.length > 1) u.set("versao", v.name); }
    u.set("ciclo", cyc); return u.toString();
  };
  useEffect(() => { if (ready) { try { history.replaceState(history.state, "", location.pathname + location.search + "#" + hashStr()); } catch (e) { } } }, [ready, brandName, famIdx, verIdx, cyc]);
  useEffect(() => {
    let u; try { u = new URLSearchParams((location.hash || "").slice(1)); } catch (e) { return; }
    const m = u.get("marca"); if (!m) return;
    if (u.get("ciclo") === "semanal") setCyc("semanal");
    if (m === "outra") { setBrandName("__other"); return; }
    const nb = BRANDS.find(x => x.name === m); if (!nb) return;
    const fi = nb.families.findIndex(x => x.name === u.get("modelo"));
    const idx = fi > -1 ? fi : nb.families.length === 1 ? 0 : -1;
    setBrandName(nb.name); setFamIdx(idx);
    if (idx > -1) { const vi = nb.families[idx].versions.findIndex(x => x.name === u.get("versao")); if (vi > -1) setVerIdx(vi); setTimeout(() => scrollToEl(guideRef.current), 300); }
  }, []);
  const linkUrl = () => { let base = ""; try { base = location.href.split("#")[0]; } catch (e) { } return base + "#" + hashStr(); };
  function copyLink() {
    const url = linkUrl();
    const ok = () => { setCopied(true); say(L.t("share.copied")); setTimeout(() => setCopied(false), 2500); };
    const fb = () => {
      try { const ta = document.createElement("textarea"); ta.value = url; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); const r = document.execCommand("copy"); ta.remove(); r ? ok() : say(L.t("share.fail")); }
      catch (e) { say(L.t("share.fail")); }
    };
    try { navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(url).then(ok, fb) : fb(); } catch (e) { fb(); }
  }
  const showBar = !desk && ready && guideIn && !finished;

  return (
    <I18n.Provider value={L}>
      <div className="ge min-h-screen bg-[color:var(--ge-soft)]" lang={L.info.html}>
        <style>{DEVICE_CSS + PAGE_CSS}</style>
        <a href="#guia" className="sr-only z-[60] rounded-full bg-white px-4 py-2 font-bold text-[color:var(--ge-blue)] focus:not-sr-only focus:fixed focus:left-3 focus:top-3">{L.t("a11y.skip")}</a>

        {/* Cabeçalho fixo e minimalista */}
        <header className={cx("sticky top-0 z-40 border-b border-[color:var(--ge-line-soft)] bg-white/95 backdrop-blur print:static motion-safe:transition-transform motion-safe:duration-300", hdrHidden && "-translate-y-full")}>
          <div className="mx-auto flex h-[var(--hdr)] max-w-[1240px] items-center gap-3 px-4 sm:px-8 lg:px-10">
            <a href="https://goldenergy.pt/" className="ge-focus flex-none rounded-md" onClick={() => track("logo")}>
              <img src={LOGO} alt={L.t("a11y.logo")} width="120" height="73" className="h-[73px] w-[120px]" />
            </a>
            {ready && (
              <button type="button" onClick={changeCar} className="ge-focus ge-in ml-1 hidden min-h-[44px] min-w-0 items-center gap-2 rounded-full border border-[color:var(--ge-line)] bg-white py-1 pl-1.5 pr-3.5 text-sm hover:border-[color:var(--ge-ink)] sm:flex">
                <BrandLogo b={b} size="xs" /><span className="max-w-[16rem] truncate font-bold">{carTitle}</span><span className="ge-link flex-none">{L.t("hdr.change")}</span>
              </button>
            )}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {ready && <button type="button" onClick={changeCar} aria-label={L.t("hdr.changeCar") + ": " + carTitle} className="ge-focus flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--ge-line)] bg-white sm:hidden"><BrandLogo b={b} size="xs" /></button>}
              <LangMenu lang={lang} onChange={changeLang} />
              <a href={utm(OFFER.adesao, "header")} target="_blank" rel="noopener noreferrer" onClick={() => track("header_aderir")} className="ge-btn ge-btn--blue min-h-[44px] px-4 sm:px-5">
                <span className="sm:hidden">{L.t("cta.joinShort")}</span><span className="hidden sm:inline">{L.t("cta.join")}</span><Ext />
              </a>
            </div>
          </div>
        </header>

        {/* Topo: proposta de valor + pesquisa acima da dobra */}
        <section className="bg-[color:var(--ge-green)] print:hidden" aria-labelledby="th1">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-5 pb-12 pt-7 sm:px-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] md:items-center md:pb-16 md:pt-12 lg:gap-14 lg:px-10 lg:pb-20">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[.12em] text-[color:var(--ge-blue)]">{L.t("hero.kicker", { n: BRANDS.length })}</p>
              <h1 id="th1" className="mt-2 text-[length:var(--fs-display)] font-black leading-[1.04] text-[color:var(--ge-ink)]"><Tx k="hero.title" vars={{ vz: <span className="whitespace-nowrap text-[color:var(--ge-blue)]"><Moon className="mr-[0.12em] inline-block h-[0.82em] w-[0.82em] align-[-0.05em]" />{L.t("hero.titleVz")}</span> }} plain /></h1>
              <p className="mt-3 max-w-xl text-[1.1rem] leading-relaxed text-[color:var(--ge-ink)]">{L.t("hero.sub")}</p>
              <div ref={pickRef} className="mt-6 scroll-mt-[calc(var(--hdr)+12px)] rounded-[var(--r-l)] bg-white p-4 shadow-[var(--sh-3)] sm:p-6">
                <CarSearch inputRef={inputRef} onPick={pickBrand} onOther={pickOther} say={say} />
                <BrandPicker b={b} f={f} onBrand={n0 => pickBrand(n0)} onModel={pickModel} onOther={pickOther} />
              </div>
              <div className="mt-5"><Cost100 /></div>
            </div>
            <div className="mx-auto w-full max-w-[420px] md:max-w-none">
              <img src={IMG.hero} alt={L.t("hero.imgAlt")} width="727" height="473" fetchPriority="high" decoding="async" className="mx-auto block aspect-[727/473] w-full object-contain" />
              <div className="mt-4 hidden justify-center md:flex">
                <a href={utm(OFFER.pagina, "hero")} target="_blank" rel="noopener noreferrer" onClick={() => track("hero_tarifario")} className="ge-btn ge-btn--outline-ink">{L.t("cta.seeTariff")}<Icon n="arrow" /><Ext /></a>
              </div>
            </div>
          </div>
        </section>

        <main id="guia" tabIndex={-1} className={cx("focus:outline-none", showBar && "pb-24")}>
          <section ref={guideRef} aria-label={L.t("guide.region")} className="mx-auto max-w-[1240px] scroll-mt-[var(--hdr)] px-4 py-10 sm:px-8 md:py-16 lg:px-10">
            {G ? (
              <Guide key={(b.other ? "o" : b.name) + famIdx} {...{ G, b, f, v, setVer: setVerIdx, p, cyc, setCyc, cur, n, screen, photo, finished, go, finish, desk }}
                share={{ linkUrl, carTitle, copyLink, copied }} />
            ) : (
              <div className="ge-card flex flex-col items-center gap-3 p-8 text-center sm:p-12">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--ge-mint)] text-[color:var(--ge-success)]"><Icon n="car" className="h-7 w-7" /></span>
                <h2 className="text-[length:var(--fs-h3)] font-black">{L.t("empty.title")}</h2>
                <p className="max-w-md text-[color:var(--ge-muted)]">{L.t("empty.text")}</p>
                <button type="button" onClick={changeCar} className="ge-btn ge-btn--green mt-2"><Icon n="search" />{L.t("empty.cta")}</button>
              </div>
            )}
          </section>
          <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 pb-14 sm:px-8 lg:px-10">
            <Promo />
            <Sources />
          </div>
        </main>

        <footer className="border-t border-[color:var(--ge-line-soft)] bg-white">
          <div className="mx-auto max-w-[1240px] space-y-2 px-4 py-8 text-sm leading-relaxed text-[color:var(--ge-muted)] sm:px-8 lg:px-10">
            <p className="font-bold text-[color:var(--ge-ink)]">{L.t("offer.name")}</p>
            <p><Tx k="foot.conditions" vars={{ site: <A href={OFFER.pagina}>goldenergy.pt</A>, pdf: <A href={OFFER.precosPdf}>{L.t("offer.prices")}</A> }} /></p>
            <p>*{L.t("offer.notePrice")}</p>
            <p>**{L.t("offer.noteDiscount")}</p>
            <p>{L.t("foot.disclaimer")}</p>
            {lang !== "pt" && <p>{L.t("foot.translation")}</p>}
          </div>
        </footer>

        {G && <StepBar show={showBar} cur={cur} n={n} go={go} finish={finish} />}
        <div role="status" aria-live="polite" className="sr-only">{msg}</div>
      </div>
    </I18n.Provider>
  );
}
