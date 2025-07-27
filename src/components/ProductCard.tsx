import { Product } from '@/services/productService';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick: (id: string) => void;
  onModalOpen: (product: Product) => void;
  className?: string;
  isLarge?: boolean;
}

const ProductCard = ({ product, onProductClick, onModalOpen, className, isLarge = false }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  // Xác định URL ảnh
  const getImageUrl = () => {
    if (!product.mainImage) return '/placeholder.svg';
    
    // Xử lý base64
    if (product.mainImage.startsWith('data:')) return product.mainImage;
    
    // Xử lý URL đầy đủ
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    return product.mainImage.startsWith('http') 
      ? product.mainImage 
      : `${backendUrl}${product.mainImage}`;
  };

  return (
    <div 
      className={
        (isLarge
          ? "product-card bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-full"
          : "product-card bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full flex flex-col")
        + " group"
      }
      onClick={() => onProductClick(product._id)}
    >
      {/* Phần ảnh - chỉ phần này sẽ có hiệu ứng hover */}
      <div className="relative overflow-hidden cursor-pointer flex-grow flex items-center justify-center">
        <img
          src={getImageUrl()}
          alt={product.name}
          className="w-full max-w-full object-contain bg-gray-50 transition-transform duration-500 ease-out group-hover:scale-110"
          style={{ 
            height: isLarge ? '380px' : '180px',
            objectFit: 'contain',
            padding: '8px'
          }}
        />
        <div className="absolute top-2 right-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Logic to add to wishlist
            }}
            className="bg-white/70 rounded-full p-1.5 text-gray-500 hover:text-red-500 hover:bg-white"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Phần thông tin sản phẩm - không có hiệu ứng hover */}
      <div className="flex-shrink-0 p-1 bg-white w-full" style={{minHeight: isLarge ? '60px' : 'auto'}}>
        <h3 className="font-medium text-gray-800 truncate text-sm mt-1" title={product.name}>
          {product.name}
        </h3>
        <div className="mt-1 relative h-6">
          {/* Giá bình thường */}
          <span className="absolute left-0 top-0 transition-opacity duration-200 group-hover:opacity-0">
            <span className="text-sm font-bold text-red-600">
              {formatPrice(product.price)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-xs text-gray-400 line-through ml-2">
                {formatPrice(product.discountPrice)}
              </span>
            )}
          </span>
          {/* Nút Show more khi hover */}
          <button
            className="absolute left-0 top-0 text-orange-500 underline transition-opacity duration-200 opacity-0 group-hover:opacity-100 text-sm font-medium cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              onModalOpen(product);
            }}
          >
            Show more
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;