import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-8 py-16 sm:px-16 sm:py-24 shadow-2xl">
        {/* ตกแต่งแสงเบลอด้านหลัง */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-white/10 text-blue-400 px-3 py-1 rounded-full backdrop-blur-sm">
            New Collection 2026
          </span>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl uppercase leading-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Find your <br className="sm:hidden" /> perfect match.
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            Explore our latest collection of premium footwear designed for comfort and style.
          </p>
          <div className="pt-4">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-100 shadow-sm transition-all duration-200 transform hover:-translate-y-0.5">
              Shop New Arrivals
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-10 border-b border-gray-100 pb-5">
          <div>
            
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mt-1 relative inline-block">
              New Arrivals
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gray-900 rounded-full -mb-1"></span>
            </h2>
          </div>
          <p className="text-sm text-gray-500 font-medium">{products.length} Products Found</p>
        </div>
        
        {/* Loading State ด้วย Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse space-y-4">
                <div className="aspect-square w-full bg-gray-200 rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State กรณีไม่มีข้อมูล หรือต่อ Backend ไม่ติด */
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-gray-900">No products available</h3>
            <p className="mt-2 text-sm text-gray-500">Please make sure your database server is connected.</p>
          </div>
        ) : (
          /* Product Grid ที่ได้ข้อมูลมาแล้ว */
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product._id} className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg rounded-2xl">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;