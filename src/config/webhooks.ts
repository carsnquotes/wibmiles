/**
 * Конфигурация вебхуков для интеграции с n8n
 */
export const WEBHOOK_CONFIG = {
  // URL вебхука для чата, захардкожен напрямую для решения проблемы с переменными окружения
  // CHAT_WEBHOOK_URL: import.meta.env.VITE_CHAT_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/chat',
  CHAT_WEBHOOK_URL: 'https://n8n.appscarsnquotes.com/webhook/chat1',
  
  // Таймаут для запросов к вебхуку (в миллисекундах)
  WEBHOOK_TIMEOUT: 10000,
  
  // Максимальное количество попыток повторного подключения
  MAX_RETRY_ATTEMPTS: 3,
};
