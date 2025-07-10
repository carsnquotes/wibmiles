import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Partners.css';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
}

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/data/partners.json');
        if (!response.ok) {
          throw new Error('Failed to fetch partners');
        }
        const data = await response.json();
        setPartners(data.partners);
        setLoading(false);
      } catch (err) {
        setError('Error loading partners');
        setLoading(false);
        console.error('Error fetching partners:', err);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-8 relative">
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
      <section className="py-8 relative">
        <div className="container mx-auto px-6 text-center">
          <p className="text-accent-primary">{error}</p>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  // Дублируем партнеров для создания бесконечной прокрутки
  // Добавляем больше копий для больших экранов
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-12 relative overflow-hidden bg-dark-secondary/10 backdrop-blur-sm partners-scroll-section">
      <div className="container mx-auto px-6 mb-6">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-light text-center mb-2 text-text-primary"
        >
          Our Brands
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-text-secondary mb-8"
        >
          We work with the world's leading automotive brands - constantly expanding our lineup.
        </motion.p>
      </div>
      
      <div className="partners-scroll-container">
        <div className="partners-scroll">
          {duplicatedPartners.map((partner, index) => (
            <motion.div
              key={`${partner.id}-${index}`}
              className="partner-item"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="partner-logo-container">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="partner-logo"
                  onError={(e) => {
                    // Fallback for missing images
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=' + partner.name;
                  }}
                />
              </div>
              <span className="partner-name">{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
