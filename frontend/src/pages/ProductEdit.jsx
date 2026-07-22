import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Form, Button, Card, Spinner, Container } from 'react-bootstrap';

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
  const [countInStock, setCountInStock] = useState(10);
  const [status, setStatus] = useState('active');
  const [gender, setGender] = useState('Unisex');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'staff')) {
      navigate('/admin');
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Fetch categories first
        const catRes = await api.get('/categories');
        setCategories(catRes.data);

        // Fetch product if editing
        if (id) {
          const { data } = await api.get(`/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setImageUrl(data.image_url);
          setSku(data.sku);
          setDescription(data.description);
          setSizes(data.sizes ? data.sizes.join(',') : '');
          setCountInStock(data.countInStock !== undefined ? data.countInStock : 10);
          setStatus(data.status);
          if (data.gender) setGender(data.gender);
          if (data.category_id) setCategoryId(data.category_id);
        }
      } catch (error) {
        console.error(error);
        alert('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
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
      const productData = { 
        name, 
        price, 
        image_url, 
        sku, 
        description, 
        status, 
        countInStock: Number(countInStock), 
        sizes: sizesArray, 
        gender,
        category_id: categoryId || null 
      };

      if (id) {
        await api.put(`/products/${id}`, productData, config);
        alert('Product updated successfully');
      } else {
        await api.post('/products', productData, config);
        alert('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="secondary" />
    </div>
  );

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <h2 className="fs-3 fw-bold mb-4 text-uppercase text-dark">
        {id ? 'Edit Product' : 'Create Product'}
      </h2>
      
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4 p-md-5">
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Name</Form.Label>
              <Form.Control type="text" required value={name} onChange={(e) => setName(e.target.value)} className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Price (฿)</Form.Label>
              <Form.Control type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">SKU</Form.Label>
              <Form.Control type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Image</Form.Label>
              <Form.Control type="text" value={image_url} onChange={(e) => setImageUrl(e.target.value)} className="mb-2 shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} placeholder="Image URL" />
              <Form.Control type="file" onChange={uploadFileHandler} className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} />
              {uploading && <Form.Text className="text-muted mt-2 d-block">Uploading...</Form.Text>}
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Sizes (Comma separated, e.g. 39,40,41)</Form.Label>
              <Form.Control type="text" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="38,39,40,41" className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Gender</Form.Label>
              <Form.Select value={gender} onChange={(e) => setGender(e.target.value)} className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }}>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Unisex">Unisex</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Category</Form.Label>
              <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }}>
                <option value="">-- No Category --</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Description</Form.Label>
              <Form.Control as="textarea" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Count In Stock</Form.Label>
              <Form.Control type="number" required value={countInStock} onChange={(e) => setCountInStock(e.target.value)} min="0" className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Status</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </Form.Select>
            </Form.Group>
            
            <div className="pt-2">
              <Button type="submit" variant="dark" className="w-100 py-3 text-uppercase fw-bold rounded-1 border-0" style={{ letterSpacing: '1px' }}>
                {id ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductEdit;
