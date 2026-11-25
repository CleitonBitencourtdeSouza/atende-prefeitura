# Diário de Bordo — Atende Prefeitura

Aqui eu registro cada tarefa: o que pedi ao Claude, o que ele entregou, como eu conferi e o que aprendi.

---

## 23/11/2026 — Fase 1: Preparar o terreno

**O que pedi ao Claude:** conferir as ferramentas do meu computador, organizar a pasta do projeto, criar o repositório no GitHub e montar o quadro de tarefas.

**O que o Claude entregou:**
- Conferiu as versões: Node.js 22, npm 10, Git 2.49, GitHub CLI e VS Code já estavam instalados.
- Procurou bancos de dados na máquina e achou o PostgreSQL 18 já instalado e rodando (e também SQL Server e Oracle). Não precisei instalar nada.
- Sugeriu tirar o projeto do OneDrive (a sincronização trava com a pasta `node_modules`) e copiou para `C:\Users\cleit\projetos\atende-prefeitura`.
- Criou o `.gitignore`, o `README.md` e este diário.
- Fez o primeiro commit e criou o repositório público no GitHub.
- Rascunhou as 7 Issues (Fases 2 a 7). Eu li, pedi explicação de cada uma e aprovei. Depois ele criou as Issues e o quadro "Atende Prefeitura" no GitHub Projects, com todas em "Todo".

**Como eu conferi:**
- Vi a saída dos comandos de versão no terminal.
- O `pg_isready` respondeu "aceitando conexões" na porta 5432.
- O Claude comparou o `CLAUDE.md` copiado com o original (`cmp`) e eram idênticos.

**O que estava errado ou eu mudei:**
- Eu não lembrava a senha do usuário `postgres`. O Claude achou um arquivo de senhas salvas, mas era do OnlyOffice, não do meu usuário. Vamos redefinir a senha antes da Fase 3.
- O sistema de segurança do Claude Code bloqueou dois comandos: apagar a pasta antiga e mudar o PATH do Windows. Essas partes ficaram para eu fazer manualmente.
- Para criar o quadro, meu login do GitHub não tinha a permissão `project`. Rodei `gh auth refresh -s project` e confirmei no navegador com um código de uso único.

**O que aprendi:**
- Banco de dados roda como **serviço** no Windows: fica ligado o tempo todo esperando conexões, numa porta (o PostgreSQL usa a 5432).
- O **PATH** é a "agenda" onde o terminal procura os programas.
- O `.gitignore` impede que senhas e a pasta `node_modules` vão para o GitHub.
- **Issue** é a "comanda" de uma tarefa: o pedido, o que é "pronto" e como provar. O **quadro** é o mural de comandas (A fazer → Fazendo → Feito).
- Tarefa grande deve ser dividida em menores para ficar mais fácil de revisar.

---

## 24/11/2026 — Fase 2: A cozinha (API de chamados em memória)

**O que pedi ao Claude:** criar a API em Node.js + TypeScript + Express com duas rotas: `POST /chamados` (abrir chamado) e `GET /chamados` (listar), guardando os dados na memória. Pedi também para me ensinar a revisar o código e para eu mesmo pôr a mão na massa.

**O que o Claude entregou:**
- A branch `feat/api-chamados` e a pasta `backend/` com o projeto configurado.
- O `app.ts` (as rotas) e o `server.ts` (liga a API na porta 3333). Ficaram separados para os testes da Fase 4 usarem o `app.ts` sem ligar o servidor.
- Validação: sem título ou sem descrição, a API responde **400** com uma mensagem. Título só com espaços também é barrado.
- Categoria e bairro vazios viram "Outros" e "Não informado". A Issue não dizia o que fazer; eu escolhi deixar assim por agora (opção "a").

**Como eu conferi:**
- Li o `app.ts` e expliquei cada parte com as minhas palavras. Onde eu não sabia (o Express, o `typeof ... &&`, o `push`), pedi explicação comparando com Python.
- Fiz um experimento: criei um chamado, desliguei e liguei a API, e o chamado **sumiu**. Isso provou por que precisamos do banco na Fase 3.
- Testei pelo terminal: chamado completo (201), sem título (400), sem descrição (400) e lista (GET).
- Depois da minha correção, fiz um **teste de regressão**: criar um chamado normal continuou funcionando.

