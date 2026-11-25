import express, { type ErrorRequestHandler } from "express";
import { prisma } from "./db.js";

// Os "status" que um chamado pode ter.
export const STATUS = ["Aberto", "Em andamento", "Resolvido"] as const;
export type Status = (typeof STATUS)[number];

export const app = express();

// Ensina a API a ler o corpo dos pedidos em JSON.
app.use(express.json());

// Confere se o valor é um texto com algo escrito (não vale vazio nem só espaços).
function textoPreenchido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim() !== "";
}

// Confere se o texto é um dos status permitidos.
function statusValido(valor: unknown): valor is Status {
  return STATUS.includes(valor as Status);
}

// GET /chamados: devolve a lista, do mais novo para o mais antigo.
// Com ?status=Aberto, devolve só os chamados daquele status (filtro do atendente).
app.get("/chamados", async (req, res) => {
  const { status } = req.query;

  if (status !== undefined && !statusValido(status)) {
    res.status(400).json({ erro: `Status inválido. Use: ${STATUS.join(", ")}.` });
    return;
  }

  const chamados = await prisma.chamado.findMany({
    where: status ? { status } : undefined,
    orderBy: { id: "desc" },
  });
  res.json(chamados);
});

// POST /chamados: abre um chamado novo e guarda no banco.
app.post("/chamados", async (req, res) => {
  const { titulo, descricao, categoria, bairro } = req.body ?? {};

  // Validação: sem título ou sem descrição, devolve 400 (pedido errado).
  if (!textoPreenchido(titulo)) {
    res.status(400).json({ erro: "O título é obrigatório." });
    return;
  }
  if (!textoPreenchido(descricao)) {
    res.status(400).json({ erro: "A descrição é obrigatória." });
    return;
  }

  const chamado = await prisma.chamado.create({
    data: {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      // Se vierem vazios, o banco usa o valor padrão ("Outros" / "Não informado").
      categoria: textoPreenchido(categoria) ? categoria.trim() : undefined,
      bairro: textoPreenchido(bairro) ? bairro.trim() : undefined,
    },
  });

  // 201 = "Criado! Deu certo."
  res.status(201).json(chamado);
});

// PATCH /chamados/:id: o atendente responde e/ou muda o status de um chamado.
app.patch("/chamados/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ erro: "ID inválido." });
    return;
  }

  const { status, resposta } = req.body ?? {};

  // Precisa mandar pelo menos uma coisa para mudar.
  if (status === undefined && resposta === undefined) {
    res.status(400).json({ erro: "Envie o status e/ou a resposta." });
    return;
  }
  if (status !== undefined && !statusValido(status)) {
    res.status(400).json({ erro: `Status inválido. Use: ${STATUS.join(", ")}.` });
    return;
  }
  if (resposta !== undefined && !textoPreenchido(resposta)) {
    res.status(400).json({ erro: "A resposta não pode ficar vazia." });
    return;
  }

  // O chamado existe? Se não, 404 ("não encontrei").
  const existe = await prisma.chamado.findUnique({ where: { id } });
  if (!existe) {
    res.status(404).json({ erro: "Chamado não encontrado." });
    return;
  }

  const chamado = await prisma.chamado.update({
    where: { id },
    data: {
      status,
      resposta: resposta === undefined ? undefined : resposta.trim(),
    },
  });

  res.json(chamado);
});

// Gerente de crise: trata os erros antes de chegarem ao cliente.
const tratarErros: ErrorRequestHandler = (erro, _req, res, _next) => {
  // O pedido chegou com o JSON quebrado: a culpa é de quem enviou (400).
  if (erro.type === "entity.parse.failed") {
    res.status(400).json({ erro: "JSON inválido." });
    return;
  }
  // Qualquer outro erro: a culpa é nossa (500), mas sem mostrar detalhes.
  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor." });
};

app.use(tratarErros);
