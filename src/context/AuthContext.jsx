import { createContext, useState, useContext, useEffect } from 'react';
import { getSessionUser, setSessionUser } from '../services/platformStore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const existingSession = getSessionUser();
    if (existingSession) {
      setUser(existingSession);
    }
  }, []);

  const login = (sessionUser) => {
    setUser(sessionUser);
    setSessionUser(sessionUser);
  };

  const logout = () => {
    setUser(null);
    setSessionUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
