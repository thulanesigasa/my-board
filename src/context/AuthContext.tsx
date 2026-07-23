'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, UserProfile, getRandomAvatarColor } from '@/lib/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  demoLogin: (name?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'my_board_local_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              avatarColor: session.user.user_metadata?.avatarColor || getRandomAvatarColor(session.user.id),
            });
          }
        } catch (err) {
          console.error('Error fetching Supabase session:', err);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              avatarColor: session.user.user_metadata?.avatarColor || getRandomAvatarColor(session.user.id),
            });
          } else {
            setUser(null);
          }
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Fallback to localStorage stored session for local development
        const savedUser = localStorage.getItem(LOCAL_USER_KEY);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem(LOCAL_USER_KEY);
          }
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          avatarColor: data.user.user_metadata?.avatarColor || getRandomAvatarColor(data.user.id),
        });
      }
      return {};
    } else {
      // Local fallback auth
      const mockUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        name: email.split('@')[0] || 'Whiteboard Creator',
        avatarColor: getRandomAvatarColor(email),
      };
      setUser(mockUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
      return {};
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    const avatarColor = getRandomAvatarColor(email);
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, avatarColor },
        },
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name,
          avatarColor,
        });
      }
      return {};
    } else {
      const mockUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        name,
        avatarColor,
      };
      setUser(mockUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
      return {};
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const demoLogin = (name = 'Guest Artist') => {
    const mockUser: UserProfile = {
      id: `guest_${Math.random().toString(36).substring(2, 9)}`,
      email: 'guest@myboard.dev',
      name,
      avatarColor: getRandomAvatarColor(name),
    };
    setUser(mockUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
