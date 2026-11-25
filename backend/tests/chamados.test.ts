// O "chef que prova o prato": testes automáticos das rotas de chamados.
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/db.js";

// Ajuda: cria um chamado direto no banco para preparar o cenário do teste.
function criarNoBanco(dados: { titulo: string; status?: string }) {
  return prisma.chamado.create({ data: { descricao: "Descrição de teste", ...dados } });
}

// Antes de CADA teste, a despensa é esvaziada: um teste não atrapalha o outro.
beforeEach(async () => {
  await prisma.chamado.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /chamados (cidadão abre um chamado)", () => {
  it("cria o chamado com status Aberto e responde 201", async () => {
    const resposta = await request(app).post("/chamados").send({
      titulo: "Buraco na rua",
      descricao: "Buraco grande em frente ao número 120.",
      categoria: "Vias",
      bairro: "Centro",
    });

    expect(resposta.status).toBe(201);
    expect(resposta.body).toMatchObject({
      titulo: "Buraco na rua",
      categoria: "Vias",
      bairro: "Centro",
      status: "Aberto",
    });
    expect(await prisma.chamado.count()).toBe(1);
  });

  it("usa 'Outros' e 'Não informado' quando categoria e bairro não vêm", async () => {
    const resposta = await request(app).post("/chamados").send({ titulo: "Lâmpada", descricao: "Queimada" });

    expect(resposta.status).toBe(201);
    expect(resposta.body.categoria).toBe("Outros");
    expect(resposta.body.bairro).toBe("Não informado");
  });

  it("recusa chamado sem título (400) e não grava nada", async () => {
    const resposta = await request(app).post("/chamados").send({ descricao: "Sem título" });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe("O título é obrigatório.");
    expect(await prisma.chamado.count()).toBe(0);
  });

  it("recusa título só com espaços (400) e não grava nada", async () => {
    const resposta = await request(app).post("/chamados").send({ titulo: "   ", descricao: "x" });

    expect(resposta.status).toBe(400);
    expect(await prisma.chamado.count()).toBe(0);
  });

  it("recusa chamado sem descrição (400)", async () => {
    const resposta = await request(app).post("/chamados").send({ titulo: "Sem descrição" });

    expect(resposta.status).toBe(400);
    expect(resposta.body.erro).toBe("A descrição é obrigatória.");
  });

  it("responde 400 em JSON quando o corpo é um JSON quebrado", async () => {
    const resposta = await request(app)
      .post("/chamados")
      .set("Content-Type", "application/json")
      .send("{quebrado");

    expect(resposta.status).toBe(400);
    expect(resposta.body).toEqual({ erro: "JSON inválido." });
  });
});

describe("GET /chamados (listar e filtrar)", () => {
  it("lista os chamados, do mais novo para o mais antigo", async () => {
    await criarNoBanco({ titulo: "Primeiro" });
    await criarNoBanco({ titulo: "Segundo" });

    const resposta = await request(app).get("/chamados");

    expect(resposta.status).toBe(200);
    expect(resposta.body.map((c: { titulo: string }) => c.titulo)).toEqual(["Segundo", "Primeiro"]);
  });

  it("filtra por status", async () => {
    await criarNoBanco({ titulo: "Aberto 1" });
    await criarNoBanco({ titulo: "Andamento 1", status: "Em andamento" });
    await criarNoBanco({ titulo: "Resolvido 1", status: "Resolvido" });

    const resposta = await request(app).get("/chamados").query({ status: "Em andamento" });

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].titulo).toBe("Andamento 1");
  });

  it("recusa filtro com status inexistente (400)", async () => {
    const resposta = await request(app).get("/chamados").query({ status: "Inventado" });

    expect(resposta.status).toBe(400);
  });
});

describe("PATCH /chamados/:id (atendente responde e muda status)", () => {
  it("muda o status, grava a resposta e salva no banco", async () => {
    const chamado = await criarNoBanco({ titulo: "Buraco" });

    const resposta = await request(app)
      .patch(`/chamados/${chamado.id}`)
      .send({ status: "Em andamento", resposta: "Equipe enviada." });

    expect(resposta.status).toBe(200);
    expect(resposta.body).toMatchObject({ status: "Em andamento", resposta: "Equipe enviada." });

    const noBanco = await prisma.chamado.findUnique({ where: { id: chamado.id } });
    expect(noBanco?.status).toBe("Em andamento");
    expect(noBanco?.resposta).toBe("Equipe enviada.");
  });

  it("recusa status fora da lista (400)", async () => {
    const chamado = await criarNoBanco({ titulo: "Buraco" });

    const resposta = await request(app).patch(`/chamados/${chamado.id}`).send({ status: "Cancelado" });

    expect(resposta.status).toBe(400);
  });

  it("responde 404 para chamado que não existe", async () => {
    const resposta = await request(app).patch("/chamados/999999").send({ status: "Resolvido" });

    expect(resposta.status).toBe(404);
    expect(resposta.body.erro).toBe("Chamado não encontrado.");
  });

  it("recusa pedido sem status e sem resposta (400)", async () => {
    const chamado = await criarNoBanco({ titulo: "Buraco" });

    const resposta = await request(app).patch(`/chamados/${chamado.id}`).send({});

    expect(resposta.status).toBe(400);
  });

  it("recusa ID que não é número (400)", async () => {
    const resposta = await request(app).patch("/chamados/abc").send({ status: "Resolvido" });

    expect(resposta.status).toBe(400);
  });
});
