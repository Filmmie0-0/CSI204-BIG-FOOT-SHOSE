import React from 'react';
import { useAuthStore } from '../store/authStore';

const AdminInfo = () => {
  const { userInfo } = useAuthStore();

  if (userInfo?.role !== 'admin') {
    return <div className="text-center py-20 text-red-500 font-bold text-xl">ไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Only)</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#ffcfc0] overflow-hidden">
      <div className="bg-[#ffcfc0] px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">ดูข้อมูลภาพรวม</h2>
      </div>
      
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg">หน้านี้ใช้สำหรับแสดงรายงาน หรือข้อมูลเชิงลึกอื่นๆ ตามที่ต้องการ</p>
      </div>
    </div>
  );
};

export default AdminInfo;
