// Dados de exemplo para a despensa não começar vazia.
import { prisma } from "../src/db.js";

const exemplos = [
  { titulo: "Buraco na rua", descricao: "Buraco grande em frente ao número 120.", categoria: "Vias", bairro: "Centro" },
  { titulo: "Lâmpada queimada", descricao: "Poste da praça está apagado há uma semana.", categoria: "Iluminação", bairro: "Jardim América" },
  { titulo: "Lixo acumulado", descricao: "A coleta não passou nesta semana.", categoria: "Limpeza", bairro: "Vila Nova", status: "Em andamento" },
  { titulo: "Árvore caída", descricao: "Galho grande bloqueando a calçada.", categoria: "Meio ambiente", bairro: "São José", status: "Resolvido" },
];

async function main() {
  // Só cria os exemplos se o banco estiver vazio (rodar duas vezes não duplica).
  const total = await prisma.chamado.count();
  if (total > 0) {
    console.log(`O banco já tem ${total} chamado(s). Nada a fazer.`);
    return;
  }
  await prisma.chamado.createMany({ data: exemplos });
  console.log(`${exemplos.length} chamados de exemplo criados.`);
}

main().finally(() => prisma.$disconnect());
