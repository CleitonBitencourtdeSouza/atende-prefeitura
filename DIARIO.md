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
