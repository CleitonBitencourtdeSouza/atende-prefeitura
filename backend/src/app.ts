import express, { type ErrorRequestHandler } from "express";

// Os "status" que um chamado pode ter.
export type Status = "Aberto" | "Em andamento" | "Resolvido";

// O formato de um chamado (a "ficha" que a cozinha guarda).
export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  bairro: string;
  status: Status;
  criadoEm: string;
}

// Nesta fase, os chamados ficam numa lista na memória.
// Se a API for desligada, a lista se perde (o banco vem na Fase 3).
const chamados: Chamado[] = [];
let proximoId = 1;

export const app = express();

// Ensina a API a ler o corpo dos pedidos em JSON.
app.use(express.json());

// GET /chamados: devolve a lista de chamados.
app.get("/chamados", (_req, res) => {
  res.json(chamados);
});

// Confere se o valor é um texto com algo escrito (não vale vazio nem só espaços).
function textoPreenchido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim() !== "";
}

// POST /chamados: abre um chamado novo.
app.post("/chamados", (req, res) => {
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

  const chamado: Chamado = {
    id: proximoId++,
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    categoria: textoPreenchido(categoria) ? categoria.trim() : "Outros",
    bairro: textoPreenchido(bairro) ? bairro.trim() : "Não informado",
    status: "Aberto",
    criadoEm: new Date().toISOString(),
  };

  chamados.push(chamado);

  // 201 = "Criado! Deu certo."
  res.status(201).json(chamado);
});
// Gerente de crise: trata os erros antes de chegarem ao cliente.
const tratarErros: ErrorRequestHandler = (erro, _req, res, _next) => {

  // o pedido chegou com o JSON quebrado: culpa é de quem enviou (400).

  if (erro.type === "entity.parse.failed") {
    res.status(400).json({ erro: "JSON inválido."});
    return;
  }
   // Qualquer outro erro: a culpa é nossa (500), mas sem mostrar detalhes.
   res.status(500).json({ erro: "Erro interno do servidor." });
};

   app.use(tratarErros);