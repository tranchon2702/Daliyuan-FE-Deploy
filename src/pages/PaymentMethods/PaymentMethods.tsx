import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Banknote, CreditCard, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

const PaymentMethods = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('payment_methods_page.title')}
          </h1>
          <p className="text-gray-600">
            {t('payment_methods_page.subtitle')}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-red-600" />
                <span>{t('payment_methods_page.cod.title')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 leading-relaxed">
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    <li>
                        {t('payment_methods_page.cod.line1')}
                    </li>
                    <li>
                        {t('payment_methods_page.cod.line2')}
                    </li>
                    <li>
                        {t('payment_methods_page.cod.line3')}
                    </li>
                </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center space-x-3">
                <Banknote className="h-6 w-6 text-red-600" />
                <span>{t('payment_methods_page.bank_transfer.title')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 leading-relaxed space-y-2">
              <p>
                {t('payment_methods_page.bank_transfer.description')}
              </p>
              <ul className="list-disc list-inside bg-gray-50 p-4 rounded-md">
                <li>
                  <strong>{t('payment_methods_page.bank_transfer.bank')}</strong> Vietcombank
                </li>
                <li>
                  <strong>{t('payment_methods_page.bank_transfer.account_holder')}</strong> CTY TNHH THE 350F
                </li>
                <li>
                  <strong>{t('payment_methods_page.bank_transfer.account_number')}</strong> 1234567890
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-red-600" />
                <span>{t('payment_methods_page.vnpay.title')}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 leading-relaxed">
              {t('payment_methods_page.vnpay.description')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentMethods; 