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

**Como eu conferi:**
- Vi a saída dos comandos de versão no terminal.
- O `pg_isready` respondeu "aceitando conexões" na porta 5432.
- O Claude comparou o `CLAUDE.md` copiado com o original (`cmp`) e eram idênticos.

**O que estava errado ou eu mudei:**
- Eu não lembrava a senha do usuário `postgres`. O Claude achou um arquivo de senhas salvas, mas era do OnlyOffice, não do meu usuário. Vamos redefinir a senha antes da Fase 3.
- O sistema de segurança do Claude Code bloqueou dois comandos: apagar a pasta antiga e mudar o PATH do Windows. Eu mesmo fiz essas partes.

**O que aprendi:**
- Banco de dados roda como **serviço** no Windows: fica ligado o tempo todo esperando conexões, numa porta (o PostgreSQL usa a 5432).
- O **PATH** é a "agenda" onde o terminal procura os programas.
- O `.gitignore` impede que senhas e a pasta `node_modules` vão para o GitHub.
