import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- เพิ่ม State สำหรับเก็บไซส์ที่เลือก ---
  const [selectedSize, setSelectedSize] = useState('');
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        // กำหนดให้เลือกไซส์แรกเป็นค่าเริ่มต้น
        if (data.variants && data.variants.length > 0) {
          setSelectedSize(data.variants[0].variantValue);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('กรุณาเลือกไซส์ก่อนเพิ่มลงตะกร้า');
      return;
    }
    // ส่งไซส์ที่เลือกไปด้วย
    addToCart(product, selectedSize);
    navigate('/cart'); 
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:space-x-8 lg:space-x-12">
        <div className="md:w-1/2">
          <img src={product.images?.[0]} alt={product.name} className="w-full h-auto object-cover bg-gray-100" />
        </div>
        
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">{product.name}</h1>
          <p className="mt-4 text-2xl text-gray-900 font-medium">฿{product.price?.toLocaleString()}</p>
          
          <div className="mt-6">
            <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* --- UI สำหรับเลือกไซส์ --- */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 uppercase">Size (EU)</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.variantValue}
                    onClick={() => setSelectedSize(variant.variantValue)}
                    className={`border rounded-sm py-2 px-4 text-sm font-medium transition-colors ${
                      selectedSize === variant.variantValue
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-900 hover:border-black'
                    }`}
                  >
                    {variant.variantValue}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-10">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black border border-transparent rounded-sm px-8 py-4 flex items-center justify-center text-base font-medium text-white hover:bg-gray-800 transition-colors uppercase tracking-widest"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;