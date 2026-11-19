# Como publicar esta versão (GitHub + Vercel)

Repositório: github.com/Joao14Silva14/Guia-Carregamento (ramo `main`)
Site: https://guia-carregamento.vercel.app/

## O que mudou nesta versão — «Ecrãs distintos por passo e alinhamento mobile»

Inclui também os últimos ajustes:
- Cada passo do guia mostra agora um ecrã diferente. Quando dois passos usavam o mesmo ecrã, o segundo passa a mostrar o estado seguinte: seletor de hora aberto, botão Guardar em destaque com «Horário guardado», «Cabo ligado · início às …», «A carregar desde as …» ou a app da wallbox quando o passo o indica. Verificado em todas as marcas, modelos e nos 5 idiomas, sem nenhum par de ecrãs igual.
- No telemóvel, os botões das marcas, dos modelos e das lojas de apps ficam numa grelha de 2 colunas, com a mesma largura e alinhados. «Ver todas as marcas» ocupa a linha inteira.
- Corrigidos os ecrãs Volvo e BMW: a imagem do Volvo fica centrada numa zona reservada; a imagem do BMW deixa de se sobrepor ao texto.
- Atualizados os botões de marca para cartões compactos modernos com logótipos mantidos; nomes dos modelos alinhados ao centro.
- Saiu o bloco «Não tem agendamento na app ou prefere automatizar pela wallbox?». O contacto de apoio (800 501 070) continua no cartão do tarifário.
- Saíram as marcas NIO, TOGG e VinFast, e o firefly (que usa a app da NIO), porque não são vendidas em Portugal. O guia passa a ter 86 marcas e 333 modelos. Os links antigos destas marcas abrem a página inicial.

| Ficheiro | Ação |
|---|---|
| `src/Guia.jsx` | **Substituir.** Nova interface: cabeçalho fixo com seletor de idioma, pesquisa com sugestões, guia em 2 colunas (computador) e barra de passos fixa (telemóvel). |
| `src/main.jsx` | **Substituir.** Deteta o idioma e carrega só o dicionário necessário. |
| `src/engine.js` | **Novo.** Dados das marcas, guias e ecrãs ilustrados das apps (saíram de `Guia.jsx`). |
| `src/i18n/index.js` | **Novo.** Idiomas, deteção (?lang → escolha guardada → navegador → EN) e tradução. |
| `src/i18n/pt.json`, `es.json`, `en.json`, `fr.json`, `de.json` | **Novos.** Textos da página, dos guias e dos ecrãs das apps em cada idioma. |
| `tailwind.config.js` | **Substituir.** Cores, raios e curvas de animação Goldenergy. |
| `index.html` | **Substituir.** Novo título e ligações `hreflang` para os 5 idiomas. |
| `tr/` | **Novo (opcional).** Fontes das traduções. Para regenerar os JSON: `python3 tr/build.py` na raiz do projeto. |

Em `public/img/` ficam apenas `electric-love-casa.webp` e `logo-goldenergy.webp`. No passo 5, removam do GitHub estes ficheiros antigos, se existirem: `casinha-solar.webp`, `casinhas-tarifario.webp`, `casinha-carregar-noite.webp` e `logo-goldenergy-branco.webp`. Já não são usados nesta versão.

## 1. GitHub (no navegador)

1. Descompactem o zip no computador.
2. Abram o repositório no GitHub e carreguem em **Add file › Upload files**.
3. Arrastem, **a partir de dentro** da pasta `guia-carregamento-programado`, os itens:
   - as pastas `src`, `public` e `tr`
   - os ficheiros `index.html`, `tailwind.config.js`, `vite.config.js` e `package.json` (podem ir sempre, mesmo sem alterações)
   - o ficheiro `INSTRUCOES.md` (opcional)
   Arrastem as pastas inteiras, não o conteúdo solto, para manter os caminhos `src/…` e `public/…`.
