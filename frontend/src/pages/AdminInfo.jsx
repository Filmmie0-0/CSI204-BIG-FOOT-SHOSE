import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, Alert } from 'react-bootstrap';

const AdminInfo = () => {
  const { userInfo } = useAuthStore();

  if (userInfo?.role !== 'admin') {
    return (
      <div className="text-center py-5">
        <Alert variant="danger" className="fw-bold fs-5 shadow-sm border-0 rounded-4">ไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Only)</Alert>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
      <Card.Header className="bg-white border-bottom px-4 py-4">
        <h5 className="mb-0 fw-bold text-dark">ดูข้อมูลภาพรวม</h5>
      </Card.Header>
      
      <Card.Body className="p-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
          <span className="fs-1">🛠️</span>
        </div>
        <h4 className="fw-bold text-dark mb-2">Work in Progress</h4>
        <p className="fs-6 text-muted mb-0 max-w-md mx-auto">หน้านี้ใช้สำหรับแสดงรายงาน หรือข้อมูลเชิงลึกอื่นๆ ตามที่ต้องการ สามารถเพิ่มเติมกราฟและสถิติได้ในอนาคต</p>
      </Card.Body>
    </Card>
  );
};

export default AdminInfo;
