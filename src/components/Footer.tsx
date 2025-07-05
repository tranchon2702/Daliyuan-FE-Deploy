import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dessert-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <h3 className="font-serif text-2xl font-bold">The350F</h3>
              <p className="text-sm opacity-80 tracking-wider uppercase">
                Dessert & More
              </p>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Chúng tôi tạo ra những món bánh ngọt tinh tế với hương vị tuyệt vời và thiết kế hoàn hảo.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              <Instagram className="h-5 w-5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên Kết</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Giới Thiệu</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Sản Phẩm</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Tin Tức</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Liên Hệ</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Chính Sách Giao Hàng</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Chính Sách Đổi Trả</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Hướng Dẫn Thanh Toán</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Câu Hỏi Thường Gặp</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên Hệ</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 opacity-80" />
                <span className="opacity-80">123 Nguyễn Văn A, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 opacity-80" />
                <span className="opacity-80">0123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 opacity-80" />
                <span className="opacity-80">hello@the350f.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>&copy; 2024 The350F. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;