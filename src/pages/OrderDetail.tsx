import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mockOrder = {
  orderNumber: "DH77739530",
  orderDate: "10/7/2025",
  status: "processing",
  paymentMethod: "credit_card",
  total: 420000,
  products: [
    { id: 1, name: "Bánh Tiramisu", quantity: 1, price: 220000 },
    { id: 2, name: "Bánh Chocolate", quantity: 2, price: 100000 },
  ],
};

const statusMap: Record<string, string> = {
  processing: "order_detail.status.processing",
  delivered: "order_detail.status.delivered",
  cancelled: "order_detail.status.cancelled",
};

const paymentMethodMap: Record<string, string> = {
  credit_card: "order_detail.payment_method.credit_card",
  cod: "order_detail.payment_method.cod",
  bank_transfer: "order_detail.payment_method.bank_transfer",
};

const OrderDetail = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  // TODO: fetch order by orderId, dùng mockOrder tạm thời
  const order = { ...mockOrder, orderNumber: orderId };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-2xl font-bold mb-6 text-center">
            {t('order_detail.title')}
          </h1>
          <Card className="mb-8">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t('order_detail.order_number')}</span>
                <span className="font-bold text-dessert-primary">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t('order_detail.order_date')}</span>
                <span>{order.orderDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t('order_detail.status.label')}</span>
                <span>{t(statusMap[order.status] || order.status)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">{t('order_detail.payment_method.label')}</span>
                <span>{t(paymentMethodMap[order.paymentMethod] || order.paymentMethod)}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4">{t('order_detail.products')}</h2>
              <div className="divide-y">
                {order.products.map((item) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <span>{item.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                    <span>{item.price.toLocaleString()} ₫</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>{t('order_detail.total')}</span>
                <span>{order.total.toLocaleString()} ₫</span>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Link to="/orders">
              <Button variant="outline">{t('order_detail.back_to_orders')}</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail; 