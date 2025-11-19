'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '@/utils/api';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (data: any) => Promise<{ error?: any }>;
  signOut: () => void;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { error: { message: data.message || 'Login failed' } };

      // Save token and user
      localStorage.setItem('access_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return { };
    } catch (err: any) {
      return { error: { message: err.message } };
    } finally {
      setLoading(false);
    }
  };

const signUp = async (data: any) => {
  try {
    setLoading(true);

    const res = await fetch(apiUrl('users'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const raw = await res.text();
    let parsed: any = null;

    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        parsed = null;
      }
    }

    if (!res.ok) {
      const message =
        parsed?.message ||
        (raw ? raw.replace(/^Server Error\s*/i, '').trim() : null) ||
        'Signup failed';
      return { error: { message } };
    }

    // auto login
    return await signIn(data.email, data.password);
  } catch (err: any) {
    return { error: { message: err.message } };
  } finally {
    setLoading(false);
  }
};




  const signOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
