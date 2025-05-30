/**
 * Конфигурационный файл с сообщениями, которые отображаются 
 * пока пользователь ожидает ответа от агента
 */

export interface WaitingMessage {
  id: number;
  textRu: string;
  textEn: string;
}

// Тип языка для сообщений
export type MessageLanguage = 'ru' | 'en';

export const waitingMessages: WaitingMessage[] = [
  {
    id: 1,
    textRu: "Наш агент подбирает для вас оптимальные варианты...",
    textEn: "Our agent is selecting the best options for you..."
  },
  {
    id: 2,
    textRu: "Ищем в базе подходящие предложения...",
    textEn: "Searching our database for suitable offers..."
  },
  {
    id: 3,
    textRu: "Анализируем доступные варианты лизинга...",
    textEn: "Analyzing available leasing options..."
  },
  {
    id: 4,
    textRu: "Сравниваем условия от разных дилеров...",
    textEn: "Comparing terms from different dealers..."
  },
  {
    id: 5,
    textRu: "Проверяем специальные предложения для вас...",
    textEn: "Checking special offers for you..."
  },
  {
    id: 6,
    textRu: "Рассчитываем оптимальные условия финансирования...",
    textEn: "Calculating optimal financing terms..."
  },
  {
    id: 7,
    textRu: "Подбираем персональное предложение...",
    textEn: "Preparing a personalized offer for you..."
  },
  {
    id: 8,
    textRu: "Уточняем актуальные цены и комплектации...",
    textEn: "Verifying current prices and configurations..."
  },
  {
    id: 9,
    textRu: "Консультируемся с экспертами по вашему запросу...",
    textEn: "Consulting with experts about your request..."
  },
  {
    id: 10,
    textRu: "Готовим детальный ответ на ваш вопрос...",
    textEn: "Preparing a detailed answer to your question..."
  }
];

/**
 * Определяет язык сообщения по его тексту
 * @param {string} text - Текст сообщения
 * @returns {MessageLanguage} Язык сообщения ('ru' или 'en')
 */
export const detectMessageLanguage = (text: string): MessageLanguage => {
  // Простой алгоритм определения языка по наличию кириллицы
  const cyrillicPattern = /[\u0400-\u04FF]/;
  return cyrillicPattern.test(text) ? 'ru' : 'en';
};

/**
 * Функция для получения случайного сообщения ожидания на определенном языке
 * @param {MessageLanguage} language - Язык сообщения ('ru' или 'en')
 * @returns {string} Случайное сообщение ожидания на указанном языке
 */
export const getRandomWaitingMessage = (language: MessageLanguage = 'ru'): string => {
  const randomIndex = Math.floor(Math.random() * waitingMessages.length);
  return language === 'ru' ? waitingMessages[randomIndex].textRu : waitingMessages[randomIndex].textEn;
};

/**
 * Функция для получения сообщения ожидания по индексу на определенном языке
 * @param {number} index - Индекс сообщения
 * @param {MessageLanguage} language - Язык сообщения ('ru' или 'en')
 * @returns {string} Сообщение ожидания на указанном языке
 */
export const getWaitingMessageByIndex = (index: number, language: MessageLanguage = 'ru'): string => {
  // Используем остаток от деления, чтобы индекс всегда был в пределах массива
  const safeIndex = index % waitingMessages.length;
  return language === 'ru' ? waitingMessages[safeIndex].textRu : waitingMessages[safeIndex].textEn;
};
