import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="group relative block overflow-hidden">
      <div className="bg-gray-100 aspect-square w-full overflow-hidden group-hover:opacity-75 transition-opacity duration-300">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'} 
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-900 font-medium uppercase tracking-wide">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {product.description?.substring(0, 35)}...
          </p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          ฿{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;