4. Em baixo, escrevam a mensagem, por exemplo «Ecrãs distintos por passo e alinhamento mobile», escolham **Commit directly to the main branch** e carreguem em **Commit changes**.
5. Se existirem no repositório, apaguem em `public/img/` os ficheiros antigos `casinha-solar.webp`, `casinhas-tarifario.webp`, `casinha-carregar-noite.webp` e `logo-goldenergy-branco.webp`: abram cada ficheiro, depois **…** › **Delete file** › **Commit changes**. Não apaguem `electric-love-casa.webp` nem `logo-goldenergy.webp`.
6. Confirmem que na raiz do repositório estão `package.json`, `index.html`, `src/` e `public/` (e não uma pasta `guia-carregamento-programado/` lá dentro).

## 2. Vercel

1. Cada commit no `main` lança um deploy automático. Não é preciso fazer **Redeploy**.
2. Em **Deployments**, abram o deploy mais recente e confirmem que o **commit** é o que acabaram de fazer (o hash não pode ser o antigo).
3. No **Build Log** devem ver `vite build` e, no fim, `✓ built in …`. Se aparecer `Rollup failed to resolve import "/src/main.jsx"`, a pasta `src` não foi enviada para a raiz do repositório (voltem ao passo 1.3).
4. Abram o site e forcem a atualização (Ctrl+F5 no computador; no telemóvel, fechem e voltem a abrir o separador).

## 3. Teste depois de publicar (10 minutos)

Façam o teste em **2 aparelhos reais**: um computador (janela larga, ~1440 px) e um telemóvel (de preferência um iPhone e um Android). Marquem ✅ ou ❌ e enviem uma captura de cada ❌.

| # | O que fazer | Resultado esperado | Computador | Telemóvel |
|---|---|---|---|---|
| 1 | Abrir `https://guia-carregamento.vercel.app/?lang=en` | Página em inglês; o seletor mostra **EN** | | |
| 2 | No seletor, escolher **DE** | Texto muda sem recarregar; o endereço passa a `?lang=de` | | |
| 3 | Abrir o site sem `?lang=` numa janela anónima | Abre no idioma do navegador (PT em Portugal) | | |
| 4 | Pesquisar «atto 3» e depois «model3» | Aparece BYD Atto 3 e Tesla Model 3, com logótipo | | |
| 5 | Pesquisar «NIO» | Sem resultados e com a opção de outra marca | | |
| 6 | Escolher Tesla Model 3 | Abre o guia; o ecrã da app aparece | | |
| 7 | Carregar nas teclas → e ← | Muda de passo e o ecrã da app acompanha | | — |
| 8 | Descer até ao guia no telemóvel | Barra fixa em baixo com **Anterior / Seguinte** e n.º do passo | — | |
| 9 | Mudar o ciclo para semanal | As horas mudam nos passos e no ecrã da app | | |
| 10 | Rodar o telemóvel e voltar | Nada fica sobreposto nem sai do ecrã; sem deslizar para o lado | — | |
| 11 | Descer até ao fim | Já não existe o bloco da wallbox; aparecem os cartões do tarifário e dos painéis solares | | |
| 12 | Tocar em **Aderir ao tarifário** | Abre goldenergy.pt/mobilidade-eletrica/carregar-em-casa/ | | |
| 13 | Selecionar Volvo e avançar pelos ecrãs | Carro centrado; não tapa os indicadores nem o estado de carregamento | | |
| 14 | Selecionar BMW iX2 e avançar pelos ecrãs | «TUDO OK» e restante texto continuam legíveis, sem sobreposição da imagem | | |
| 15 | Escolher uma marca e vários modelos | Logótipos mantidos; rótulos dos modelos visualmente centrados | | |
| 16 | Avançar por todos os passos de Peugeot, Tesla e Volkswagen | Nenhum passo repete o ecrã anterior (seletor de hora, «Horário guardado» ou «Cabo ligado») | | |
| 17 | Abrir no telemóvel (375 px) a escolha da marca | Marcas em 2 colunas iguais, alinhadas; nomes longos (Mercedes-Benz) partem em 2 linhas sem cortar | — | |
| 18 | No telemóvel, ver os botões Google Play / App Store e os modelos | Botões com a mesma largura, lado a lado, sem desalinhamento | — | |
