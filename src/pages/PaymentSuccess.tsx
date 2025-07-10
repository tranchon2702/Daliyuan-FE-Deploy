import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Download } from "lucide-react";

const PaymentSuccess = () => {
  const { t } = useTranslation();
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
            {t('payment_success_page.title')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t('payment_success_page.subtitle')}
          </p>

          {/* Order Details Card */}
          <Card className="text-left mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('payment_success_page.order_details.order_number')}</span>
                  <span className="font-bold text-dessert-primary">#{orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('payment_success_page.order_details.order_date')}</span>
                  <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('payment_success_page.order_details.estimated_delivery')}</span>
                  <span>{estimatedDelivery}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('payment_success_page.order_details.payment_method')}</span>
                  <span>{t('payment_success_page.order_details.payment_method_value')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-card rounded-lg border">
              <Package className="h-8 w-8 text-dessert-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">{t('payment_success_page.next_steps.preparing.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('payment_success_page.next_steps.preparing.description')}</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <Truck className="h-8 w-8 text-dessert-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">{t('payment_success_page.next_steps.shipping.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('payment_success_page.next_steps.shipping.description')}</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <Download className="h-8 w-8 text-dessert-primary mx-auto mb-2" />
              <h3 className="font-medium mb-1">{t('payment_success_page.next_steps.invoice.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('payment_success_page.next_steps.invoice.description')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                {t('payment_success_page.buttons.continue_shopping')}
              </Button>
            </Link>
            <Link to={`/orders/${orderNumber}`}>
              <Button size="lg">
                {t('payment_success_page.buttons.view_order')}
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 p-6 bg-dessert-light/30 rounded-lg">
            <h3 className="font-medium mb-2">{t('payment_success_page.support.title')}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t('payment_success_page.support.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span>{t('payment_success_page.support.hotline')}</span>
              <span className="hidden sm:inline">|</span>
              <span>{t('payment_success_page.support.email')}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;