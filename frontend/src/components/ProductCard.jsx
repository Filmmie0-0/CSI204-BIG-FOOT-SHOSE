import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="text-decoration-none">
      <Card className="border-0 bg-transparent">
        <div className="bg-light rounded-4 overflow-hidden position-relative" style={{ aspectRatio: '1/1' }}>
          <Card.Img 
            variant="top" 
            src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'} 
            alt={product.name}
            className="w-100 h-100 object-fit-cover position-absolute top-0 start-0 hover-opacity-transition"
            style={{ transition: 'opacity 0.3s ease' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.75'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          />
        </div>
        <Card.Body className="px-0 pt-3 pb-0 d-flex justify-content-between align-items-start gap-3">
          <div>
            <Card.Title className="fs-6 fw-medium text-dark text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>
              {product.name}
            </Card.Title>
            <Card.Text className="text-muted small mb-0">
              {product.description?.substring(0, 35)}...
            </Card.Text>
          </div>
          <div className="fw-bold text-dark fs-6 whitespace-nowrap">
            ฿{product.price.toLocaleString()}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;