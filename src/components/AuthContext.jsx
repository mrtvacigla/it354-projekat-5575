import React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  async function login(email, password) {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    return user;
  }

  async function register(email, password, name) {
    const user = await authService.register(email, password, name);
    return user;
  }

  function logout() {
    authService.logout();
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}