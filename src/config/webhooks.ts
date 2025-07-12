import { getUrlFromParts } from '../utils/obfuscation';

/**
 * Конфигурация вебхуков для интеграции с n8n
 */

// Обфусцированные части URL вебхука
// Оригинальный URL разбит на части и закодирован в Base64
const chatWebhookParts = [
  'aHR0cHM6Ly9uOG4u', // часть 1
  'YXBwc2NhcnNucXVvdGVz', // часть 2
  'LmNvbS93ZWJob29rL2NoYXQx' // часть 3
];

export const WEBHOOK_CONFIG = {
  // URL вебхука для чата, обфусцированный для повышения безопасности
  get CHAT_WEBHOOK_URL() {
    // Используем переменную окружения, если она доступна
    if (import.meta.env.VITE_CHAT_WEBHOOK_URL) {
      return import.meta.env.VITE_CHAT_WEBHOOK_URL;
    }
    // Иначе используем обфусцированный URL
    return getUrlFromParts(chatWebhookParts);
  },
  
  // Таймаут для запросов к вебхуку (в миллисекундах)
  WEBHOOK_TIMEOUT: 10000,
  
  // Максимальное количество попыток повторного подключения
  MAX_RETRY_ATTEMPTS: 3,
};
