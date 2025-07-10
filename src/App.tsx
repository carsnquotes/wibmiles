import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header/Header';
import Chat from './components/Chat/Chat';
import Partners from './components/Partners/Partners';
import ContactFrames from './components/ContactFrames/ContactFrames';
import Testimonials from './components/Testimonials/Testimonials';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Компонент для основного содержимого приложения
const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  
  // Скролл к чату так, чтобы он был по центру экрана при загрузке страницы
  useEffect(() => {
    if (isLoaded) {
      // Небольшая задержка, чтобы убедиться, что все элементы загружены
      setTimeout(() => {
        // Находим контейнер чата
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
          // Вычисляем позицию для центрирования
          const rect = chatContainer.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Вычисляем позицию для центрирования чата по вертикали
          const centerPosition = scrollTop + rect.top - (window.innerHeight - rect.height) / 2;
          
          // Скроллим к вычисленной позиции
          window.scrollTo({
            top: centerPosition,
            behavior: 'auto' // Без анимации
          });
        }
      }, 100);
    }
  }, [isLoaded]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Добавляем задержку для анимации загрузки
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(loadTimer);
    };
  }, []);
  
  return (
    <div className="relative min-h-screen bg-dark-primary text-text-primary font-light overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute top-0 left-[5%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-accent-primary/10 rounded-full blur-[100px] sm:blur-[150px]" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-[30%] right-[5%] w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] bg-accent-secondary/10 rounded-full blur-[80px] sm:blur-[120px]" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute bottom-0 left-[20%] w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] bg-dark-accent/10 rounded-full blur-[100px] sm:blur-[150px]" 
        />
      </div>
      
      {/* Mouse follower */}
      <motion.div 
        className="hidden md:block fixed w-32 h-32 bg-accent-secondary/20 rounded-full blur-xl pointer-events-none z-10 animate-pulse-slow"
        style={{
          left: `${mousePosition.x - 64}px`,
          top: `${mousePosition.y - 64}px`,
          opacity: 0.4,
          transition: 'transform 0.2s, left 0.3s ease-out, top 0.3s ease-out',
          transform: `scale(${1 + scrollY * 0.001})`,
        }}
      />
      
      {/* Page content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-20 min-h-screen flex flex-col"
          >
            <Header />
            
            <main className="container mx-auto px-3 sm:px-4 md:px-6 flex-grow pb-6 sm:pb-8 md:pb-10">
              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12">
                <div ref={chatSectionRef}>
                  <Chat />
                </div>
                <div>
                  <Partners />
                </div>
                <div>
                  <ContactFrames />
                </div>
                <div>
                  <Testimonials />
                </div>
              </div>
            </main>
            
            <footer className="w-full z-5 bg-dark-primary py-6 sm:py-8 md:py-10 border-t border-dark-border/10 mt-auto">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
                  {/* Левая колонка с ссылками */}
                  <div className="flex flex-col space-y-4 items-center md:items-start">
                    <div className="flex space-x-4 mb-2">
                      <a href="#" className="text-text-secondary hover:text-accent-secondary text-sm transition-colors">
                        Privacy Policy
                      </a>
                      <a href="#" className="text-text-secondary hover:text-accent-secondary text-sm transition-colors">
                        Terms of Service
                      </a>
                      <a href="#" className="text-text-secondary hover:text-accent-secondary text-sm transition-colors">
                        FAQ
                      </a>
                    </div>
                    <div className="flex space-x-4">
                      <a href="#" className="text-text-secondary hover:text-accent-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                        </svg>
                      </a>
                      <a href="#" className="text-text-secondary hover:text-accent-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                        </svg>
                      </a>
                      <a href="#" className="text-text-secondary hover:text-accent-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  {/* Правая колонка с адресом */}
                  <div className="flex flex-col items-center md:items-end">
                    <div className="text-text-secondary text-sm mb-2">
                      <p>Hi Miles LLC</p>
                      <p>8 The Green, Ste B</p>
                      <p>Dover, DE 19901</p>
                    </div>
                    <div className="text-text-secondary text-sm">
                      <p>Email: info@hi-miles.com</p>
                    </div>
                  </div>
                </div>
                
                {/* Копирайт внизу */}
                <div className="flex items-center space-x-3 justify-center mt-8 pt-4 border-t border-dark-border/10">
                  <div className="w-3 h-3 bg-accent-secondary rounded-full animate-pulse"></div>
                  <p className="text-text-secondary text-xs">
                    © {new Date().getFullYear()} Hi Miles LLC. {t('all_rights_reserved')}.
                  </p>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Основной компонент приложения с провайдером языка
const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App; 