import "./globals.css"
import React from 'react';
import Providers from './Providers';
import Navbar from './components/Navbar';


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body   className='bg-gradient-to-bl from-slate-400 to-white'>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
