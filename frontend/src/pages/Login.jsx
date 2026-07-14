import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { userInfo, login } = useAuthStore();

  // เช็คตอนเปิดหน้าเว็บ ถ้าล็อกอินอยู่แล้วให้เด้งไปหน้าอื่น
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin' || userInfo.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/users/login', { email, password });
      login(data);
      
      // เช็ค Role หลังล็อกอินสำเร็จ
      if (data.role === 'admin' || data.role === 'staff') {
        navigate('/admin'); // ถ้าเป็นแอดมิน ไปหน้า Dashboard
      } else {
        navigate('/'); // ถ้าเป็นลูกค้า ไปหน้า Home
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/60 shadow-xl relative overflow-hidden">
        {/* แสงเอฟเฟกต์มุมกล่อง เพิ่มมิติ */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-black text-gray-900 uppercase tracking-tight relative inline-block">
            Sign In
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-900 rounded-full -mb-1"></span>
          </h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            Access your Big Foot Shoes account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          {/* กล่อง Error Message ดีไซน์ใหม่ */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 animate-shake">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all duration-200 bg-gray-50/50 focus:bg-white"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3.5 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all duration-200 bg-gray-50/50 focus:bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-black uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm border-t border-gray-100 pt-6">
          <p className="text-gray-500 font-medium">
            New customer?{' '}
            <Link to="/register" className="font-bold text-gray-900 hover:text-blue-600 transition-colors underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;