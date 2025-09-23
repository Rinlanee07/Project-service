import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      {/* Additional dashboard content can be added here */}
    </DashboardLayout>
  );
};

export default DashboardPage;