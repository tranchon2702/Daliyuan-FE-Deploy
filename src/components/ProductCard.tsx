import { Heart } from "lucide-react";
import { useState } from "react";
import type { MouseEvent } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  onProductClick?: (id: string) => void;
  onModalOpen?: (product: any) => void;
  isLarge?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  onProductClick,
  onModalOpen,
  isLarge = false,
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleProductClick = () => {
    onProductClick?.(id);
  };
  
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onModalOpen?.({ id, name, price, image });
  };

  const handleWishlistClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group cursor-pointer relative flex flex-col h-full" onClick={handleProductClick}>
      <div className="overflow-hidden mb-3 flex-grow">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 overflow-hidden">
          <h3 className={`font-medium text-gray-600 group-hover:text-black transition-colors mb-1 pr-2 truncate ${isLarge ? 'text-sm' : 'text-xs'}`}>
            {name}
          </h3>
          <div className="relative h-5">
            <p className={`absolute inset-0 text-gray-700 font-semibold transition-opacity duration-300 group-hover:opacity-0 ${isLarge ? 'text-xs' : 'text-xs'}`}>
              {price}
            </p>
            <button
              onClick={handleModalClick}
              className={`absolute inset-0 w-full text-left font-semibold text-gray-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:text-red-500 ${isLarge ? 'text-xs' : 'text-xs'}`}
            >
              Show More
            </button>
          </div>
        </div>
        <button className="p-1" onClick={handleWishlistClick}>
          <Heart
            className={`h-5 w-5 transition-colors ${
              isWishlisted
                ? "text-red-500 fill-current"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;