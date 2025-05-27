export interface WebhookResponse {
  reply: string;
  status: 'success' | 'error';
  metadata?: any;
}

export interface WebhookRequest {
  message: string;
  userId: string;
  timestamp: string;
  language?: string;
  metadata?: any;
}
