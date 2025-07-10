import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  text: string;
  rating: number;
  position: string;
}

const Testimonials: React.FC = () => {
  // Временно скрываем компонент
  const isHidden = true;
  
  // Если компонент скрыт, возвращаем null
  if (isHidden) {
    return null;
  }
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка отзывов из JSON файла
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/data/testimonials.json');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        setTestimonials(data.testimonials);
        setLoading(false);
      } catch (err) {
        setError('Error loading testimonials');
        setLoading(false);
        console.error('Error fetching testimonials:', err);
      }
    };

    fetchTestimonials();
  }, []);

  // Автоматическая смена отзывов
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials]);

  // Функция для отображения звездного рейтинга
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={`text-${i < rating ? 'accent-secondary' : 'dark-border'}`}>
          ★
        </span>
      ));
  };

  if (loading) {
    return (
      <section className="py-12 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-accent-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-accent-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-accent-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 relative">
        <div className="container mx-auto px-6 text-center">
          <p className="text-accent-primary">{error}</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-light text-center mb-6 sm:mb-8 md:mb-12 text-text-primary"
        >
          What Our Clients Say
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={testimonials[currentIndex].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-dark-secondary/20 backdrop-blur-md border border-dark-border/30 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-accent-secondary/50">
                    <img 
                      src={testimonials[currentIndex].avatar} 
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for missing images
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium text-text-primary">{testimonials[currentIndex].name}</h3>
                      <p className="text-sm text-text-secondary">{testimonials[currentIndex].position}</p>
                    </div>
                    <div className="text-lg mt-2 md:mt-0">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                  </div>
                  
                  <p className="text-text-secondary text-sm sm:text-base italic">"{testimonials[currentIndex].text}"</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Индикаторы */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-accent-secondary' : 'bg-dark-border/30'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
