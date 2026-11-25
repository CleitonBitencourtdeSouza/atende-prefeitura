# Preparação para a entrevista — Atende Prefeitura

> **Regra de ouro:** só fale do que é verdade e do que você consegue explicar. As Fases 1 e 2 foram feitas **comigo no controle, passo a passo**. As Fases 3 a 7 foram feitas **pelo Claude no automático**, com testes e prova em cada PR. Antes da entrevista, **revise cada PR das Fases 3 a 7** (aba *Files changed*) e rode o projeto você mesmo. Se perguntarem, diga a verdade: "nessa parte pedi para a IA acelerar e eu revisei depois".

---

## 1. Requisitos da vaga e como o projeto prova cada um

| Requisito | Onde está a prova |
|---|---|
| **JavaScript / TypeScript** | Todo o projeto é em TypeScript: API (`backend/src`), site (`frontend/src`) e app (`mobile/`). Na Fase 2, **eu escrevi** o tratador de erros (`tratarErros`) no `app.ts`. |
| **React e Node.js** | Node + Express na API. React nas telas do cidadão e do atendente (`frontend/src/pages`). |
| **Banco de dados e SQL** | PostgreSQL com Prisma. A tabela `chamados` foi criada por **migração** (arquivo SQL em `backend/prisma/migrations`). A prova da Fase 3 foi um `SELECT` direto no banco pelo `psql`. |
| **Git** | Uma branch por tarefa, commits pequenos com padrão (`feat:`, `fix:`, `test:`, `docs:`, `chore:`), PRs #9 a #15 com `Closes #N`. |
| **Usar a Claude para programar e conferir o resultado** | O **DIARIO.md** registra o que pedi, o que a IA entregou, como conferi e **o que estava errado**. |
| **Explicar um problema por escrito** | As **Issues** #1 a #7: cada uma tem o pedido, o critério de "pronto" e como provar. |
| **Ler código de outra pessoa e dizer se está certo** | Revisão do `app.ts` na Fase 2 (expliquei cada parte com minhas palavras) e a revisão dos PRs das Fases 3 a 7. |
| **Terminal** | `npm`, `git`, `gh`, `psql`, `Invoke-RestMethod`, `curl`. Li mensagens de erro como o `enoent`. |
| **Investigar um problema até a causa** | O `enoent` (pasta errada), a API que "dizia estar rodando" mas não respondia e o comando `curl` que quebrava no PowerShell. Histórias completas na seção 5. |
| **Diferenciais** | Claude Code ✅ · React Native/Expo ✅ · Prisma ✅ · PostgreSQL ✅ · Testes (14 com Vitest + Supertest) ✅ · GitHub (Issues, Projects, PRs) ✅ · **Linux: não usei neste projeto** (usei Windows/PowerShell; se perguntarem, seja honesto). |

---

## 2. Cada tecnologia em 2 ou 3 frases (como eu falaria)

- **TypeScript:** é o JavaScript com "etiquetas de tipo". Ele avisa o erro **antes** de rodar. Por exemplo, quando esqueci de fechar a função com `};`, ele me mostrou a linha exata.
- **Node.js:** permite rodar JavaScript fora do navegador. É o que liga a minha API, a "cozinha" do sistema.
- **Express:** biblioteca que facilita criar as rotas da API. Em Python, seria parecido com o Flask.
- **PostgreSQL:** o banco de dados, a "despensa". Os chamados ficam guardados mesmo se a API desligar. Provei isso reiniciando a API e vendo o chamado continuar na lista.
- **Prisma:** traduz código TypeScript em SQL. O `prisma.chamado.findMany()` vira um `SELECT`. Também cuida das **migrações**, o histórico de mudanças nas tabelas.
- **Vitest + Supertest:** o Vitest roda os testes e o Supertest faz pedidos à API sem precisar ligar o servidor. São 14 testes, com sucesso e erros.
- **React:** monta a tela com **componentes** (peças reutilizáveis) e **estado** (a memória da tela). Quando o estado muda, o React atualiza só o que precisa.
- **Vite:** a ferramenta que roda e empacota o React. Também repassa os pedidos de `/chamados` para a API durante o desenvolvimento.
- **React Native + Expo:** o React para celular. Usa `View` e `Text` no lugar de `div` e `p`. O Expo facilita testar no celular com o app Expo Go.
- **Git e GitHub:** o Git guarda o histórico do código. No GitHub, organizei o trabalho como uma equipe: Issue → branch → Pull Request → merge.

---

## 3. 10 perguntas prováveis (com modelo de resposta)

> Use os modelos como **ingredientes**, não para decorar. Fale com as suas palavras.

**1. Me conta sobre esse projeto.**
É um sistema de chamados para prefeituras. O cidadão abre um chamado, como "buraco na rua", e o atendente responde e muda o status até "Resolvido". Fiz a API em Node com TypeScript, o banco em PostgreSQL com Prisma, testes automatizados, o site em React e um app em Expo. Organizei tudo com Issues, branches e Pull Requests.

**2. Por que você organizou cada tarefa como uma Issue?**
Antes de programar, eu escrevo três coisas: o pedido, o que é "pronto" e como vou provar. Por exemplo, a Issue #1 já dizia que um chamado sem título tem que dar erro 400. Assim qualquer pessoa olha o quadro e sabe como está o projeto, e a Issue fica ligada ao PR com o código e a prova.

**3. Como você sabe que o que a IA entregou está certo?**
Eu não aceito sem conferir. Uso o Claude no modo em que ele pede aprovação, rodo os testes e confiro com os meus olhos. Por exemplo, um comando que a IA me passou não funcionou no meu PowerShell. Investiguei o erro e troquei por outro. Tudo fica registrado no DIARIO.md, inclusive os erros da IA.

