import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="text-decoration-none">
      <Card className="border-0 h-100 shadow-sm" style={{ borderRadius: '1.25rem', overflow: 'hidden', backgroundColor: '#fff', transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)' }} 
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)'; }}>
        <div className="bg-light position-relative" style={{ aspectRatio: '1/1' }}>
          <Card.Img 
            variant="top" 
            src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'} 
            alt={product.name}
            className="w-100 h-100 object-fit-cover"
          />
        </div>
        <Card.Body className="p-4 d-flex flex-column justify-content-between">
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <Card.Title className="fs-6 fw-black text-dark text-uppercase mb-0" style={{ letterSpacing: '0.5px', lineHeight: '1.2' }}>
              {product.name}
            </Card.Title>
            <div className="fw-black fs-6 whitespace-nowrap" style={{ color: '#ff5722' }}>
              ฿{product.price.toLocaleString()}
            </div>
          </div>
          <Card.Text className="text-secondary small mb-0 fw-medium" style={{ lineHeight: '1.5' }}>
            {product.description?.substring(0, 45)}...
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;