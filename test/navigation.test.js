import test from "node:test";
import assert from "node:assert/strict";
import { BRANDS, GUIDES } from "../src/engine.js";
import { INITIAL, fromHash, toHash, transition, guideKey } from "../src/navigation.js";

const move = (nav, type, options) => transition(nav, { ...options, type });
const bmw = BRANDS.find(b => b.name === "BMW");
const ix1 = bmw.families.findIndex(f => f.name === "iX1");
const bmwModels = move(INITIAL, "brand", { brand: "BMW" });
const bmwSchedule = move(bmwModels, "model", { family: ix1 });
const bmwWeekly = move(bmwSchedule, "cycle", { cycle: "semanal" });

test("veiculo, horario, passo e conclusao sao ecras distintos", () => {
  assert.equal(INITIAL.view, "vehicle");
  assert.equal(bmwModels.view, "models");
  assert.equal(bmwSchedule.view, "schedule");
  const first = move(bmwWeekly, "guide");
  assert.equal(first.view, "guide");
  assert.equal(first.step, 0);
  const second = move(first, "step", { step: 1 });
  const done = move(second, "done");
  assert.equal(done.view, "done");
  assert.equal(move(done, "guide", { restart: true }).step, 0);
  assert.equal(move(done, "vehicle").family, ix1);
});

test("alterar ciclo no meio do guia preserva modelo e passo", () => {
  const step = move(bmwWeekly, "step", { step: 2 });
  const edit = move(step, "schedule");
  assert.equal(edit.view, "schedule");
  const next = move(move(edit, "cycle", { cycle: "diario" }), "guide");
  assert.equal(next.step, 2);
  assert.equal(next.family, ix1);
  assert.equal(next.cycle, "diario");
});

test("selecionar a mesma marca, modelo ou pesquisa limpa a selecao", () => {
  assert.deepEqual(move(bmwModels, "brand", { brand: "BMW" }), INITIAL);
  assert.deepEqual(move(bmwSchedule, "brand", { brand: "BMW", family: ix1 }), INITIAL);
  const changed = move(move(bmwWeekly, "vehicle"), "model", { family: ix1 });
  assert.equal(changed.family, -1);
  assert.equal(changed.cycle, "semanal");
});

test("ligacoes antigas e novas abrem o guia sem depender da versao", () => {
  const hash = toHash(bmwWeekly);
  assert.ok(hash.includes("marca=BMW&modelo=iX1&ciclo=semanal"));
  const linked = fromHash(hash + "&versao=eDrive20");
  assert.deepEqual(linked, { ...bmwWeekly, view: "guide", step: 0 });
  assert.equal(fromHash("#marca=BMW").view, "models");
  assert.equal(fromHash("#marca=inexistente").view, "vehicle");
});

test("outra marca segue o mesmo fluxo, sem exigir modelo", () => {
  const other = move(INITIAL, "other");
  assert.equal(other.view, "schedule");
  assert.equal(fromHash(toHash(other)).view, "guide");
  assert.equal(guideKey(other.brand, other.family), "generic");
  assert.deepEqual(move(other, "other", { toggle: true }), INITIAL);
});

test("todos os modelos do catalogo reabrem com o guia e passos validos", () => {
  for (const b of BRANDS) b.families.forEach((_, family) => {
    const nav = move(INITIAL, "brand", { brand: b.name, family });
    assert.equal(nav.view, "schedule");
    const linked = fromHash(toHash(nav));
    assert.deepEqual(linked, { ...nav, view: "guide" });
    const g = GUIDES[guideKey(b.name, family)];
    assert.ok(g);
    const last = move(nav, "step", { step: 100 });
    assert.equal(last.step, g.steps.length - 1);
    for (const k of g.map) assert.ok(g.screens[k]);
  });
});
