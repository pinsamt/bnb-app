"use client";
import React from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';

const Navbar: React.FC = () => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    console.log(user)
    localStorage.removeItem('token');
    setUser(null); 
  };

console.log(user)
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          BnB Site
        </Link>
        <div className="flex space-x-4">
          <Link href="/properties" className="text-gray-300 hover:text-white">
            Properties
          </Link>
          <Link href="/bookings" className="text-gray-300 hover:text-white">
            Bookings
          </Link>

          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-gray-300 hover:text-white">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
