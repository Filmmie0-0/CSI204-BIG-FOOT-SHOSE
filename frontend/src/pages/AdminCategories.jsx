import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Card, Table, Button, Spinner, Alert, Form, Modal } from 'react-bootstrap';
import { Edit2, Trash2, Plus } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuthStore();
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleShowModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentId(category._id);
      setName(category.name);
      setDescription(category.description || '');
    } else {
      setEditMode(false);
      setCurrentId('');
      setName('');
      setDescription('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      if (editMode) {
        await api.put(`/categories/${currentId}`, { name, description }, config);
      } else {
        await api.post('/categories', { name, description }, config);
      }
      
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.delete(`/categories/${id}`, config);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" />
      <div className="mt-3 text-muted fw-medium">Loading Categories...</div>
    </div>
  );

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        <Card.Header className="bg-white border-bottom px-4 py-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark">จัดการหมวดหมู่สินค้า</h5>
          <Button 
            variant="dark" 
            className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
            onClick={() => handleShowModal()}
          >
            <Plus size={18} /> เพิ่มหมวดหมู่ใหม่
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0 text-uppercase text-secondary fw-bold" style={{ fontSize: '0.75rem' }}>Name</th>
                  <th className="px-4 py-3 border-0 text-uppercase text-secondary fw-bold" style={{ fontSize: '0.75rem' }}>Description</th>
                  <th className="px-4 py-3 border-0 text-uppercase text-secondary fw-bold text-end" style={{ fontSize: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5 text-muted">
                      ยังไม่มีหมวดหมู่สินค้าในระบบ
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id}>
                      <td className="px-4 py-3 fw-bold text-dark">{cat.name}</td>
                      <td className="px-4 py-3 text-muted">{cat.description || '-'}</td>
                      <td className="px-4 py-3 text-end">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="me-2 rounded-circle shadow-sm"
                          onClick={() => handleShowModal(cat)}
                        >
                          <Edit2 size={16} className="text-primary" />
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="rounded-circle shadow-sm"
                          onClick={() => deleteHandler(cat._id)}
                        >
                          <Trash2 size={16} className="text-danger" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{editMode ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-secondary">ชื่อหมวดหมู่</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="shadow-none focus-ring rounded-3" 
                style={{ '--bs-focus-ring-color': 'rgba(255, 122, 89, 0.25)' }}
                placeholder="เช่น Running Shoes"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">รายละเอียด</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="shadow-none focus-ring rounded-3"
                style={{ '--bs-focus-ring-color': 'rgba(255, 122, 89, 0.25)' }}
              />
            </Form.Group>
            <Button type="submit" variant="dark" className="w-100 rounded-pill py-2 fw-bold">
              บันทึกข้อมูล
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminCategories;
