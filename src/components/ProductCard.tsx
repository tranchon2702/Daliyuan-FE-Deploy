import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  hoverImage?: string;
  isWishlisted?: boolean;
  onModalOpen?: (product: any) => void;
  onProductClick?: (id: string) => void;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  hoverImage, 
  isWishlisted = false,
  onModalOpen,
  onProductClick
}: ProductCardProps) => {
  const product = { id, name, price, image, category: "Bánh Hộp Thiếc" };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onModalOpen?.(product);
  };

  const handleProductClick = () => {
    onProductClick?.(id);
  };

  return (
    <div className="group cursor-pointer animate-fade-in" onClick={handleProductClick}>
      {/* Circular Product Container */}
      <div className="relative w-full aspect-square rounded-full overflow-hidden bg-gradient-to-br from-dessert-cream to-dessert-secondary shadow-card hover:shadow-hover transition-all duration-500 hover:scale-105 border-4 border-dessert-secondary/30 hover:border-dessert-accent/40">
        {/* Product Image */}
        <div className="absolute inset-4 rounded-full overflow-hidden bg-white">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500"
            />
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-elegant rounded-full backdrop-blur-sm hover:scale-110 transition-all duration-300 z-10"
        >
          <Heart 
            className={`h-4 w-4 transition-colors duration-300 ${
              isWishlisted ? "fill-dessert-accent text-dessert-accent" : "text-dessert-primary/60 hover:text-dessert-accent hover:fill-dessert-accent"
            }`} 
          />
        </Button>

        {/* Hover Overlay with Load More */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-full">
          <Button 
            onClick={handleModalClick}
            className="bg-accent-gradient text-white px-6 py-2 rounded-full font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105 text-sm"
          >
            Load More
          </Button>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-full"></div>
        </div>
      </div>

      {/* Product Info Below */}
      <div className="text-center mt-4 px-2">
        <h3 className="font-semibold text-sm text-dessert-primary mb-2 line-clamp-2 leading-relaxed group-hover:text-dessert-dark transition-colors duration-300">
          {name}
        </h3>
        
        {/* Price that changes to "Load More" on hover */}
        <div className="relative overflow-hidden h-6">
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
            <span className="text-lg font-bold bg-accent-gradient bg-clip-text text-transparent">
              {price}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
            <span className="text-sm font-semibold text-dessert-accent">
              Xem chi tiết →
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-1 mt-2">
          <span className="text-xs text-dessert-primary/60">⭐</span>
          <span className="text-xs text-dessert-primary/60 font-medium">4.8</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;