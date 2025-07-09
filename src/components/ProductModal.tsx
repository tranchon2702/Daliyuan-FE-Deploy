import { X, ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    rating?: number;
    description?: string;
  };
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-white rounded-lg shadow-2xl border-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Info Column */}
          <div className="relative p-16 flex flex-col space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            

            <p className="text-4xl font-extrabold text-red-600">{product.price}</p>
            
            <p className="text-gray-600 leading-relaxed flex-grow">
              {product.description || t('product_modal.default_description')}
            </p>

            <div className="flex items-center space-x-3">
              <Button size="lg" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t('product_modal.add_to_cart_button')}
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 border-gray-300 rounded-md" onClick={() => setIsWishlisted(!isWishlisted)}>
                <Heart
                  className={`h-6 w-6 transition-colors ${
                    isWishlisted
                      ? "text-red-500 fill-current"
                      : "text-gray-600"
                  }`}
                />
              </Button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;