import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product }) => (
  <div className="overflow-hidden rounded shadow border border-gray-100 bg-white transition hover:shadow-lg">
    <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
      <p className="mb-2 text-xs text-gray-500">{product.region} | By {product.artisan}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
        <Link to={`/product/${product.id}`} className="rounded bg-themePrimary px-3 py-1 text-sm text-white hover:opacity-90">
          View
        </Link>
      </div>
    </div>
  </div>
);

export default ProductCard;
