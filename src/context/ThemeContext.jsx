import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('tl-theme');
    if (stored === 'light') {
      setIsDark(false);
      document.body.classList.add('light');
    }
  }, []);

  const toggle = () => {
    setIsDark((d) => {
      const next = !d;
      if (next) {
        document.body.classList.remove('light');
        localStorage.setItem('tl-theme', 'dark');
      } else {
        document.body.classList.add('light');
        localStorage.setItem('tl-theme', 'light');
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
