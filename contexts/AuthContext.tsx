import { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  
  const signIn = async (email: string, password: string) => {
    // Mock authentication
    // In a real app, this would make an API call to authenticate the user
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful authentication
      setUser({
        id: '1',
        name: 'John Doe',
        email: email,
        isPremium: false,
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    // Mock registration
    // In a real app, this would make an API call to register a new user
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      setUser({
        id: '2',
        name: name,
        email: email,
        isPremium: false,
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };
  
  const signOut = () => {
    // Mock sign out
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}