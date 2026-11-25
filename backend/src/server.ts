import { app } from "./app.js";

// A "porta" por onde a cozinha recebe os pedidos.
const PORTA = Number(process.env.PORT) || 3333;

app.listen(PORTA, () => {
  console.log(`API rodando em http://localhost:${PORTA}`);
});
