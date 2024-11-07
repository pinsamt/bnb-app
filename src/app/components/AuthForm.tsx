"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';



const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(''); 
  const router = useRouter();


  const {decodeToken} = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 

    const response = await fetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: isLogin ? undefined : name }),
    });

    const data = await response.json();
    if (response.ok) {
      if (isLogin) {
        localStorage.setItem('token', data.token);
      }
      decodeToken(data.token)
      router.push('/');
    } else {
      setError(data.error || 'Invalid credentials, please try again');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">{isLogin ? 'Login' : 'Register'}</h2>

        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}

        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
            />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 text-gray-600 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
        
        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)} 
          className="w-full mt-4 bg-gray-200 text-gray-700 font-semibold py-2 rounded hover:bg-gray-300 transition duration-200"
        >
          Switch to {isLogin ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
