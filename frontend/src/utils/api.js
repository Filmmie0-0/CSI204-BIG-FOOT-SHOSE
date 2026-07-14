import axios from 'axios';

// ตั้งค่า Base URL ให้ชี้ไปที่ Backend ของเรา
const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// เพิ่ม Request Interceptor เพื่อดึง Token จาก localStorage มาใส่ใน Header อัตโนมัติ
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;