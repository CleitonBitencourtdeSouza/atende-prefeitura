import "dotenv/config";
import { defineConfig } from "vitest/config";

const urlTeste = process.env.DATABASE_URL_TESTE;
if (!urlTeste) {
  throw new Error("Defina DATABASE_URL_TESTE no arquivo .env (veja o .env.example).");
}

export default defineConfig({
  test: {
    // Os testes usam o banco de TESTE, nunca o banco "de verdade".
    env: { DATABASE_URL: urlTeste },
    globalSetup: ["./tests/preparar-banco.ts"],
    // Um arquivo por vez, porque todos usam o mesmo banco.
    fileParallelism: false,
  },
});
