import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import {
  getCartFromLocalStorage,
  updateCartItemQuantity,
  removeFromCart,
  getCartTotal,
  getCartItemsCount,
  CartItem,
  dispatchCartUpdatedEvent
} from "@/services/cartService";

// Constants
const FREE_SHIPPING_THRESHOLD = 500000; // 500,000 VND
const SHIPPING_FEE = 30000; // 30,000 VND

const Cart = () => {
  const { t, i18n } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [userId, setUserId] = useState<string | undefined>(undefined);

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

  // Load cart from localStorage on component mount
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

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      const updatedCart = updateCartItemQuantity(id, newQuantity);
      setCartItems(updatedCart);
      dispatchCartUpdatedEvent();
    }
  };

  const handleRemoveItem = (id: string) => {
    const updatedCart = removeFromCart(id);
    setCartItems(updatedCart);
    dispatchCartUpdatedEvent();
  };

  const handleApplyPromoCode = () => {
    if (validatePromoCode(promoCode)) {
      setAppliedPromoCode(promoCode);
      setPromoCode("");
    } else {
      alert(t('cart_page.invalid_promo'));
    }
  };

  // Validate promo code
  const validatePromoCode = (code: string): boolean => {
    const validCodes = ['save10', 'save20', 'freeship'];
    return validCodes.includes(code.toLowerCase());
  };

  // Calculate discount based on promo code
  const calculateDiscount = (code: string, subtotal: number): number => {
    if (code.toLowerCase() === 'save10') {
      return Math.round(subtotal * 0.1);
    }
    if (code.toLowerCase() === 'save20') {
      return Math.round(subtotal * 0.2);
    }
    return 0;
  };

  // Calculate shipping fee
  const calculateShipping = (subtotal: number): number => {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  };

  // Format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'VND';
  };

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

  // Calculate order totals
  const subtotal = getCartTotal(cartItems);
  const shipping = calculateShipping(subtotal);
  const discount = calculateDiscount(appliedPromoCode, subtotal);
  const total = subtotal + shipping - discount;
  
  // Lấy số lượng sản phẩm trong giỏ hàng
  const itemCount = getCartItemsCount(cartItems);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-dessert-light rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-dessert-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-4">
              {t('cart_page.empty.title')}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t('cart_page.empty.subtitle')}
            </p>
            <Link to="/">
              <Button size="lg">
                {t('cart_page.empty.continue_shopping')}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/" className="text-dessert-primary hover:text-dessert-warm transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold">{t('cart_page.title')}</h1>
            <p className="text-muted-foreground">
              {itemCount} {itemCount > 1 ? t('cart_page.items') : t('cart_page.item')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-dessert-light flex-shrink-0">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {i18n.language === 'zh' && item.nameZh ? item.nameZh : item.name}
                    </h3>
                    <p className="text-dessert-primary font-semibold">
                      {formatPrice(item.price)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {i18n.language === 'zh' ? t(`product.unitTypes.${item.unitType}`) : item.unitType}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="h-8 w-8 p-0 rounded-full"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-0 flex-shrink-0">
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link to="/">
                <Button variant="outline" className="space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t('cart_page.continue_shopping')}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="font-serif text-xl font-bold mb-6">
                {t('cart_page.summary.title')}
              </h2>

              <Separator className="mb-6" />

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>{t('cart_page.summary.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart_page.summary.shipping')}</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('cart_page.summary.discount')}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('cart_page.summary.total')}</span>
                  <span className="text-dessert-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  {t('cart_page.summary.checkout_button')}
                </Button>
              </Link>


            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;