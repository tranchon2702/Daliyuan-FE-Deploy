import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { addToCart } from "@/services/cartService";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Product } from "@/services/productService";

interface UnitOption {
  unitType: string;
  price: number;
  stock: number;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedUnitType, setSelectedUnitType] = useState<string>("");
  const { t, i18n } = useTranslation();
  
  // Đặt đơn vị mặc định khi sản phẩm thay đổi
  useEffect(() => {
    if (product && product.unitOptions && product.unitOptions.length > 0) {
      setSelectedUnitType(product.unitOptions[0].unitType);
      setQuantity(1); // Reset quantity when product changes
    }
  }, [product]);
  
  if (!isOpen || !product) return null;

  // Hiển thị tên và mô tả theo ngôn ngữ hiện tại
  const displayName = i18n.language === 'zh' && product.nameZh ? product.nameZh : product.name;
  const displayDescription = i18n.language === 'zh' && product.descriptionZh 
    ? product.descriptionZh 
    : (product.description || t('product_modal.default_description'));

  // Lấy giá của đơn vị đã chọn
  const getSelectedPrice = (): number => {
    const selectedOption = product.unitOptions?.find(option => option.unitType === selectedUnitType);
    return selectedOption ? selectedOption.price : product.price;
  };

  // Tính tổng giá tiền dựa trên số lượng
  const getTotalPrice = (): number => {
    return getSelectedPrice() * quantity;
  };

  // Format giá tiền
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'VND';
  };

  // Xử lý đường dẫn ảnh ưu tiên mediumWebp
  const getImageUrl = (): string => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    // Ưu tiên mediumWebp nếu có
    if (product.imageVariants && product.imageVariants.length > 0) {
      const medium = product.imageVariants[0].mediumWebp;
      if (medium) return `${backendUrl}${medium}`;
    }
    if (!product.mainImage) {
      return '/placeholder.svg';
    }
    if (product.mainImage.startsWith('http://') || product.mainImage.startsWith('https://')) {
      return product.mainImage;
    }
    if (product.mainImage.startsWith('data:image')) {
      return product.mainImage;
    }
    return `${backendUrl}${product.mainImage}`;
  };

  const getCurrentUserId = () => {
    const user = localStorage.getItem("userData");
    if (!user) return undefined;
    try {
      const parsed = JSON.parse(user);
      return parsed._id || undefined;
    } catch {
      return undefined;
    }
  };

  const handleAddToCart = () => {
    if (!selectedUnitType) {
      toast({
        title: t('product_modal.select_unit_type'),
        description: t('product_modal.please_select_unit_type'),
        variant: "destructive"
      });
      return;
    }
    const userId = getCurrentUserId();
    addToCart(product, quantity, selectedUnitType, userId);
    toast({
      title: t('product_modal.added_to_cart'),
      description: t('product_modal.added_to_cart_description', { name: displayName, quantity }),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-white rounded-lg shadow-2xl border-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="flex items-center justify-center bg-white p-4">
            <img
              src={getImageUrl()}
              alt={displayName}
              className="object-contain w-full h-auto max-h-[400px] mx-auto bg-gray-50 rounded-lg"
            />
          </div>

          {/* Info Column */}
          <div className="relative p-8 md:p-16 flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{displayName}</h2>
            
            <p className="text-4xl font-extrabold text-red-600">
              {formatPrice(getTotalPrice())}
            </p>
            
            <p className="text-gray-600 leading-relaxed flex-grow">
              {displayDescription}
            </p>

            {/* Đơn vị tính */}
            {product.unitOptions && product.unitOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">
                  {t('product_modal.unit_type')}:
                </h3>
                <RadioGroup 
                  value={selectedUnitType} 
                  onValueChange={setSelectedUnitType}
                  className="flex flex-wrap gap-3"
                >
                  {product.unitOptions.map((option: UnitOption) => (
                    <div key={option.unitType} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.unitType} 
                        id={`unit-${option.unitType}`} 
                        className="text-red-600"
                      />
                      <Label 
                        htmlFor={`unit-${option.unitType}`}
                        className="cursor-pointer text-sm"
                      >
                        {i18n.language === 'zh' ? t(`product.unitTypes.${option.unitType}`) : option.unitType} ({formatPrice(option.price)})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-4">
              <label htmlFor="quantity" className="text-sm font-medium">
                {t('product_modal.quantity')}:
              </label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-md"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <div className="h-8 px-3 flex items-center justify-center border-y border-input">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-md"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                size="lg" 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t('product_modal.add_to_cart_button')}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 border-gray-300 rounded-md" 
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
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