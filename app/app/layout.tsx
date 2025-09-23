import React from 'react';
import { SessionProvider } from '../components/SessionProvider';
import '../globals.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <header>
          {/* You can include your Header component here */}
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer>
          {/* You can include your Footer component here */}
        </footer>
      </div>
    </SessionProvider>
  );
};

export default Layout;