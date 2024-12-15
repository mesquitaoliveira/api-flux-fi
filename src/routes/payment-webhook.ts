import dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";
import axios from "axios";
import { ASAAS_API_URL, API_KEY, WEBHOOK_AUTH_TOKEN } from "../constants/index";

const paymentWebhookRouter = Router();

paymentWebhookRouter.post(
  "/payment-webhook",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const accessToken = req.headers["asaas-access-token"] as
        | string
        | undefined;
      const expectedAccessToken = WEBHOOK_AUTH_TOKEN;

      if (!accessToken || accessToken !== expectedAccessToken) {
        console.error("Token inválido:", accessToken);
        res.status(403).json({ error: "Token inválido" });
        return;
      }

      const { event, payment } = req.body;

      if (!event || !payment) {
        res.status(400).json({ error: "Payload inválido ou incompleto" });
        return;
      }

      console.log(`Evento recebido: ${event}`);
      console.log(`Verificando pagamento: ${payment.id}`);

      // Verificar pagamento na API do Asaas
      const asaasResponse = await axios.get(
        `${ASAAS_API_URL}/payments/${payment.id}`,
        {
          headers: {
            access_token: API_KEY
          }
        }
      );

      const paymentData = asaasResponse.data;

      // Validar se o pagamento realmente existe
      if (!paymentData || paymentData.status !== payment.status) {
        console.error("Pagamento inválido ou não encontrado no Asaas.");
        res.status(404).json({
          error: "Pagamento não encontrado ou status inválido."
        });
        return;
      }

      // Lógica do evento
      let message = "";
      switch (event) {
        case "PAYMENT_RECEIVED":
          message = `Pagamento recebido com sucesso: ${payment.id}, valor: ${payment.value}`;
          console.log(message);
          break;

        case "PAYMENT_CONFIRMED":
          message = `Pagamento confirmado: ${payment.id}, valor: ${payment.value}`;
          console.log(message);
          break;

        default:
          message = `Evento desconhecido: ${event}`;
          console.warn(message);
          break;
      }

      // Retorna os dados do pagamento
      res.status(200).json({
        id: payment.id,
        value: payment.value,
        status: payment.status,
        event: event,
        message: message,
        asaasPaymentData: paymentData // Incluí os dados retornados do Asaas
      });
    } catch (error) {
      console.error("Erro ao processar webhook:", error);

      // Verificar se o erro veio do Asaas (404 ou similar)
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error("Erro da API do Asaas:", status, data);
        res.status(status).json({
          error: "Erro ao consultar pagamento na API do Asaas",
          details: data
        });
      } else {
        res.status(500).json({ error: "Erro ao processar webhook" });
      }
    }
  }
);

export { paymentWebhookRouter };
