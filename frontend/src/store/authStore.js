import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  
  login: (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    set({ userInfo: data });
  },
  
  logout: () => {
    localStorage.removeItem('userInfo');
    set({ userInfo: null });
  },

  // --- เพิ่มฟังก์ชันใหม่: อัปเดตข้อมูลที่หน้าเว็บ ---
  updateUserInfo: (data) => {
    const currentData = JSON.parse(localStorage.getItem('userInfo'));
    // เอาข้อมูลเก่ามารวมกับข้อมูลใหม่ (เผื่อรักษาสถานะ Token เดิมไว้)
    const newData = { ...currentData, ...data }; 
    localStorage.setItem('userInfo', JSON.stringify(newData));
    set({ userInfo: newData });
  }
}));