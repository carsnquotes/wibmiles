import { WebhookRequest, WebhookResponse } from '../types/api';

/**
 * Отправляет сообщение на вебхук n8n
 * @param message Сообщение для отправки
 * @param webhookUrl URL вебхука
 * @returns Ответ от вебхука
 */
export const sendMessageToWebhook = async (message: WebhookRequest, webhookUrl: string): Promise<WebhookResponse> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending message to webhook:', error);
    throw error;
  }
};
