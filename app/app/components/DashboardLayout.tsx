import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <header>
        {/* You can include the Header component here */}
      </header>
      <aside>
        {/* You can include the Sidebar component here */}
      </aside>
      <main>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;