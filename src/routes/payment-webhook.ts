import dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";
const paymentWebhookRouter = Router();

paymentWebhookRouter.post(
  "/payment-webhook",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const authToken = req.headers["authToken"] as string | undefined;
      const expectedAuthToken = process.env.WEBHOOK_AUTH_TOKEN;
      console.log("authToken:", expectedAuthToken);
      // Validação do token
      if (!authToken || authToken !== expectedAuthToken) {
        console.error("Token inválido:", authToken);
        res.status(403).json({ error: "Token inválido" });
        return;
      }

      // Processamento do payload do webhook
      const { event, payment } = req.body;

      // Lógica do evento
      if (event === "PAYMENT_RECEIVED") {
        console.log(
          `Pagamento recebido: ${payment.id}, valor: ${payment.value}`
        );
      } else if (event === "PAYMENT_CONFIRMED") {
        console.log(
          `Pagamento confirmado: ${payment.id}, valor: ${payment.value}`
        );
      } else {
        console.warn(`Evento desconhecido: ${event}`);
      }

      res.status(200).json({ message: "Webhook processado com sucesso" });
    } catch (error) {
      console.error("Erro ao processar webhook:", (error as any).message);
      res.status(500).json({ error: "Erro ao processar webhook" });
    }
  }
);

export { paymentWebhookRouter };
