import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import ngrok from "@ngrok/ngrok";

const PORT = process.env.PORT || 5000;

// Função principal
const startServer = async () => {
  app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

    try {
      // Configura o ngrok
      const client = await ngrok.connect({
        addr: PORT, // Porta local
        authtoken: process.env.NGROK_AUTHTOKEN // Configurado no .env
      });

      // Recupera a URL do túnel gerado
      const url = client.url();

      console.log(`URL pública do ngrok: ${url}`);

      // Atualize a URL do webhook com a URL gerada pelo ngrok
      console.log(
        `Configure seu webhook com a URL: ${url}/api/payment-webhook`
      );
    } catch (error: any) {
      if (error instanceof Error) {
        console.error("Erro ao configurar o ngrok:", error.message);
      } else {
        console.error("Erro ao configurar o ngrok:", error);
      }
    }
  });
};

startServer();
