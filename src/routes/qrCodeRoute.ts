import { Router } from "express";
import axios from "axios";
import { BASE_URL, API_KEY, CHAVE_PIX } from "../constants/index";

const qrCodeRouter = Router();

// Gera QR Code
qrCodeRouter.post("/generate-qr-code", async (req, res) => {
  try {
    const { value } = req.body;
    const response = await axios.post(
      BASE_URL,
      {
        addressKey: CHAVE_PIX,
        value,
        expirationSeconds: 180,
        allowsMultiplePayments: false,
        format: "ALL"
      },
      {
        headers: {
          access_token: API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Erro ao gerar QR Code:", (error as any).message);
    res.status(500).json({ error: "Erro ao gerar QR Code" });
  }
});

export { qrCodeRouter };
