"use client"
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';


interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
}


interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}


const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = (props: PropsWithChildren<{}>) => {
  const { children } = props; 
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: User = JSON.parse(atob(token.split('.')[1])); 
        setUser(decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUser(null); 
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };
