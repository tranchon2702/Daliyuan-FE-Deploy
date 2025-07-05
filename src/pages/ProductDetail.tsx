import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import chocolateCakeImg from "@/assets/chocolate-cake.jpg";
import blackForestImg from "@/assets/black-forest.jpg";
import tiramisuImg from "@/assets/tiramisu.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app this would come from API
  const product = {
    id: id || "1",
    name: "Black Forest Hộp Thiếc",
    price: "399,600VND",
    originalPrice: "450,000VND",
    rating: 4.8,
    reviews: 24,
    description: "Bánh Black Forest hộp thiếc cao cấp với lớp kem tươi mềm mịn, cherry tươi và chocolate đen Bỉ nguyên chất. Được đóng gói trong hộp thiếc sang trọng, thích hợp làm quà tặng.",
    images: [blackForestImg, chocolateCakeImg, tiramisuImg],
    inStock: true,
    category: "Bánh Hộp Thiếc",
    ingredients: ["Kem tươi", "Cherry tươi", "Chocolate đen Bỉ", "Bánh quy", "Rượu rum"],
    nutritionInfo: "Calories: 350 per serving",
    weight: "500g",
    serves: "4-6 người",
  };

  const relatedProducts = [
    {
      id: "2",
      name: "Chocolate Dream Cake",
      price: "243,000VND",
      image: chocolateCakeImg,
    },
    {
      id: "3",
      name: "Tiramisu Classic",
      price: "156,000VND",
      image: tiramisuImg,
    },
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-dessert-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-dessert-primary hover:text-dessert-warm transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-dessert-light">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-dessert-primary"
                      : "border-border hover:border-dessert-warm"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-dessert-accent text-dessert-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} đánh giá)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-dessert-primary">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Khối lượng: {product.weight} • Phục vụ: {product.serves}
              </p>
            </div>

            <p className="text-foreground leading-relaxed">
              {product.description}
            </p>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {product.inStock ? (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Còn hàng - Giao hàng trong 2-3 ngày
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  Tạm hết hàng
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="ingredients">Thành phần</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-foreground leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-muted-foreground">
                Bánh được làm thủ công với nguyên liệu cao cấp nhập khẩu từ châu Âu. 
                Mỗi chiếc bánh đều được chế biến kỹ lưỡng bởi đội ngũ bếp trưởng 
                chuyên nghiệp với nhiều năm kinh nghiệm.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="ingredients" className="mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Thành phần chính:</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-dessert-primary rounded-full"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                {product.nutritionInfo}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                </p>
                <Button variant="outline" className="mt-4">
                  Viết đánh giá
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="font-serif text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="group"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-dessert-light mb-3">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-sm group-hover:text-dessert-primary transition-colors">
                  {relatedProduct.name}
                </h3>
                <p className="text-dessert-primary font-semibold">
                  {relatedProduct.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;