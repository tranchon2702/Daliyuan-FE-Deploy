import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Download } from "lucide-react";

const PaymentSuccess = () => {
  useEffect(() => {
    // Clear cart items from localStorage (if using localStorage for cart)
    // localStorage.removeItem('cartItems');
  }, []);

  const orderNumber = "DH" + Math.random().toString().substr(2, 8);
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="font-serif text-3xl font-bold mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-muted-foreground mb-8">
            Cảm ơn bạn đã mua hàng tại The350F. Đơn hàng của bạn đã được xác nhận và sẽ được xử lý trong thời gian sớm nhất.
          </p>

          {/* Order Details Card */}
          <Card className="text-left mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Mã đơn hàng:</span>
                  <span className="font-bold text-dessert-primary">#{orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ngày đặt hàng:</span>
                  <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dự kiến giao hàng:</span>
                  <span>{estimatedDelivery}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Phương thức thanh toán:</span>
                  <span>Thẻ tín dụng</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-card rounded-lg border">
              <Package className="h-8 w-8 text-dessert-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Chuẩn bị hàng</h3>
              <p className="text-sm text-muted-foreground">Đơn hàng đang được chuẩn bị</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <Truck className="h-8 w-8 text-dessert-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Vận chuyển</h3>
              <p className="text-sm text-muted-foreground">Giao hàng trong 2-3 ngày</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <Download className="h-8 w-8 text-dessert-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">Hóa đơn</h3>
              <p className="text-sm text-muted-foreground">Gửi qua email</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Link to="/orders">
              <Button size="lg">
                Xem đơn hàng
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-dessert-light/30 rounded-lg">
            <h3 className="font-medium mb-2">Cần hỗ trợ?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span>📞 Hotline: 1900-1234</span>
              <span className="hidden sm:inline">|</span>
              <span>📧 Email: support@the350f.com</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;