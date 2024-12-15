export interface Payment {
  id: string;
  value: number;
  customer?: string;
  status?: string;
}

export interface WebhookPayload {
  event: string;
  payment: Payment;
}
