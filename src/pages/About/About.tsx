import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { values } from "./About.script.js";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-dessert-light to-background">
        <div className="container mx-auto px-4 text-center ">
          <Badge variant="secondary" className="mb-4 text-red-600 bg-red-100 border-red-200">
            Về chúng tôi
          </Badge>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Câu chuyện The350F
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Từ một niềm đam mê nhỏ bé đến thương hiệu bánh ngọt được yêu thích, 
            The350F đã không ngừng sáng tạo và mang đến những trải nghiệm tuyệt vời 
            cho khách hàng suốt gần 10 năm qua.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">
                Khởi nguồn từ đam mê
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The350F ra đời từ niềm đam mê tạo ra những món bánh ngọt tuyệt vời 
                  của đội ngũ bếp trưởng giàu kinh nghiệm. Chúng tôi tin rằng mỗi 
                  chiếc bánh không chỉ là món ăn mà còn là nghệ thuật, là cách 
                  để chia sẻ niềm vui và tình yêu.
                </p>
                <p>
                  Tên gọi "The350F" lấy cảm hứng từ nhiệt độ lý tưởng để nướng bánh 
                  (350°F = 175°C), thể hiện sự chính xác và chuyên nghiệp trong 
                  từng công đoạn sản xuất.
                </p>
                <p>
                  Từ những ngày đầu khiêm tốn với một lò nướng nhỏ, chúng tôi đã 
                  không ngừng học hỏi, sáng tạo và phát triển để mang đến những 
                  sản phẩm chất lượng nhất cho khách hàng.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-dessert-warm">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop"
                  alt="Bếp trưởng đang làm bánh"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-elegant ">
                <p className="font-serif text-2xl font-bold text-red-600">10+</p>
                <p className="text-sm text-muted-foreground text-red-600">Năm kinh nghiệm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-dessert-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-elegant transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-dessert-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-dessert-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;