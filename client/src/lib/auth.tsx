import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  shopId?: string;
  shop?: any;
  beneficiary?: any;
  assignedShop?: any;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('pds_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('pds_user', JSON.stringify(userData));
    
    // Redirect based on role
    switch (userData.role) {
      case 'shop':
        setLocation('/shop');
        break;
      case 'beneficiary':
        setLocation('/beneficiary');
        break;
      case 'admin':
        setLocation('/admin');
        break;
      default:
        setLocation('/login');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pds_user');
    setLocation('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
