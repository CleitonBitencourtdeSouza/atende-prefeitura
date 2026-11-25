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

// GET /chamados: devolve a lista de chamados, do mais novo para o mais antigo.
app.get("/chamados", async (_req, res) => {
  const chamados = await prisma.chamado.findMany({ orderBy: { id: "desc" } });
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
