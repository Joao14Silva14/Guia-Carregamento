# Guia Goldenergy — percurso por ecrãs

O fundo usa o verde Goldenergy `#40DDA6`, o mesmo tom predominante no fundo da ilustração da casinha. O cabeçalho, a navegação e os cartões mantêm superfícies claras.

O guia tem quatro etapas: **Veículo → Horário → Passos na app → Conclusão**. Na primeira, os modelos aparecem depois da marca, no mesmo local da página. Cada passo mostra uma única instrução e o ecrã correspondente. As indicações adicionais e as lojas da app ficam em «Antes de começar, app e dicas». Alterar o horário conserva o modelo e o passo. As ilustrações são orientativas, não capturas integrais confirmadas para todos os veículos.

O scroll serve para ler a etapa ativa quando o conteúdo não cabe. A navegação fica visível no horário e nos passos, exceto em ecrãs baixos na horizontal, onde os controlos ficam no fluxo para não taparem a leitura. A conclusão tem as opções de partilhar e repetir o guia, bem como os cartões do tarifário e dos painéis solares.

## GitHub e Vercel

1. Descompacte o ZIP. No [GitHub](https://github.com/Joao14Silva14/Guia-Carregamento), abra uma branch para revisão, por exemplo `ux/percurso-guiado`.
2. Carregue o **conteúdo** da pasta extraída para a raiz do repositório, não a pasta exterior. Confirme que `package.json`, `index.html` e `vercel.json` ficam na raiz, e que `src/main.jsx` e o novo `src/navigation.js` ficam dentro de `src/`. Inclua os cinco dicionários em `src/i18n/` e os respetivos ficheiros de origem em `tr/`. No GitHub, use **Add file → Upload files**.
3. Faça o commit. No Vercel, abra **Deployments**, confirme o hash do novo commit e teste a pré-visualização da branch antes de integrar em `main`. Não faça *Redeploy* de um commit anterior para atualizar os ficheiros.
4. As definições esperadas são **Vite**, **Root Directory** na raiz, comando `npm run build` e saída `dist`. Se voltar a surgir `failed to resolve import "/src/main.jsx"`, verifique os caminhos e as maiúsculas/minúsculas no commit em causa.
5. Depois de validar, integre a branch de revisão no ramo de produção e confirme o novo deploy. Esta entrega não publica alterações no GitHub nem no Vercel.

## Teste local

Com Node.js 22 e as dependências do projeto instaladas na raiz, use `npm test` para testar a navegação, `npm run build` para gerar a pasta `dist` e `npm run dev` para abrir o projeto localmente.

## Checklist no navegador

| Teste | Desktop — 1440 px | Mobile — 375 px |
|---|---|---|
| Marca, modelo e ciclo | Clique em BMW → iX1. A escolha muda para o horário. Na lista de modelos, clicar novamente na marca limpa a seleção, sem ícone «×». | Repita por toque. Confirme que não há sobreposição nem deslize horizontal. Ao pesquisar, verifique que o teclado não tapa os resultados. |
| Ciclo semanal | O exemplo diário fica separado do horário completo, que distingue dias úteis, sábado e domingo. | Abra a tabela completa e faça scroll. Confirme que consegue avançar sem procurar o botão. |
| Passos | Leia a instrução à esquerda e confirme que a imagem à direita é do mesmo passo. Use **Seguinte**, os números e as setas ← / →. | Avance e volte. O passo abre no início, com o ecrã correspondente abaixo e a navegação visível. Feche e abra o ecrã da app. |
| Voltar e alterar | No passo 3, altere o horário e escolha **Retomar guia**. Mantém o passo e usa as novas horas. Teste também Anterior e Seguinte no navegador. | Repita por toque. Rode o telemóvel e volte à vertical. Verifique se os controlos continuam acessíveis. |
| Foco e ampliação | Use apenas Tab e Enter. O indicador de foco não fica atrás das barras; após mudar de etapa, o foco vai para o título. Repita a 200% de zoom e com movimento reduzido. | Confirme que os botões são fáceis de tocar e o texto continua legível com o tamanho de letra aumentado. |
| Conclusão e partilha | Após concluir, abra uma ligação partilhada num separador novo: deve abrir o primeiro passo do modelo e ciclo partilhados. | Confirme que a ligação abre o guia correto e que o cartão de adesão leva à página do tarifário «Carregar em Casa». |
| Idiomas | Mude de idioma sem perder a etapa, o modelo ou o passo. | Experimente DE e FR com texto longo nas ações e na escolha do ciclo. |

Verificação desta entrega: testes de navegação e ligações de todos os modelos, simulação das interações em React e compilação dos módulos. A validação visual e do posicionamento das barras em navegadores reais deve ser feita na pré-visualização do Vercel.
