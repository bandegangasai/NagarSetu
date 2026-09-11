import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS, getStoredUser, setStoredUser } from '../services/authService';

interface AuthContextType {
  currentUser: UserProfile;
  role: UserRole;
  isCitizen: boolean;
  isOfficer: boolean;
  isAdmin: boolean;
  demoUsers: UserProfile[];
  switchDemoUser: (userId: string) => void;
  updateLanguagePreference: (lang: 'en' | 'te' | 'hi') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return getStoredUser() || DEMO_USERS[0];
  });

  useEffect(() => {
    setStoredUser(currentUser);
  }, [currentUser]);

  const switchDemoUser = (userId: string) => {
    const target = DEMO_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const updateLanguagePreference = (lang: 'en' | 'te' | 'hi') => {
    setCurrentUser((prev) => ({ ...prev, language: lang }));
  };

  const logout = () => {
    setCurrentUser(DEMO_USERS[0]);
  };

  const isCitizen = currentUser.role === 'citizen';
  const isOfficer = currentUser.role === 'officer' || currentUser.role === 'supervisor';
  const isAdmin = currentUser.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        isCitizen,
        isOfficer,
        isAdmin,
        demoUsers: DEMO_USERS,
        switchDemoUser,
        updateLanguagePreference,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
