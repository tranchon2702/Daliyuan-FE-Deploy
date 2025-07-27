import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartItem, getCartFromLocalStorage, getCartTotal, removeFromCart, updateCartItemQuantity } from "@/services/cartService";

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

const CartModal = () => {
  const { t, i18n } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(getCurrentUserId());

  // Xử lý đường dẫn ảnh
  const getImageUrl = (imagePath: string): string => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    
    if (!imagePath) {
      return '/placeholder.svg';
    }
    
    // Kiểm tra xem image đã là URL đầy đủ chưa
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Kiểm tra xem image có phải là base64 không
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // Nếu là đường dẫn tương đối, thêm backendUrl
    return `${backendUrl}${imagePath}`;
  };

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const uid = getCurrentUserId();
      setUserId(uid);
      const savedCart = getCartFromLocalStorage(uid);
      setCartItems(savedCart);
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    window.addEventListener('storage', loadCart);

    return () => {
      window.removeEventListener('cartUpdated', loadCart);
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  // Handle remove item
  const handleRemoveItem = (id: string) => {
    removeFromCart(id, userId);
    setCartItems(getCartFromLocalStorage(userId));
  };

  // Handle update quantity
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(id, newQuantity);
      setCartItems(getCartFromLocalStorage(userId));
    }
  };

  // Format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'VND';
  };

  // Calculate total
  const total = getCartTotal(cartItems);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('cart_modal.title')}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-[calc(100vh-10rem)]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('cart_page.empty.subtitle')}</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex py-4 border-b">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{i18n.language === 'zh' && item.nameZh ? item.nameZh : item.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">{i18n.language === 'zh' ? t(`product.unitTypes.${item.unitType}`) : item.unitType}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="h-7 w-7 p-0 rounded-full"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="h-7 w-7 p-0 rounded-full"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full h-7 w-7 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 py-4 mt-4">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>{t('cart_page.summary.subtotal')}</p>
                  <p>{formatPrice(total)}</p>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-col space-y-2">
                  <Link to="/checkout" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">{t('cart_modal.checkout_button')}</Button>
                  </Link>
                  <Link to="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">{t('cart_modal.view_cart_button')}</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;