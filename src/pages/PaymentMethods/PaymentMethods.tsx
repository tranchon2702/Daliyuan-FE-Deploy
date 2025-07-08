import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Banknote, CreditCard, Truck } from "lucide-react";

const PaymentMethods = () => {
  return (
    <div className="bg-white">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hình Thức Thanh Toán
          </h1>
          <p className="text-gray-600">
            Chúng tôi hỗ trợ nhiều phương thức thanh toán linh hoạt và an toàn.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-red-600" />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 leading-relaxed">
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    <li>
                        Khách hàng có thể đặt hàng qua website the350f.com và nhân viên của chúng tôi sẽ gọi điện xác nhận về thông tin đơn hàng và tư vấn thêm thông tin.
                    </li>
                    <li>
                        Quý Khách thanh toán đầy đủ toàn bộ giá trị đơn hàng cho nhân viên giao nhận ngay sau khi kiểm tra tình trạng đơn hàng (kiểm tra đúng sản phẩm đã đặt còn nguyên vẹn, đầy đủ phụ kiện đi kèm như dao nến và tag chúc mừng, … ).
                    </li>
                    <li>
                        Nếu Quý Khách cần thay đổi hình thức thanh toán khi shipper đã giao hàng đến, hãy gọi Hotline 0908.78.8787 để thông báo và được hỗ trợ nhanh chóng.
                    </li>
                </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center space-x-3">
                <Banknote className="h-6 w-6 text-red-600" />
                <span>Chuyển khoản ngân hàng</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 leading-relaxed space-y-2">
              <p>
                Quý khách vui lòng chuyển khoản vào tài khoản dưới đây. Nội dung
                chuyển khoản xin ghi rõ mã đơn hàng để chúng tôi có thể xác
                nhận nhanh chóng.
              </p>
              <ul className="list-disc list-inside bg-gray-50 p-4 rounded-md">
                <li>
                  <strong>Ngân hàng:</strong> Vietcombank
                </li>
                <li>
                  <strong>Chủ tài khoản:</strong> CTY TNHH THE 350F
                </li>
                <li>
                  <strong>Số tài khoản:</strong> 1234567890
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-red-600" />
                <span>Thanh toán trực tuyến qua cổng VNPAY</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 leading-relaxed">
              Chúng tôi chấp nhận thanh toán qua thẻ ATM nội địa, Visa,
              MasterCard, JCB và ví VNPAY. Giao dịch của bạn sẽ được xử lý an
              toàn và bảo mật tuyệt đối.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentMethods; 