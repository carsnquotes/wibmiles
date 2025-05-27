/**
 * Конфигурация вебхуков для интеграции с n8n
 */
export const WEBHOOK_CONFIG = {
  // URL вебхука для чата, берется из переменных окружения или используется значение по умолчанию
  CHAT_WEBHOOK_URL: import.meta.env.VITE_CHAT_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/chat',
  
  // Таймаут для запросов к вебхуку (в миллисекундах)
  WEBHOOK_TIMEOUT: 10000,
  
  // Максимальное количество попыток повторного подключения
  MAX_RETRY_ATTEMPTS: 3,
};
