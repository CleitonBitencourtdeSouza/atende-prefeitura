// Roda UMA vez antes de todos os testes: cria/atualiza as tabelas no banco de teste.
import { execSync } from "node:child_process";

export default function prepararBanco() {
  execSync("npx prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TESTE },
    stdio: "ignore",
  });
}
