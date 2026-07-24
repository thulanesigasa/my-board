'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, UserProfile, getRandomAvatarColor } from '@/lib/supabase/client';

export interface SignUpProfileData {
  firstName: string;
  surname: string;
  age: string;
  career: string;
  country: string;
  town: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, profileData: SignUpProfileData) => Promise<{ error?: string }>;
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
            const meta = session.user.user_metadata || {};
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: meta.name || `${meta.firstName || ''} ${meta.surname || ''}`.trim() || session.user.email?.split('@')[0] || 'User',
              avatarColor: meta.avatarColor || getRandomAvatarColor(session.user.id),
              firstName: meta.firstName,
              surname: meta.surname,
              age: meta.age,
              career: meta.career,
              country: meta.country,
              town: meta.town,
            });
          }
        } catch (err) {
          console.error('Error fetching Supabase session:', err);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const meta = session.user.user_metadata || {};
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: meta.name || `${meta.firstName || ''} ${meta.surname || ''}`.trim() || session.user.email?.split('@')[0] || 'User',
              avatarColor: meta.avatarColor || getRandomAvatarColor(session.user.id),
              firstName: meta.firstName,
              surname: meta.surname,
              age: meta.age,
              career: meta.career,
              country: meta.country,
              town: meta.town,
            });
          } else {
            setUser(null);
          }
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
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
        const meta = data.user.user_metadata || {};
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: meta.name || `${meta.firstName || ''} ${meta.surname || ''}`.trim() || data.user.email?.split('@')[0] || 'User',
          avatarColor: meta.avatarColor || getRandomAvatarColor(data.user.id),
          firstName: meta.firstName,
          surname: meta.surname,
          age: meta.age,
          career: meta.career,
          country: meta.country,
          town: meta.town,
        });
      }
      return {};
    } else {
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

  const signUp = async (email: string, password: string, profileData: SignUpProfileData) => {
    const avatarColor = getRandomAvatarColor(email);
    const fullName = `${profileData.firstName} ${profileData.surname}`.trim();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: fullName,
            avatarColor,
            firstName: profileData.firstName,
            surname: profileData.surname,
            age: profileData.age,
            career: profileData.career,
            country: profileData.country,
            town: profileData.town,
          },
        },
      });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: fullName,
          avatarColor,
          ...profileData,
        });
      }
      return {};
    } else {
      const mockUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        name: fullName,
        avatarColor,
        ...profileData,
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
