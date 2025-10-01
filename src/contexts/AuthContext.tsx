import React, { createContext, useContext } from 'react';
import { useUser, useSignIn, useSignUp, useClerk } from '@clerk/clerk-react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signOut } = useClerk();

  const isLoading = !isLoaded || !signInLoaded || !signUpLoaded;

  // Transform Clerk user to our User interface
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    name: clerkUser.firstName || clerkUser.username || 'User'
  } : null;

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!signIn) return false;
    
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    if (!signUp) return false;

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
      });

      if (result.status === "complete") {
        return true;
      } else if (result.status === "missing_requirements") {
        // Handle email verification if required
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    signOut();
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    isSignedIn: !!isSignedIn
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};