import React from 'react';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Navigation</h2>
      <ul className="sidebar-menu">
        <li onClick={() => handleNavigation('/dashboard')} className="sidebar-item">Dashboard</li>
        <li onClick={() => handleNavigation('/repairs')} className="sidebar-item">Repairs</li>
        <li onClick={() => handleNavigation('/profile')} className="sidebar-item">Profile</li>
        <li onClick={() => handleNavigation('/register')} className="sidebar-item">Register</li>
      </ul>
    </div>
  );
};

export default Sidebar;