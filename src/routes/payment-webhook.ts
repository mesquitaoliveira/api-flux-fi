import dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";

const paymentWebhookRouter = Router();

paymentWebhookRouter.post(
  "/payment-webhook",
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Validação do token
      const accessToken = req.headers["asaas-access-token"] as
        | string
        | undefined;
      const expectedAccessToken = process.env.WEBHOOK_AUTH_TOKEN;

      if (!accessToken || accessToken !== expectedAccessToken) {
        console.error("Token inválido:", accessToken);
        res.status(403).json({ error: "Token inválido" });
        return;
      }

      // Processamento do payload do webhook
      const { event, payment } = req.body;

      // Validação do payload
      if (!event || !payment) {
        res.status(400).json({ error: "Payload inválido ou incompleto" });
        return;
      }

      // Dados processados do pagamento
      const paymentStatus = {
        id: payment.id,
        value: payment.value,
        status: payment.status,
        event: event,
        message: ""
      };

      // Lógica do evento
      switch (event) {
        case "PAYMENT_RECEIVED":
          paymentStatus.message = `Pagamento recebido com sucesso: ${payment.id}, valor: ${payment.value}`;
          console.log(paymentStatus.message);
          break;

        case "PAYMENT_CONFIRMED":
          paymentStatus.message = `Pagamento confirmado: ${payment.id}, valor: ${payment.value}`;
          console.log(paymentStatus.message);
          break;

        default:
          paymentStatus.message = `Evento desconhecido: ${event}`;
          console.warn(paymentStatus.message);
          break;
      }

      // Retorna o status detalhado do pagamento para o front-end
      res.status(200).json(paymentStatus);
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      res.status(500).json({ error: "Erro ao processar webhook" });
    }
  }
);

export { paymentWebhookRouter };