**O que estava errado ou eu mudei:**
- Rodei `npm run d` na pasta errada e deu `enoent`. Li a linha `path` do erro, vi que o `package.json` fica dentro de `backend/` e corrigi com `cd backend` e `npm run dev`.
- O comando `curl` que o Claude me passou **não funciona no PowerShell 5.1**: ele cortou o texto nos espaços. Trocamos por `Invoke-RestMethod`.
- Com o JSON quebrado, a API devolvia uma **página HTML com detalhes internos** do servidor. **Eu mesmo escrevi** um tratador de erros que responde `400 {"erro": "JSON inválido."}`. Na primeira tentativa esqueci de fechar a função com `};` e o TypeScript me avisou.
- O Claude me passou os **números das linhas errados** na revisão. Também disse que a API estava desligada quando o terminal mostrava "API rodando". No fim, a API tinha mesmo morrido por trás, mas a mensagem antiga continuava na tela. A prova real é fazer um pedido, não confiar no texto do terminal.

**O que aprendi:**
- **Rota** é o balcão da cozinha: **GET** = "me traz", **POST** = "guarda isso".
- **201** = criado, **400** = o erro foi de quem pediu, **500** = o erro foi do servidor.
- **JSON** é o "idioma da comanda": parece uma lista de dicionários do Python.
- O **`return`** depois do erro é a porta de saída. Sem ele, o chamado seria criado mesmo inválido.
- Resposta vermelha no terminal nem sempre é falha: o que importa é o resultado bater com o esperado.

---

## 25/11/2026 — Fase 3: A despensa (PostgreSQL + Prisma) — feita no automático

**O que pedi ao Claude:** terminar o projeto no automático, fase por fase, mantendo Issues, branches, testes, PRs e diário. O pedido da Fase 3 eu mesmo escrevi antes, com as 4 perguntas: trocar a memória pelo PostgreSQL usando o Prisma, porque os chamados sumiam ao reiniciar; pronto quando o chamado continuar na lista depois de reiniciar; a senha fica no `.env` e nunca vai para o GitHub.

**O que o Claude entregou:**
- Um PostgreSQL só para o projeto (porta 5433, pasta `atende-pgdata` fora do repositório), porque eu não sabia a senha do usuário `postgres` da porta 5432. Usuário `atende` com senha nova guardada no `backend/.env`.
- O modelo `Chamado` no `schema.prisma` e a migração que criou a tabela `chamados`.
- As rotas trocaram o "caderninho" pelo `prisma.chamado.findMany` e `prisma.chamado.create`. A validação continua igual.
- Um seed com 4 chamados de exemplo, que não duplica se rodar duas vezes.

**Como foi conferido:** o Claude repetiu o meu experimento da Fase 2: criou um chamado, desligou e ligou a API, e o chamado **continuou** na lista. Depois rodou um `SELECT` direto no banco pelo `psql`. A saída está no PR. Eu ainda vou revisar o código com calma.

**O que deu errado no caminho (registrado pelo Claude):**
- O primeiro comando para ligar o banco ficou travado esperando, e a senha gerada se perdeu. O Claude liberou o acesso local por alguns segundos, trocou a senha e fechou de novo.
- Ele mandou três comandos SQL juntos e o PostgreSQL recusou tudo (`CREATE DATABASE` não roda junto com outros comandos). Repetiu um por um.
- O `prisma init` baixou pastas de "instruções para IA" que o projeto não precisa. O Claude olhou o que eram e removeu.
- No Prisma 7, a migração não gera mais o client sozinha: precisou rodar `prisma generate`. Por isso coloquei o `postinstall` no `package.json`.

**O que aprendi (para revisar):**
- **Migração** é o "histórico de obras" da despensa: cada mudança na tabela vira um arquivo SQL.
- **Seed** são os dados de exemplo para o sistema não começar vazio.
- **ORM (Prisma)** traduz o código TypeScript em SQL. O `findMany` vira um `SELECT`.

---

## 25/11/2026 — Fase 3 (parte 2): Rotas do atendente — feita no automático

