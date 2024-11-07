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
  decodeToken:  (token?: string) => User | null

}


const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = (props: PropsWithChildren<{}>) => {
  const { children } = props; 
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || ""
    decodeToken(token)
  }, []);
const decodeToken = (token?: string) => {
  if (token) {
    try {
      const decoded: User = JSON.parse(atob(token.split('.')[1])); 
      setUser(decoded);
      return decoded
    } catch (error) {
      console.error('Failed to decode token:', error);
      setUser(null); 
      return null
    }
  }
  return null
}

  return (
    <UserContext.Provider value={{ user, setUser, decodeToken }}>
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
