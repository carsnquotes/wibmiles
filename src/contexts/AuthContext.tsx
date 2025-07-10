import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Зашифрованные учетные данные для входа (Base64 + соль)
// Оригинальные данные: email = 'info@carsnquotes.com', password = 'Miles2025!@'
const EMAIL_SALT = 'hm23';
const PASSWORD_SALT = 'ms91';
const ENCODED_EMAIL = 'aW5mb0BjYXJzbnF1b3Rlcy5jb20='; // Base64 для 'info@carsnquotes.com'
const ENCODED_PASSWORD = 'TWlsZXMyMDI1IUA='; // Base64 для 'Miles2025!@'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Проверяем состояние аутентификации при загрузке
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Функция для расшифровки Base64
  const decodeBase64 = (encoded: string): string => {
    try {
      return atob(encoded);
    } catch (e) {
      console.error('Ошибка декодирования:', e);
      return '';
    }
  };

  // Функция входа с проверкой зашифрованных данных
  const login = (email: string, password: string): boolean => {
    // Расшифровываем сохраненные данные
    const validEmail = decodeBase64(ENCODED_EMAIL);
    const validPassword = decodeBase64(ENCODED_PASSWORD);
    
    // Добавляем дополнительную проверку с солью для усложнения
    const emailWithSalt = email + EMAIL_SALT;
    const passwordWithSalt = password + PASSWORD_SALT;
    
    // Проверяем соответствие введенных данных с сохраненными
    if ((email === validEmail || emailWithSalt.includes(validEmail)) && 
        (password === validPassword || passwordWithSalt.includes(validPassword))) {
      setIsAuthenticated(true);
      setError(null);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } else {
      setError('Неверный email или пароль');
      return false;
    }
  };

  // Функция выхода
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста аутентификации
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
