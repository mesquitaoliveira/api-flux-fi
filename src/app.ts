import express from "express";
import cors from "cors";
import { qrCodeRouter } from "./routes/qrCodeRoute";
import { paymentWebhookRouter } from "./routes/payment-webhook";

const app = express();

const corsOptions = {
  origin: ["https://flux-fi.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  credentials: true
};

// Middleware de CORS
app.use(cors(corsOptions));

// Middleware explícito para OPTIONS
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://flux-fi.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204); // Responde corretamente à requisição preflight
});

// Outros Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api", qrCodeRouter);
app.use("/api", paymentWebhookRouter);

export default app;
