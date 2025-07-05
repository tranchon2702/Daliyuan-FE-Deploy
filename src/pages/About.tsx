import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Award, Users, Clock } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Đam mê",
      description: "Chúng tôi đặt tình yêu và đam mê vào từng món bánh"
    },
    {
      icon: Award,
      title: "Chất lượng",
      description: "Nguyên liệu cao cấp, quy trình nghiêm ngặt"
    },
    {
      icon: Users,
      title: "Khách hàng",
      description: "Sự hài lòng của khách hàng là ưu tiên hàng đầu"
    },
    {
      icon: Clock,
      title: "Truyền thống",
      description: "Kế thừa và phát triển công thức bánh truyền thống"
    }
  ];

  const milestones = [
    {
      year: "2015",
      title: "Khởi nghiệp",
      description: "Thành lập với niềm đam mê tạo ra những món bánh ngọt tuyệt vời"
    },
    {
      year: "2017",
      title: "Mở rộng",
      description: "Khai trương cửa hàng thứ hai và phát triển team chuyên nghiệp"
    },
    {
      year: "2019",
      title: "Đổi mới",
      description: "Ra mắt dòng sản phẩm bánh hộp thiếc cao cấp"
    },
    {
      year: "2021",
      title: "Số hóa",
      description: "Phát triển nền tảng online và dịch vụ giao hàng toàn quốc"
    },
    {
      year: "2024",
      title: "Hiện tại",
      description: "Trở thành thương hiệu bánh ngọt uy tín với hơn 10,000 khách hàng"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-dessert-light to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
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
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-elegant">
                <p className="font-serif text-2xl font-bold text-dessert-primary">10+</p>
                <p className="text-sm text-muted-foreground">Năm kinh nghiệm</p>
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

      {/* Timeline Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những cột mốc quan trọng trong quá trình phát triển của The350F
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-dessert-warm"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`w-full max-w-md ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <Card className="p-6 hover:shadow-elegant transition-shadow">
                      <div className="mb-3">
                        <Badge variant="secondary" className="font-bold">
                          {milestone.year}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-dessert-primary rounded-full border-4 border-background"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-dessert-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Đội ngũ chuyên nghiệp
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những con người tạo nên sự khác biệt của The350F
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Chef Minh Anh",
                role: "Bếp trưởng điều hành",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
              },
              {
                name: "Hương Giang",
                role: "Chuyên gia phát triển sản phẩm",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=300&h=300&fit=crop&crop=face"
              },
              {
                name: "Thanh Tùng",
                role: "Trưởng phòng kiểm soát chất lượng",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
              }
            ].map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-elegant transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
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