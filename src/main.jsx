import React from "react";
import { hydrateRoot } from "react-dom/client";
import Guia from "./Guia.jsx";
import { detectLang } from "./i18n/index.js";
import pt from "./i18n/pt.json";
import "./index.css";

/* Os idiomas (exceto PT) são carregados à parte: cada um só é descarregado quando é preciso. */
const loadDict = (code) =>
  code === "pt" ? Promise.resolve(pt) : import(`./i18n/${code}.json`).then((m) => m.default || m);

const lang = detectLang();

function start(code, dict) {
  hydrateRoot(document.getElementById("root"),
    <React.StrictMode>
      <Guia initialLang={code} initialDict={dict} ptDict={pt} loadDict={loadDict} />
    </React.StrictMode>
  );
}

loadDict(lang).then((d) => start(lang, d), (error) => {
  // Preserva a página estática localizada se o módulo JS não carregar.
  console.error("O guia interativo não foi iniciado; mantém-se o conteúdo informativo.", error);
});