**O que pedi ao Claude:** as ferramentas do atendente (Issue #3): responder, mudar o status e filtrar a lista.

**O que o Claude entregou:**
- Um campo novo `resposta` na tabela (segunda migração).
- `PATCH /chamados/:id`: muda o status e/ou grava a resposta.
- `GET /chamados?status=...`: filtra a lista.
- Erros tratados: status fora da lista (400), chamado que não existe (404), ID que não é número (400), pedido sem nada para mudar (400) e resposta vazia (400).

**Como foi conferido:** 8 chamadas pelo terminal (sucesso e erros) e um `SELECT` no banco mostrando a resposta gravada. A saída está no PR.

**Decisão para eu avaliar:** a API aceita qualquer status da lista, em qualquer ordem. O atendente pode voltar de "Resolvido" para "Aberto", por exemplo, se o problema voltar. A Issue não exigia uma ordem obrigatória.

**O que aprendi (para revisar):**
- **PATCH** = "muda só um pedaço" do chamado (diferente do POST, que cria um novo).
- **404** = "não encontrei". **`:id`** na rota é um "espaço em branco" que recebe o número do chamado.
- **Query string** (`?status=Aberto`) é o jeito de mandar filtros pelo endereço.

---

## 25/11/2026 — Fase 4: O chef que prova (testes automatizados) — feita no automático

**O que pedi ao Claude:** testes automáticos das rotas com Vitest + Supertest (Issue #4).

**O que o Claude entregou:**
- 14 testes cobrindo: criar chamado, sem título, sem descrição, título só com espaços, JSON quebrado, listar, filtrar, mudar status, status inválido, chamado inexistente (404) e ID inválido.
- Um **banco separado só para testes** (`atende_prefeitura_teste`). Antes de cada teste ele é esvaziado, então os testes nunca apagam os meus dados de exemplo.
- `npm test` roda tudo.

**Como foi conferido:** além de ver os 14 testes verdes, o Claude **quebrou o código de propósito** (tirou o `return` da validação do título) para ver se os testes percebiam.

**O que deu errado (e é a melhor parte):**
- **Com o código quebrado, os 14 testes continuaram passando!** O teste do "título só com espaços" conferia só o código 400, e não se o chamado tinha sido gravado. Sem o `return`, a API respondia 400, mas **gravava um chamado com título vazio**. O teste foi reforçado para conferir também que nada foi gravado. Agora ele pega o defeito.
- Por causa disso, o tratador de erros ganhou uma proteção: se a resposta já foi enviada, ele não tenta responder de novo.
- No terminal do Claude (Git Bash), o Vitest dava "failed to find the runner". No PowerShell funcionava. Era um problema do ambiente dele, não do projeto.

**O que aprendi (para revisar):**
- **Teste que nunca falha não prova nada.** Quebrar o código de propósito é o jeito de testar o teste.
- Conferir só a resposta não basta: é preciso conferir também **o que ficou gravado**.
- O `beforeEach` roda antes de cada teste, para um teste não atrapalhar o outro.

---

## 25/11/2026 — Fase 5: O salão (telas em React) — feita no automático

**O que pedi ao Claude:** as telas do cidadão e do atendente em React + TypeScript (Vite), usando a API (Issue #5).

**O que o Claude entregou:**
- **Tela do cidadão:** formulário (título, descrição, categoria e bairro) e a lista de chamados com etiqueta colorida de status e a resposta da prefeitura.
- **Tela do atendente:** filtros por status (Todos, Aberto, Em andamento, Resolvido) e, em cada chamado, um campo de resposta, a escolha do status e o botão Salvar.
- O `api.ts`, que é o "garçom" do salão: leva os pedidos para a API e transforma as mensagens de erro dela em avisos na tela.
- O Vite repassa os pedidos de `/chamados` para a API (porta 3333). Por isso não precisou configurar CORS.

**Como foi conferido:** o Claude usou um navegador automático (o Edge já instalado) para **clicar no fluxo inteiro**: enviar sem título e sem descrição (aparecem os erros), abrir um chamado (a lista atualizou), filtrar como atendente, responder, passar para "Em andamento" e depois "Resolvido", e voltar à tela do cidadão para ver a resposta. Também testou numa tela de celular (sem rolagem para o lado) e conferiu que não houve erros no console. Os prints estão em `docs/prints`.

**O que deu errado no caminho:**
- O primeiro comando para criar todos os arquivos de uma vez era grande demais, e o terminal não conseguiu ler (erro de aspas). Nada foi executado. O Claude criou os arquivos um por um.
- O verificador de código (oxlint) avisou que, se o atendente clicasse rápido em dois filtros, a resposta mais lenta poderia chegar por último e mostrar a lista errada. Foi corrigido com uma "trava" (`ativo`) dentro do `useEffect`.

**O que aprendi (para revisar):**
- **Componente** é uma peça reutilizável da tela (o `ChamadoCard` aparece nas duas telas).
- **Estado (`useState`)** é a memória da tela: quando muda, o React redesenha só o necessário.
- **`useEffect`** serve para buscar dados quando a tela abre ou quando o filtro muda.
