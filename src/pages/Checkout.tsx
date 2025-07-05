import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Truck, Shield, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    postalCode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [saveInfo, setSaveInfo] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Mock cart data
  const cartItems = [
    {
      id: "1",
      name: "Black Forest Hộp Thiếc",
      price: 399600,
      quantity: 2,
      image: "/placeholder.svg"
    },
    {
      id: "2", 
      name: "Chocolate Dream Cake",
      price: 243000,
      quantity: 1,
      image: "/placeholder.svg"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 30000;
  const tax = Math.round(subtotal * 0.1); // 10% VAT
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đồng ý với điều khoản và điều kiện",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof typeof shippingInfo]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Đang xử lý đơn hàng...",
      description: "Chúng tôi đang xử lý thanh toán của bạn"
    });

    setTimeout(() => {
      navigate("/payment-success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/cart" className="text-dessert-primary hover:text-dessert-warm transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold">Thanh Toán</h1>
            <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Thông Tin Giao Hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Nhập email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Chọn tỉnh/thành phố"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện</Label>
                      <Input
                        id="district"
                        value={shippingInfo.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="Chọn quận/huyện"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã</Label>
                      <Input
                        id="ward"
                        value={shippingInfo.ward}
                        onChange={(e) => handleInputChange('ward', e.target.value)}
                        placeholder="Chọn phường/xã"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Phương Thức Thanh Toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Thẻ tín dụng/ghi nợ</p>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                            <div className="w-8 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="momo" id="momo" />
                      <Label htmlFor="momo" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Ví MoMo</p>
                            <p className="text-sm text-muted-foreground">Thanh toán qua ví điện tử MoMo</p>
                          </div>
                          <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xs">M</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                            <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng</p>
                          </div>
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="saveInfo" 
                        checked={saveInfo}
                        onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                      />
                      <Label htmlFor="saveInfo" className="text-sm">
                        Lưu thông tin này cho lần mua tiếp theo
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeTerms" 
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      />
                      <Label htmlFor="agreeTerms" className="text-sm">
                        Tôi đồng ý với{" "}
                        <Link to="/terms" className="text-dessert-primary hover:underline">
                          điều khoản và điều kiện
                        </Link>{" "}
                        và{" "}
                        <Link to="/privacy" className="text-dessert-primary hover:underline">
                          chính sách bảo mật
                        </Link>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Số lượng: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển:</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Thuế VAT (10%):</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-dessert-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-dessert-light/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Bảo mật SSL</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Thông tin của bạn được bảo vệ bằng mã hóa SSL 256-bit
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <Button type="submit" className="w-full" size="lg">
                    Đặt Hàng - {formatPrice(total)}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;