**4. Qual a diferença entre GET, POST e PATCH?**
GET busca, como "me traz a lista". POST cria um chamado novo. PATCH muda só um pedaço de um chamado que já existe, como o status e a resposta.

**5. O que significam os códigos 201, 400, 404 e 500?**
201: criado com sucesso. 400: o pedido veio errado (culpa de quem pediu), como um chamado sem título. 404: não encontrei o chamado. 500: erro do servidor. No meu tratador de erros, o 500 não mostra os detalhes internos, por segurança.

**6. Por que guardar no banco e não na memória?**
Eu fiz o experimento: com os dados na memória, criei um chamado, reiniciei a API e ele **sumiu**. Com o PostgreSQL, repeti o mesmo experimento e ele **continuou lá**. Também conferi com um `SELECT` no banco.

**7. Como você testou a API?**
São 14 testes com Vitest e Supertest, cobrindo sucesso e erros (sem título, status inválido, chamado inexistente). Os testes usam um **banco separado**, que é esvaziado antes de cada teste. E aprendi a testar o teste: quebrando o código de propósito para ver se ele percebe.

**8. O que é uma migração?**
É o "histórico de obras" do banco. Cada mudança na tabela vira um arquivo SQL. No projeto há duas: uma criou a tabela `chamados` e a outra acrescentou o campo `resposta`.

**9. Me conta um problema que você investigou.**
Rodei `npm run dev` e deu `enoent`. Em vez de pedir ajuda direto, li a linha `path` do erro e vi que o npm procurou o `package.json` na pasta errada: ele fica dentro de `backend/`. Corrigi com `cd backend`. Aprendi a ler a mensagem de erro procurando o **quê** e o **onde**.

**10. O que você melhoraria se tivesse mais tempo?**
Login para o atendente (hoje qualquer pessoa acessa o painel), paginação da lista, testes das telas React, publicar o sistema na internet e atualizar o Prisma quando sair a correção de uma vulnerabilidade de uma biblioteca interna dele.

---

## 4. Pitch de 1 minuto

> "Para me preparar para esta vaga, construí o **Atende Prefeitura**, um sistema de chamados com as mesmas tecnologias que vocês usam. O cidadão abre um chamado pelo site ou pelo celular, e o atendente filtra, responde e muda o status até resolver.
>
> Fiz a API em **Node com TypeScript e Express**, o banco em **PostgreSQL com Prisma**, **14 testes automatizados** com Vitest, o site em **React** e um app em **Expo**.
>
> Trabalhei como numa equipe: cada funcionalidade virou uma **Issue** com critério de pronto, foi feita numa **branch** e entrou por **Pull Request** com a prova anexada. Usei o **Claude Code** como par de programação, e registrei num diário **como conferi** o que a IA entregou, inclusive os erros dela que peguei. Está tudo público no meu GitHub."

---

## 5. Três histórias reais do diário (situação → o que fiz → resultado)

**História 1: A IA disse que a API estava desligada, mas eu vi ela rodando**
- **Situação:** meu teste deu "Impossível conectar-se". O Claude verificou e afirmou que a API estava desligada. Mas o meu terminal mostrava "API rodando em http://localhost:3333".
- **O que fiz:** não aceitei a resposta. Mandei o print e disse "mas a API está rodando, olha". Depois testei pelo navegador, que também recusou a conexão.
- **Resultado:** investigando juntos, descobrimos que o "vigia" (`tsx watch`) estava ativo, mas o processo da API tinha morrido, e a mensagem antiga continuava na tela. Reiniciei e funcionou. **Lição:** a prova real é fazer um pedido, não confiar no texto da tela, e nem na IA sem evidência.

**História 2: Um comando errado da IA revelou um problema de segurança**
- **Situação:** o comando `curl` que a IA me passou não funcionava no PowerShell do Windows e mandava um JSON "rasgado" para a API.
- **O que fiz:** trouxe o print e investigamos. A linha `Could not resolve host: primeiro` mostrava que o PowerShell cortou o texto nos espaços. Trocamos por `Invoke-RestMethod`. Mas o print também mostrava que a API respondeu com uma **página HTML cheia de detalhes internos do servidor**.
- **Resultado:** **eu mesmo escrevi** um tratador de erros que responde `400 {"erro": "JSON inválido."}`, sem expor nada. Testei e fiz um teste de regressão para garantir que o resto continuava funcionando.

**História 3: Os testes passavam mesmo com o código quebrado** *(Fase 4, feita no automático; confira você mesmo antes de contar)*
- **Situação:** os 14 testes estavam verdes. Para confiar neles, o código foi quebrado de propósito: tiramos o `return` da validação do título.
- **O que aconteceu:** **os testes continuaram passando.** O teste do "título só com espaços" conferia só o código 400, não se algo tinha sido gravado. E a API gravava um chamado com título vazio!
- **Resultado:** o teste foi reforçado para conferir também que nada foi gravado. Agora ele pega o defeito. **Lição:** teste que nunca falha não prova nada. **Para contar como sua:** repita você mesmo (apague o `return` da linha da validação do título no `app.ts`, rode `npm test`, veja falhar e desfaça).

---

## 6. Antes da entrevista (checklist)

- [ ] Fazer o merge dos PRs **#9 a #15, nesta ordem**.
- [ ] Revisar cada PR das Fases 3 a 7 (aba *Files changed*) e anotar dúvidas.
- [ ] Rodar o projeto seguindo o README (API, site e testes).
- [ ] Repetir a "História 3" com as próprias mãos.
- [ ] Testar o app no celular com o Expo Go e anexar o print na Issue #7.
- [ ] Fazer o **simulado de entrevista** com o Claude (uma pergunta por vez).
