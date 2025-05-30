import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { sendMessageToWebhook } from '../../services/api';
import { WEBHOOK_CONFIG } from '../../config/webhooks';
import { WebhookRequest, WebhookResponse } from '../../types/api';
import { getRandomWaitingMessage, getWaitingMessageByIndex, detectMessageLanguage, MessageLanguage } from '../../config/waitingMessages';
import TypewriterText from './TypewriterText';
import ProgressBar from './ProgressBar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [isMessageSending, setIsMessageSending] = useState(false); // Флаг для блокировки отправки сообщений
  const [waitingMessage, setWaitingMessage] = useState<string>(''); // Сообщение ожидания
  const [messageLanguage, setMessageLanguage] = useState<MessageLanguage>('ru'); // Язык последнего сообщения
  const [waitingMessageIndex, setWaitingMessageIndex] = useState<number>(0); // Индекс текущего сообщения ожидания
  const [waitingMessageOpacity, setWaitingMessageOpacity] = useState<number>(1); // Прозрачность сообщения для анимации
  const [isTypingText, setIsTypingText] = useState<boolean>(false); // Флаг для эффекта печатания
  const [isProgressActive, setIsProgressActive] = useState<boolean>(false); // Флаг активности прогресс-бара
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  
  // Инициализация userId при загрузке компонента
  useEffect(() => {
    let storedUserId = localStorage.getItem('chatUserId');
    if (!storedUserId) {
      // Генерация ID только из цифр
      const timestamp = Date.now();
      const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      storedUserId = timestamp.toString() + randomDigits;
      localStorage.setItem('chatUserId', storedUserId);
    }
    setUserId(storedUserId);
    console.log('User ID:', storedUserId);
    
    // Отладочный вывод URL вебхука
    console.log('Webhook URL:', WEBHOOK_CONFIG.CHAT_WEBHOOK_URL);
    console.log('Environment variable:', import.meta.env.VITE_CHAT_WEBHOOK_URL);
  }, []);

  // Эффект для управления сменой сообщений ожидания
  useEffect(() => {
    if (isTyping) {
      // Запускаем эффект печатания и прогресс-бар
      setIsTypingText(true);
      setIsProgressActive(true);
    } else {
      // Останавливаем анимации
      setIsTypingText(false);
      setIsProgressActive(false);
    }
  }, [isTyping]);
  
  // Обработчик завершения прогресс-бара
  const handleProgressComplete = () => {
    if (isTyping) {
      // Меняем сообщение на следующее
      const nextIndex = waitingMessageIndex + 1;
      setWaitingMessageIndex(nextIndex);
      setWaitingMessage(getWaitingMessageByIndex(nextIndex, messageLanguage));
      
      // Запускаем новый эффект печатания
      setIsTypingText(true);
      
      // Перезапускаем прогресс-бар
      setTimeout(() => {
        setIsProgressActive(false);
        setTimeout(() => {
          if (isTyping) {
            setIsProgressActive(true);
          }
        }, 100);
      }, 100);
    }
  };
  
  // Обработчик завершения эффекта печатания
  const handleTypingComplete = () => {
    setIsTypingText(false);
  };
  
  // Загрузка сохраненных сообщений или инициализация начального сообщения
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Преобразуем строковые даты обратно в объекты Date
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
        console.log('Loaded saved messages:', messagesWithDates.length);
      } catch (error) {
        console.error('Ошибка при загрузке сохраненных сообщений:', error);
        // Если произошла ошибка, показываем приветственное сообщение
        setMessages([
          {
            id: 1,
            text: t('welcome'),
            sender: 'system',
            timestamp: new Date()
          }
        ]);
      }
    } else {
      // Если сохраненных сообщений нет, показываем приветственное сообщение
      setMessages([
        {
          id: 1,
          text: t('welcome'),
          sender: 'system',
          timestamp: new Date()
        }
      ]);
    }
  }, [t]);  // Зависимость от t, чтобы приветственное сообщение было на правильном языке
  
  // Сохранение сообщений в localStorage при их изменении
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      console.log('Saved messages to localStorage:', messages.length);
    }
  }, [messages]);

  // Автоматическая прокрутка вниз при новых сообщениях
  useEffect(() => {
    if (messagesEndRef.current && chatSectionRef.current) {
      const chatContainer = chatSectionRef.current.querySelector('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Фокус на поле ввода при загрузке
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isMessageSending && !isTyping) {
      setIsMessageSending(true);
      
      const userMessage: Message = {
        id: Date.now(),
        text: inputValue.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputValue('');
      setIsTyping(true);
      
      // Определяем язык сообщения пользователя
      const detectedLanguage = detectMessageLanguage(inputValue.trim());
      setMessageLanguage(detectedLanguage);
      
      // Сбрасываем индекс сообщения ожидания
      setWaitingMessageIndex(0);
      
      // Устанавливаем первое сообщение ожидания на соответствующем языке
      setWaitingMessage(getWaitingMessageByIndex(0, detectedLanguage));
      setWaitingMessageOpacity(1);
      setIsTypingText(true);
      setIsProgressActive(true);
      
      try {
        const requestData: WebhookRequest = {
          message: userMessage.text,
          userId: userId, 
          timestamp: userMessage.timestamp.toISOString()
        };
        
        console.log('Sending to webhook:', requestData);
        console.log('Webhook URL:', WEBHOOK_CONFIG.CHAT_WEBHOOK_URL);
        
        const response = await sendMessageToWebhook(requestData, WEBHOOK_CONFIG.CHAT_WEBHOOK_URL);
        console.log('Webhook response:', response);
        
        const systemMessage: Message = {
          id: Date.now() + 1,
          text: response.reply || t('error_response'),
          sender: 'system',
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, systemMessage]);
          setIsTyping(false);
          setIsMessageSending(false);
          setWaitingMessage(''); 
        }, 1000); 
        
      } catch (error) {
        console.error('Error sending message:', error);
        
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: t('error_response'),
          sender: 'system',
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, errorMessage]);
          setIsTyping(false);
          setIsMessageSending(false);
          setWaitingMessage(''); 
        }, 1000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section id="chat-section" className="py-10 relative">
      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col md:items-center md:justify-center">
          <div ref={chatSectionRef} id="chat-container" className="max-w-5xl w-full mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="border-2 border-accent-secondary/30 rounded-lg shadow-lg shadow-accent-primary/5 overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom, rgba(26, 27, 30, 0.7), rgba(18, 19, 22, 0.95))',
                boxShadow: '0 10px 30px rgba(3, 218, 198, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Заголовок чата */}
              <div id="chat-header" className="backdrop-blur-md bg-dark-secondary/30 border-b border-accent-secondary/20 p-5 flex items-center justify-between">
                <div>
                  <h2 className="heading-md text-text-primary font-light">{t('online_chat')}</h2>
                </div>
                <div className="flex items-center">
                  <span className="flex h-3 w-3 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-secondary"></span>
                  </span>
                  <span className="text-xs text-accent-secondary uppercase tracking-widest font-medium">Live</span>
                </div>
              </div>
              
              {/* Содержимое чата */}
              <div 
                className="bg-dark-primary/30 backdrop-blur-md min-h-[400px] sm:min-h-[500px] md:min-h-[550px] max-h-[450px] sm:max-h-[550px] md:max-h-[650px] overflow-y-auto p-3 sm:p-4 md:p-6"
                style={{
                  backgroundImage: 'radial-gradient(circle at top right, rgba(55, 0, 179, 0.03), transparent 70%), radial-gradient(circle at bottom left, rgba(3, 218, 198, 0.03), transparent 70%)'
                }}
              >
                <div className="space-y-8">
                  {messages.map((message, index) => (
                    <motion.div 
                      key={message.id}
                      initial={{ opacity: 0, y: 20, x: message.sender === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] ${
                          message.sender === 'user' 
                            ? 'bg-accent-primary/15 border border-accent-primary/30 shadow-sm shadow-accent-primary/5' 
                            : 'bg-dark-secondary/20 border border-dark-border/20 shadow-sm shadow-dark-border/5'
                        } p-5 rounded-lg`}
                      >
                        <p className="text-text-primary font-light whitespace-pre-wrap">{message.text}</p>
                        <div className="text-xs text-text-secondary mt-2 flex justify-end items-center">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] bg-dark-secondary/20 border border-dark-border/20 shadow-sm p-5 rounded-lg">
                        {waitingMessage ? (
                          <div className="flex flex-col">
                            <div className="text-text-primary font-light mb-2">
                              {isTypingText ? (
                                <TypewriterText 
                                  text={waitingMessage} 
                                  speed={80}
                                  onComplete={handleTypingComplete}
                                />
                              ) : (
                                <span>{waitingMessage}</span>
                              )}
                            </div>
                            
                            {/* Индикатор прогресса */}
                            <ProgressBar 
                              duration={6000} 
                              isActive={isProgressActive}
                              onComplete={handleProgressComplete}
                            />
                            
                            {/* Убираем три точки */}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="w-20 h-1 bg-dark-border/20 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-accent-secondary/50"
                                animate={{ width: ["0%", "100%", "0%"] }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 2,
                                  ease: "easeInOut" 
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Ввод сообщения */}
              <div className="backdrop-blur-md bg-dark-secondary/30 p-3 sm:p-4 md:p-5 border-t border-accent-secondary/20 flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('typing_message')}
                  className="w-full sm:flex-grow bg-dark-primary/40 text-text-primary py-3 sm:py-4 px-3 sm:px-5 border border-dark-border/20 rounded-md outline-none focus:border-accent-secondary/50 transition-colors text-sm sm:text-base"
                />
                <motion.button
                  whileHover={{ scale: isMessageSending || isTyping ? 1 : 1.05 }}
                  whileTap={{ scale: isMessageSending || isTyping ? 1 : 0.95 }}
                  onClick={handleSendMessage}
                  disabled={isMessageSending || isTyping}
                  className={`w-full sm:w-auto sm:ml-3 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border border-accent-secondary/50 text-accent-secondary ${isMessageSending || isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-secondary/10'} px-4 sm:px-6 py-3 sm:py-4 rounded-md transition-colors font-light tracking-wider uppercase text-xs sm:text-sm`}
                >
                  {t('send')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat; 