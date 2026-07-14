import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image_url, setImageUrl] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState('');
  const [status, setStatus] = useState('active');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/admin');
      return;
    }

    if (id) {
      const fetchProduct = async () => {
        try {
          const { data } = await api.get(`/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setImageUrl(data.image_url);
          setSku(data.sku);
          setDescription(data.description);
          setSizes(data.sizes ? data.sizes.join(',') : '');
          setStatus(data.status);
        } catch (error) {
          console.error(error);
          alert('Error fetching product');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, userInfo, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`
        },
      };

      const { data } = await api.post('/upload', formData, config);
      setImageUrl(data.image_url);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Image upload failed');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const sizesArray = sizes ? sizes.split(',').map(s => s.trim()).filter(s => s !== '') : [];
      const productData = { name, price, image_url, sku, description, status, sizes: sizesArray };

      if (id) {
        await api.put(`/products/${id}`, productData, config);
        alert('Product updated successfully');
      } else {
        await api.post('/products', productData, config);
        alert('Product created successfully');
      }
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 uppercase">
        {id ? 'Edit Product' : 'Create Product'}
      </h1>
      <form onSubmit={submitHandler} className="space-y-6 bg-white p-8 border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (฿)</label>
          <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input type="text" value={image_url} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2 mb-2" placeholder="Image URL" />
          <input type="file" onChange={uploadFileHandler} className="mt-1 block w-full" />
          {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sizes (Comma separated, e.g. 39,40,41)</label>
          <input type="text" value={sizes} onChange={(e) => setSizes(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2" placeholder="38,39,40,41" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2" rows="4"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full border border-gray-300 p-2">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div>
          <button type="submit" className="w-full bg-black text-white py-3 font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors">
            {id ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
