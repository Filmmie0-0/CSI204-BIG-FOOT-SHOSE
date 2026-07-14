import axios from 'axios';

// ตั้งค่า Base URL ให้ชี้ไปที่ Backend ของเรา
const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;