import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: [
        "123 Nguyễn Văn A, Quận 1, TP.HCM",
        "456 Lê Văn B, Quận 3, TP.HCM"
      ]
    },
    {
      icon: Phone,
      title: "Điện thoại",
      details: [
        "Hotline: 0123 456 789",
        "Đặt hàng: 0987 654 321"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "info@the350f.com",
        "order@the350f.com"
      ]
    },
    {
      icon: Clock,
      title: "Giờ mở cửa",
      details: [
        "Thứ 2 - Chủ nhật: 8:00 - 22:00",
        "Nghỉ lễ: 9:00 - 21:00"
      ]
    }
  ];

  const stores = [
    {
      name: "Cửa hàng Quận 1",
      address: "123 Nguyễn Văn A, Quận 1, TP.HCM",
      phone: "0123 456 789",
      hours: "8:00 - 22:00",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
    },
    {
      name: "Cửa hàng Quận 3",
      address: "456 Lê Văn B, Quận 3, TP.HCM",
      phone: "0987 654 321",
      hours: "8:00 - 22:00",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-dessert-light to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Liên hệ
          </Badge>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Kết nối với chúng tôi
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. 
            Hãy liên hệ với The350F để được tư vấn và đặt hàng.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-elegant transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-dessert-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-6 w-6 text-dessert-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Họ và tên *
                    </label>
                    <Input placeholder="Nhập họ và tên" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số điện thoại *
                    </label>
                    <Input placeholder="Nhập số điện thoại" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input type="email" placeholder="Nhập địa chỉ email" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chủ đề
                  </label>
                  <Input placeholder="Nhập chủ đề" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nội dung *
                  </label>
                  <Textarea
                    placeholder="Nhập nội dung tin nhắn..."
                    rows={5}
                  />
                </div>
                
                <Button className="w-full" size="lg">
                  Gửi tin nhắn
                </Button>
              </form>
            </Card>

            {/* Map */}
            <Card className="overflow-hidden">
              <div className="h-full min-h-[400px] bg-dessert-light/30 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-dessert-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Bản đồ cửa hàng
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Nhấn để xem chi tiết vị trí
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-16 bg-dessert-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Hệ thống cửa hàng
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ghé thăm các cửa hàng của chúng tôi để trải nghiệm trực tiếp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stores.map((store, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-elegant transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">{store.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-dessert-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{store.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-dessert-primary" />
                      <span className="text-muted-foreground">{store.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-dessert-primary" />
                      <span className="text-muted-foreground">{store.hours}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Xem bản đồ
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold mb-6">
            Theo dõi chúng tôi
          </h2>
          <p className="text-muted-foreground mb-8">
            Cập nhật những sản phẩm mới và ưu đãi đặc biệt
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="lg" className="space-x-2">
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </Button>
            <Button variant="outline" size="lg" className="space-x-2">
              <Instagram className="h-5 w-5" />
              <span>Instagram</span>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;