# План интеграции чата с воркфлоу n8n

## Общая информация

Текущий проект представляет собой веб-приложение на React с TypeScript, использующее Vite в качестве сборщика. Необходимо интегрировать существующий компонент чата с воркфлоу в n8n, который будет отвечать за логику агента поддержки. Поскольку n8n работает только с вебхуками, нам потребуется настроить взаимодействие через них.

## Текущее состояние

1. Имеется компонент чата (`Chat.tsx`), который:
   - Отображает сообщения пользователя и системы
   - Имеет функционал отправки сообщений
   - Имеет имитацию ответа системы через `setTimeout`

2. Сейчас логика ответов системы захардкожена в компоненте и не связана с внешними сервисами.

## План действий

### 1. Создание API-сервиса для работы с вебхуками (1-2 часа)

1. Создать новый файл `src/services/api.ts` для работы с API:
   ```typescript
   // Базовые функции для работы с вебхуками n8n
   export const sendMessageToWebhook = async (message: any, webhookUrl: string) => {
     try {
       const response = await fetch(webhookUrl, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(message),
       });
       return await response.json();
     } catch (error) {
       console.error('Error sending message to webhook:', error);
       throw error;
     }
   };
   ```

### 2. Создание конфигурационного файла для вебхуков (30 минут)

1. Создать файл `src/config/webhooks.ts`:
   ```typescript
   export const WEBHOOK_CONFIG = {
     CHAT_WEBHOOK_URL: process.env.CHAT_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/chat',
     // Другие настройки вебхуков
   };
   ```

2. Обновить файл `.env.example` и создать `.env.local` с настройками вебхуков:
   ```
   VITE_CHAT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
   ```

### 3. Модификация компонента Chat.tsx (2-3 часа)

1. Импортировать новые сервисы и конфигурации:
   ```typescript
   import { sendMessageToWebhook } from '../../services/api';
   import { WEBHOOK_CONFIG } from '../../config/webhooks';
   ```

2. Модифицировать функцию `handleSendMessage` для отправки сообщений через вебхук:
   ```typescript
   const handleSendMessage = async () => {
     if (inputValue.trim()) {
       // Добавление сообщения пользователя
       const userMessage: Message = {
         id: messages.length + 1,
         text: inputValue,
         sender: 'user',
         timestamp: new Date()
       };
       
       setMessages([...messages, userMessage]);
       setInputValue('');
       
       // Имитация набора текста оператором
       setIsTyping(true);
       
       try {
         // Отправка сообщения в n8n через вебхук
         const response = await sendMessageToWebhook({
           message: inputValue,
           userId: 'user-123', // Можно добавить идентификацию пользователя
           timestamp: new Date().toISOString(),
           language: language
         }, import.meta.env.VITE_CHAT_WEBHOOK_URL);
         
         // Обработка ответа от n8n
         setIsTyping(false);
         const systemMessage: Message = {
           id: messages.length + 2,
           text: response.reply || t('auto_reply'),
           sender: 'system',
           timestamp: new Date()
         };
         
         setMessages(prevMessages => [...prevMessages, systemMessage]);
       } catch (error) {
         console.error('Error communicating with n8n:', error);
         setIsTyping(false);
         
         // Показываем сообщение об ошибке
         const errorMessage: Message = {
           id: messages.length + 2,
           text: t('error_message') || 'Sorry, there was an error processing your request.',
           sender: 'system',
           timestamp: new Date()
         };
         
         setMessages(prevMessages => [...prevMessages, errorMessage]);
       }
     }
   };
   ```

3. Добавить обработку ошибок и состояния загрузки.

### 4. Настройка типов данных (1 час)

1. Создать файл `src/types/api.ts` для типизации API:
   ```typescript
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
   ```

2. Обновить импорты в `api.ts` и `Chat.tsx`.

### 5. Настройка n8n (2-3 часа)

1. Создать новый воркфлоу в n8n:
   - Добавить триггер Webhook
   - Настроить обработку входящих сообщений
   - Добавить логику агента поддержки (можно использовать HTTP Request ноды для обращения к внешним API или собственную логику)
   - Настроить форматирование ответа

2. Получить URL вебхука из n8n и добавить его в `.env.local`.

### 6. Тестирование (2 часа)

1. Проверить отправку сообщений из чата в n8n
2. Проверить получение и отображение ответов от n8n
3. Проверить обработку ошибок
4. Проверить работу при отсутствии соединения

### 7. Улучшения (опционально, 3-4 часа)

1. Добавить кэширование ответов для улучшения производительности
2. Реализовать механизм повторных попыток при сбоях соединения
3. Добавить анимации для улучшения UX
4. Реализовать сохранение истории чата в localStorage
5. Добавить возможность загрузки файлов

## Технические детали

### Структура данных для обмена с n8n

**Запрос к n8n:**
```json
{
  "message": "Текст сообщения пользователя",
  "userId": "user-123",
  "timestamp": "2025-05-27T20:22:07.000Z",
  "language": "ru",
  "metadata": {
    "browser": "Chrome",
    "platform": "Windows"
  }
}
```

**Ответ от n8n:**
```json
{
  "reply": "Ответ от агента поддержки",
  "status": "success",
  "metadata": {
    "agentId": "agent-456",
    "responseTime": "0.5s"
  }
}
```

### Безопасность

1. Рассмотреть добавление аутентификации для вебхуков
2. Не хранить чувствительные данные в коде
3. Использовать HTTPS для всех запросов

## Временные рамки

Общее время реализации: примерно 10-15 часов работы.

1. Настройка базовой инфраструктуры: 2-3 часа
2. Интеграция с компонентом чата: 3-4 часа
3. Настройка n8n: 2-3 часа
4. Тестирование и отладка: 2-3 часа
5. Документация и улучшения: 1-2 часа
