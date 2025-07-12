import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Network delay simulation
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-secondary/20 backdrop-blur-md border border-dark-border/30 rounded-lg p-6 sm:p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-2">
              <span className="text-accent-secondary">Hi</span>
              <span className="text-white relative">
                <span className="relative z-10">MILES</span>
                <span className="absolute inset-0 bg-accent-secondary/10 blur-sm rounded-lg"></span>
              </span>
            </h1>
            <p className="text-text-secondary">Sign in to access the system</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-md text-sm"
              >
                {error}
              </motion.div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-dark-primary border border-dark-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-text-primary"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-primary border border-dark-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-text-primary"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 bg-accent-secondary text-white rounded-md transition-colors ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-accent-secondary/90'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
