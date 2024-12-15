import dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";

const paymentWebhookRouter = Router();

paymentWebhookRouter.post(
  "/payment-webhook",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Obter o token do cabeçalho 'asaas-access-token'
      const accessToken = req.headers["asaas-access-token"] as
        | string
        | undefined;
      const expectedAccessToken = process.env.WEBHOOK_AUTH_TOKEN;

      console.log("Token esperado:", expectedAccessToken);
      console.log("Token recebido:", accessToken);

      // Validação do token
      if (!accessToken || accessToken !== expectedAccessToken) {
        console.error("Token inválido:", accessToken);
        res.status(403).json({ error: "Token inválido" });
        return;
      }

      // Processamento do payload do webhook
      const { event, payment } = req.body;

      // Log do evento recebido
      console.log("Evento recebido:", event);
      console.log("Dados do pagamento:", payment);

      // Lógica do evento
      switch (event) {
        case "PAYMENT_RECEIVED":
          console.log(
            `Pagamento recebido: ${payment.id}, valor: ${payment.value}`
          );
          break;

        case "PAYMENT_CONFIRMED":
          console.log(
            `Pagamento confirmado: ${payment.id}, valor: ${payment.value}`
          );
          break;

        default:
          console.warn(`Evento desconhecido: ${event}`);
      }

      // Resposta de sucesso para o Asaas
      res.status(200).json({ message: "Webhook processado com sucesso" });
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      res.status(500).json({ error: "Erro ao processar webhook" });
    }
  }
);

export { paymentWebhookRouter };
