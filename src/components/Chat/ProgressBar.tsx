import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  duration: number; // Длительность в миллисекундах
  isActive: boolean; // Активен ли индикатор
  onComplete?: () => void; // Колбэк по завершении
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  duration, 
  isActive, 
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }
    
    // Сбрасываем прогресс при активации
    setProgress(0);
    
    // Запускаем анимацию заполнения
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      
      setProgress(newProgress);
      
      if (newProgress >= 1) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [isActive, duration, onComplete]);
  
  return (
    <div className="w-full h-1 bg-dark-border/20 rounded-full overflow-hidden mt-2">
      <motion.div 
        className="h-full bg-accent-secondary/50"
        initial={{ width: 0 }}
        animate={{ 
          width: `${progress * 100}%`,
        }}
        transition={{ 
          duration: 0.3, 
          ease: "linear"
        }}
      />
    </div>
  );
};

export default ProgressBar;
