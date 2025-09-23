import React from 'react';

const ShippingPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        ข้อมูลการจัดส่ง
      </h2>
      <p className="text-center text-gray-500">
        ข้อมูลการจัดส่งสำหรับการซ่อมจะถูกแสดงที่นี่
      </p>
      {/* Additional shipping details can be added here */}
    </div>
  );
};

export default ShippingPage;