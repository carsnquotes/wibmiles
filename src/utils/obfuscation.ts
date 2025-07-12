/**
 * Утилиты для обфускации и деобфускации URL
 */

/**
 * Простая обфускация строки с использованием Base64 и разбиением на части
 * @param input Исходная строка
 * @returns Обфусцированные части строки
 */
export const obfuscateString = (input: string): string[] => {
  // Разбиваем строку на несколько частей
  const parts = [];
  const chunkSize = Math.ceil(input.length / 3);
  
  for (let i = 0; i < input.length; i += chunkSize) {
    const part = input.substring(i, Math.min(i + chunkSize, input.length));
    // Кодируем каждую часть в Base64
    const encoded = btoa(part);
    parts.push(encoded);
  }
  
  return parts;
};

/**
 * Деобфускация строки из обфусцированных частей
 * @param parts Обфусцированные части строки
 * @returns Исходная строка
 */
export const deobfuscateString = (parts: string[]): string => {
  // Декодируем каждую часть из Base64 и объединяем
  return parts.map(part => atob(part)).join('');
};

/**
 * Получение URL из обфусцированных частей
 * @param parts Обфусцированные части URL
 * @returns Полный URL
 */
export const getUrlFromParts = (parts: string[]): string => {
  return deobfuscateString(parts);
};
