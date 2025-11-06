import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { fetchUserByEmail, createUser, UserProfile } from '../services/airtable'; // Import the Airtable functions

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('optical_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('optical_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Fetch user from Airtable by email
      const airtableUser = await fetchUserByEmail(email);
      
      if (!airtableUser) {
        throw new Error('User not found');
      }
      
      // Mock password check (for demo; in real app, use proper auth)
      if (password !== 'password') {
        throw new Error('Invalid password');
      }
      
      // Map Airtable data to your User type
      const loggedInUser: User = {
        id: airtableUser.id,
        email: airtableUser.email,
        name: airtableUser.fullName,
        phone: airtableUser.phoneNumber,
        isAdmin: airtableUser.isAdmin,
        createdAt: airtableUser.accountCreated,
      };
      
      setUser(loggedInUser);
      localStorage.setItem('optical_user', JSON.stringify(loggedInUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Check if user already exists in Airtable
      const existingUser = await fetchUserByEmail(email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      // Mock password validation (for demo; in real app, hash and store securely elsewhere)
      if (password !== 'password') {
        throw new Error('Invalid password setup');
      }
      
      // Create user in Airtable
      const newAirtableUser = await createUser({
        email,
        fullName: name,
        isAdmin: false, // New users are not admins by default
      });
      
      // Map to your User type
      const newUser: User = {
        id: newAirtableUser.id,
        email: newAirtableUser.email,
        name: newAirtableUser.fullName,
        phone: newAirtableUser.phoneNumber,
        isAdmin: newAirtableUser.isAdmin,
        createdAt: newAirtableUser.accountCreated,
      };
      
      setUser(newUser);
      localStorage.setItem('optical_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('optical_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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