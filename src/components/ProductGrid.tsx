import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import chocolateCakeImg from "@/assets/chocolate-cake.jpg";
import blackForestImg from "@/assets/black-forest.jpg";
import tiramisuImg from "@/assets/tiramisu.jpg";

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const products = [
    {
      id: "1",
      name: "BLACK FOREST HỘP THIẾC",
      price: "399.000VND",
      image: blackForestImg,
    },
    {
      id: "2",
      name: "Chocolate Dream Cake Hộp Thiếc",
      price: "243.000VND",
      image: chocolateCakeImg,
    },
    {
      id: "3",
      name: "DOUBLE CHEESE LONGAN",
      price: "291.000VND",
      image: tiramisuImg,
    },
    {
      id: "4",
      name: "CHOCOLATE LÂN THỊ THỐT NỐT GOLD VERSION",
      price: "275.000VND",
      image: chocolateCakeImg,
    },
    {
      id: "5",
      name: "MERRY BERRY (Báo Hộp Thiếc)",
      price: "156.000VND",
      image: blackForestImg,
    },
    {
      id: "6",
      name: "Tiramisu hộp thiếc phân ban Premium",
      price: "199.000VND",
      image: tiramisuImg,
    },
    {
      id: "7",
      name: "Giftset 6 bánh mini",
      price: "450.000VND",
      image: chocolateCakeImg,
    },
    {
      id: "8",
      name: "Red Velvet Deluxe",
      price: "325.000VND",
      image: blackForestImg,
    },
    {
      id: "9",
      name: "Matcha Green Tea Premium",
      price: "267.000VND",
      image: tiramisuImg,
    },
    {
      id: "10",
      name: "Opera Cake Classic",
      price: "278.000VND",
      image: chocolateCakeImg,
    },
    {
      id: "11",
      name: "Strawberry Cheesecake Deluxe",
      price: "298.000VND",
      image: blackForestImg,
    },
    {
      id: "12",
      name: "Lemon Tart Premium Box",
      price: "189.000VND",
      image: tiramisuImg,
    },
  ];

  const handleModalOpen = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="py-16 bg-dessert-cream min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-dessert-primary rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-dessert-accent rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-dessert-primary rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-dessert-primary mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <div className="w-24 h-1 bg-accent-gradient mx-auto rounded-full mb-6"></div>
          <p className="text-dessert-primary/70 max-w-2xl mx-auto text-lg leading-relaxed">
            Khám phá những món bánh ngọt tinh tế được chế biến từ nguyên liệu cao cấp, 
            mang đến trải nghiệm vị giác hoàn hảo cho những người sành ăn.
          </p>
        </div>

        {/* Circular Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-12">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                onModalOpen={handleModalOpen}
                onProductClick={handleProductClick}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16 animate-fade-in">
          <Button className="bg-accent-gradient text-white px-12 py-4 rounded-full font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg">
            Xem Thêm Sản Phẩm
            <span className="ml-2">→</span>
          </Button>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default ProductGrid;