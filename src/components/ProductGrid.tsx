import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import chocolateCakeImg from "@/assets/chocolate-cake.jpg";
import blackForestImg from "@/assets/black-forest.jpg";
import tiramisuImg from "@/assets/tiramisu.jpg";

const chunk = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const ProductGrid = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    // Group 1 (Layout A)
    { id: "1", name: "BLACK FOREST HỘP THIẾC", price: "399,600VND", image: blackForestImg },
    { id: "2", name: "Chocolate Dream Cake Hộp Thiếc", price: "243,000VND", image: chocolateCakeImg },
    { id: "3", name: "DOUBLE CHEESE LONGAN", price: "291,600VND", image: tiramisuImg },
    { id: "4", name: "MATCHAMISU HỘP THIẾC TRÒN GOLD VERSION", price: "270,000VND", image: blackForestImg },
    { id: "5", name: "MERRY BERRY (Dâu Hộp Thiếc)", price: "356,400VND", image: tiramisuImg },

    // Group 2 (Layout B)
    { id: "6", name: "Tiramisu hộp thiếc phiên bản Premium", price: "199,800VND", image: tiramisuImg },
    { id: "7", name: "Giftset 6 bánh mini", price: "518,400VND", image: chocolateCakeImg },
    { id: "8", name: "TIRAMISU HỘP THIẾC TRÒN PREMIUM", price: "270,000VND", image: blackForestImg },
    { id: "9", name: "Giftset 9 bánh mini", price: "637,200VND", image: chocolateCakeImg },
    { id: "10", name: "Mousse Bưởi Hồng", price: "Giá từ: 626,400VND", image: tiramisuImg },

    // Group 3 (Layout A)
    { id: "11", name: "Mousse Vải", price: "Giá từ 585,000VND", image: blackForestImg },
    { id: "12", name: "Mousse Blueberry", price: "Giá từ 685,000VND", image: chocolateCakeImg },
    { id: "13", name: "Mousse Nhãn", price: "Giá từ 585,000VND", image: tiramisuImg },
    { id: "14", name: "Mousse Dứa Ludi", price: "Giá từ 675,000VND", image: blackForestImg },
    { id: "15", name: "Mousse Xoài", price: "Giá từ 675,000VND", image: chocolateCakeImg },
  ];

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleModalOpen = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const productChunks = chunk(products, 5);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col gap-8">
          {productChunks.map((chunk, index) => {
            if (chunk.length < 5) return null; // Skip incomplete chunks

            // Layout with large image in the middle for odd-indexed chunks (1, 3, ...)
            if (index % 2 !== 0) {
              const [p1, p2, p3, p4, p5] = chunk;
              return (
                <div key={`chunk-${index}`} className="flex flex-col lg:flex-row gap-4">
                  <div className="grid grid-cols-2 lg:flex lg:w-1/4 lg:flex-col gap-4">
                    <ProductCard {...p1} onProductClick={handleProductClick} onModalOpen={handleModalOpen} />
                    <ProductCard {...p2} onProductClick={handleProductClick} onModalOpen={handleModalOpen} />
                  </div>
                  <div className="lg:w-1/2">
                    <ProductCard {...p3} onProductClick={handleProductClick} onModalOpen={handleModalOpen} isLarge />
                  </div>
                  <div className="grid grid-cols-2 lg:flex lg:w-1/4 lg:flex-col gap-4">
                    <ProductCard {...p4} onProductClick={handleProductClick} onModalOpen={handleModalOpen} />
                    <ProductCard {...p5} onProductClick={handleProductClick} onModalOpen={handleModalOpen} />
                  </div>
                </div>
              );
            }

            // Default layout with large image on the left for even-indexed chunks (0, 2, ...)
            const [featuredProduct, ...otherProducts] = chunk;
            return (
              <div key={`chunk-${index}`} className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-1/2">
                  <ProductCard {...featuredProduct} onProductClick={handleProductClick} onModalOpen={handleModalOpen} isLarge />
                </div>
                <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                  {otherProducts.map((p) => (
                    <ProductCard key={p.id} {...p} onProductClick={handleProductClick} onModalOpen={handleModalOpen} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full px-8">
            {t('product_grid.view_more')}
          </Button>
        </div>
      </div>

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