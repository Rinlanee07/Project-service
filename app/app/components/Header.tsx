import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-green-600 text-white p-4">
      <h1 className="text-2xl font-bold">My Application</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="hover:underline">Home</a>
          </li>
          <li>
            <a href="/dashboard" className="hover:underline">Dashboard</a>
          </li>
          <li>
            <a href="/register" className="hover:underline">Register</a>
          </li>
          <li>
            <a href="/signin" className="hover:underline">Sign In</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;