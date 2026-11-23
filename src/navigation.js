import { BRANDS, GUIDES } from "./engine.js";

export const INITIAL = Object.freeze({ view: "vehicle", brand: "", family: -1, cycle: "diario", step: 0 });
export const SECTIONS = ["vehicle", "schedule", "guide", "done"];
const brandsByName = new Map(BRANDS.map(b => [b.name, b]));

export function guideKey(brand, family) {
  const b = brandsByName.get(brand);
  return b?.families[family]?.guide || b?.guide || "generic";
}

export function fromHash(hash) {
  const u = new URLSearchParams((hash || "").replace(/^#/, ""));
  const cycle = u.get("ciclo") === "semanal" ? "semanal" : "diario";
  const brand = u.get("marca");
  if (brand === "outra") return { ...INITIAL, brand: "__other", cycle, view: "guide" };
  const b = brandsByName.get(brand);
  if (!b) return INITIAL;
  const fi = b.families.findIndex(f => f.name === u.get("modelo"));
  const family = fi < 0 && b.families.length === 1 ? 0 : fi;
  return { ...INITIAL, brand, family, cycle, view: family >= 0 ? "guide" : "models" };
}

export function toHash(nav) {
  if (!nav.brand) return "";
  const u = new URLSearchParams({ marca: nav.brand === "__other" ? "outra" : nav.brand });
  const family = brandsByName.get(nav.brand)?.families[nav.family];
  if (family) u.set("modelo", family.name);
  u.set("ciclo", nav.cycle);
  return "#" + u.toString();
}

export function transition(nav, action) {
  switch (action.type) {
    case "clear": return { ...INITIAL, cycle: nav.cycle };
    case "brand": {
      const b = brandsByName.get(action.brand);
      if (!b) return nav;
      if (nav.brand === b.name && (action.family == null || action.family === nav.family)) {
        return transition(nav, { type: "clear" });
      }
      const family = action.family ?? (b.families.length === 1 ? 0 : -1);
      return { ...nav, view: b.families[family] ? "schedule" : "models", brand: b.name, family, step: 0 };
    }
    case "model": {
      const b = brandsByName.get(nav.brand);
      if (!b?.families[action.family]) return nav;
      if (nav.family === action.family) return { ...nav, view: "models", family: -1, step: 0 };
      return { ...nav, view: "schedule", family: action.family, step: 0 };
    }
    case "other":
      return nav.brand === "__other" && action.toggle
        ? transition(nav, { type: "clear" })
        : { ...nav, view: "schedule", brand: "__other", family: -1, step: 0 };
    case "vehicle": return { ...nav, view: nav.brand && nav.brand !== "__other" ? "models" : "vehicle" };
    case "cycle": return nav.cycle === action.cycle ? nav : { ...nav, cycle: action.cycle };
    case "schedule": return { ...nav, view: "schedule" };
    case "guide": return { ...nav, view: "guide", step: action.restart ? 0 : nav.step };
    case "step": {
      const n = (GUIDES[guideKey(nav.brand, nav.family)] || GUIDES.generic).steps.length;
      const step = Math.min(n - 1, Math.max(0, action.step));
      return nav.view === "guide" && nav.step === step ? nav : { ...nav, view: "guide", step };
    }
    case "done": return { ...nav, view: "done" };
    default: return nav;
  }
}
