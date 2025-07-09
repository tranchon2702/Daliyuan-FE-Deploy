import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Mock cart data - in real app this would come from context/state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Bánh Chocolate Tiramisu",
      price: 120000,
      quantity: 1,
      image: "/placeholder.svg"
    },
    {
      id: "2", 
      name: "Bánh Black Forest",
      price: 150000,
      quantity: 2,
      image: "/placeholder.svg"
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items => 
        items.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('cart_modal.title')} ({totalItems})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('cart_modal.empty_cart')}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('cart_modal.start_shopping')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-card rounded-lg border">
                    <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(item.price)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary & Checkout */}
          {cartItems.length > 0 && (
            <>
              <Separator />
              <SheetFooter className="flex-col space-y-4 pt-4">
              <div className="bg-white rounded-xl shadow p-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">{t('cart_modal.total')}</span>
                  <span className="font-bold text-lg">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    {t('cart_modal.checkout_button')}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleViewCart}>
                    {t('cart_modal.view_cart_button')}
                  </Button>
                </div>
              </div>
            </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartModal;