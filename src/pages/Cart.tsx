import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import chocolateCakeImg from "@/assets/chocolate-cake.jpg";
import blackForestImg from "@/assets/black-forest.jpg";
import tiramisuImg from "@/assets/tiramisu.jpg";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Black Forest Hộp Thiếc",
      price: 399600,
      quantity: 2,
      image: blackForestImg,
    },
    {
      id: "2",
      name: "Chocolate Dream Cake",
      price: 243000,
      quantity: 1,
      image: chocolateCakeImg,
    },
    {
      id: "3",
      name: "Tiramisu Classic",
      price: 156000,
      quantity: 3,
      image: tiramisuImg,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'VND';
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 30000; // 30,000 VND shipping fee
  const discount = 0; // No discount for now
  const total = subtotal + shipping - discount;

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
              Giỏ hàng trống
            </h1>
            <p className="text-muted-foreground mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <Link to="/">
              <Button size="lg">
                Tiếp tục mua sắm
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
            <h1 className="font-serif text-3xl font-bold">Giỏ hàng</h1>
            <p className="text-muted-foreground">
              {cartItems.length} sản phẩm trong giỏ hàng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-dessert-light flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-dessert-primary font-semibold">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
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
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
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
                  <span>Tiếp tục mua sắm</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="font-serif text-xl font-bold mb-6">
                Tóm tắt đơn hàng
              </h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Mã giảm giá
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline">
                    Áp dụng
                  </Button>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-dessert-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-dessert-light/30 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">Miễn phí vận chuyển</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Đơn hàng từ 500,000 VND được miễn phí vận chuyển
                </p>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  Tiến hành thanh toán
                </Button>
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Chúng tôi chấp nhận
                </p>
                <div className="flex justify-center space-x-2">
                  {["visa", "mastercard", "momo", "zalopay"].map((method) => (
                    <div
                      key={method}
                      className="w-8 h-6 bg-muted rounded flex items-center justify-center"
                    >
                      <span className="text-xs font-bold uppercase">
                        {method.slice(0, 2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;