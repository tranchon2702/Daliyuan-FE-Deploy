import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { Product } from "@/services/productService";
import { useNavigate } from "react-router-dom";
import "./AlternatingProductGrid.css";

interface AlternatingProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const AlternatingProductGrid = ({ products, isLoading = false }: AlternatingProductGridProps) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Chia sản phẩm thành các nhóm 5 sản phẩm
  const chunkProducts = (products: Product[], size: number) => {
    // Nếu có ít hơn hoặc bằng 5 sản phẩm, chỉ tạo 1 chunk
    if (products.length <= 5) {
      return [products];
    }
    
    // Nếu có 6 sản phẩm, tạo 2 chunk: 5 sản phẩm ở chunk đầu và 1 sản phẩm ở chunk thứ 2
    if (products.length === 6) {
      return [products.slice(0, 5), products.slice(5)];
    }
    
    // Trường hợp còn lại, chia đều các sản phẩm thành các chunk có kích thước 5
    const chunks = [];
    for (let i = 0; i < products.length; i += size) {
      const chunk = products.slice(i, Math.min(i + size, products.length));
      chunks.push(chunk);
    }
    
    return chunks;
  };

  // Sắp xếp lại sản phẩm trong mỗi chunk để sản phẩm nổi bật được hiển thị ở vị trí đầu tiên
  const arrangeProductsInChunk = (chunk: Product[], isEvenSection: boolean) => {
    if (chunk.length === 0) return chunk;
    
    // Tìm sản phẩm nổi bật đầu tiên trong chunk
    const featuredIndex = chunk.findIndex(product => product.isFeatured);
    
    // Nếu không có sản phẩm nổi bật, chọn sản phẩm đầu tiên làm nổi bật
    const featuredProduct = featuredIndex >= 0 ? chunk[featuredIndex] : chunk[0];
    
    // Lấy các sản phẩm còn lại
    const otherProducts = featuredIndex >= 0 
      ? [...chunk.slice(0, featuredIndex), ...chunk.slice(featuredIndex + 1)]
      : chunk.slice(1);
    
    if (isEvenSection) {
      // Section chẵn: sản phẩm nổi bật ở đầu
      return [featuredProduct, ...otherProducts];
    } else {
      // Section lẻ: sản phẩm nổi bật ở giữa (vị trí thứ 3)
      if (otherProducts.length >= 4) {
        // Nếu có đủ 4 sản phẩm thường, đặt 2 ở trái và 2 ở phải
        return [otherProducts[0], otherProducts[1], featuredProduct, otherProducts[2], otherProducts[3]];
      } else if (otherProducts.length === 3) {
        // Nếu có 3 sản phẩm thường, đặt 2 ở trái và 1 ở phải
        return [otherProducts[0], otherProducts[1], featuredProduct, otherProducts[2]];
      } else if (otherProducts.length === 2) {
        // Nếu có 2 sản phẩm thường, đặt 1 ở trái và 1 ở phải
        return [otherProducts[0], featuredProduct, otherProducts[1]];
      } else if (otherProducts.length === 1) {
        // Nếu có 1 sản phẩm thường, đặt nó ở trái
        return [otherProducts[0], featuredProduct];
      } else {
        return [featuredProduct];
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
              {/* Ảnh nổi bật */}
              <div className="lg:col-span-2">
                <div className="bg-gray-200 h-64 lg:h-80 rounded-lg"></div>
                <div className="bg-gray-200 h-4 w-3/4 mt-3"></div>
                <div className="bg-gray-200 h-4 w-1/2 mt-2"></div>
              </div>
              {/* 4 ảnh nhỏ */}
              <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index}>
                    <div className="bg-gray-200 h-24 lg:h-32 rounded-lg"></div>
                    <div className="bg-gray-200 h-3 w-3/4 mt-2"></div>
                    <div className="bg-gray-200 h-3 w-1/2 mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  const productChunks = chunkProducts(products, 5);

  return (
    <>
      {/* Mobile grid (dưới lg) */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:hidden">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onProductClick={handleProductClick}
            onModalOpen={handleOpenModal}
            isLarge={false}
          />
        ))}
      </div>

      {/* Alternating grid cho desktop */}
      <div className="hidden lg:block">
        <div className="alternating-grid space-y-12">
          {productChunks.map((chunk, chunkIndex) => {
            const isEvenSection = chunkIndex % 2 === 0;
            
            // Sắp xếp lại sản phẩm trong mỗi chunk để sản phẩm nổi bật được hiển thị ở vị trí đầu tiên
            const arrangedChunk = arrangeProductsInChunk(chunk, isEvenSection);

            if (isEvenSection) {
              // Layout: 1 ảnh nổi bật bên trái, 4 ảnh nhỏ bên phải
              const [featuredProduct, ...smallProducts] = arrangedChunk;
              
              return (
                <div key={chunkIndex} className="alternating-grid-section grid grid-cols-1 lg:grid-cols-4 gap-10 p-2 mb-12">
                  {/* Ảnh nổi bật bên trái */}
                  <div className="lg:col-span-2 featured-product h-full p-2">
                    {featuredProduct && (
                      <ProductCard
                        product={featuredProduct}
                        onProductClick={handleProductClick}
                        onModalOpen={handleOpenModal}
                        isLarge={true}
                      />
                    )}
                  </div>
                  
                  {/* Ảnh nhỏ bên phải */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                    {smallProducts.map((product) => (
                      <div key={product._id} className="small-product h-full p-2">
                        <ProductCard
                          product={product}
                          onProductClick={handleProductClick}
                          onModalOpen={handleOpenModal}
                          isLarge={false}
                        />
                      </div>
                    ))}
                    {/* Thêm các card trống nếu không đủ 4 sản phẩm nhỏ */}
                    {Array.from({ length: Math.max(0, 4 - smallProducts.length) }).map((_, index) => (
                      <div key={`empty-${index}`} className="small-product h-full opacity-0"></div>
                    ))}
                  </div>
                </div>
              );
            } else {
              // Layout: 1 ảnh nổi bật ở giữa, 2 ảnh nhỏ mỗi bên
              const [
                p1 = null, 
                p2 = null, 
                featured = null, 
                p3 = null, 
                p4 = null
              ] = arrangedChunk;
              
              return (
                <div key={chunkIndex} className="alternating-grid-section grid grid-cols-1 lg:grid-cols-4 gap-10 p-2 mb-12">
                  {/* 2 ảnh nhỏ bên trái */}
                  <div className="lg:col-span-1 grid grid-cols-1 gap-6">
                    {p1 ? (
                      <div className="small-product h-full p-2">
                        <ProductCard product={p1} onProductClick={handleProductClick} onModalOpen={handleOpenModal} isLarge={false} />
                      </div>
                    ) : (
                      <div className="small-product h-full opacity-0"></div>
                    )}
                    {p2 ? (
                      <div className="small-product h-full p-2">
                        <ProductCard product={p2} onProductClick={handleProductClick} onModalOpen={handleOpenModal} isLarge={false} />
                      </div>
                    ) : (
                      <div className="small-product h-full opacity-0"></div>
                    )}
                  </div>
                  
                  {/* Ảnh nổi bật ở giữa */}
                  <div className="lg:col-span-2 featured-product h-full p-2">
                    {featured ? (
                      <ProductCard 
                        product={featured} 
                        onProductClick={handleProductClick} 
                        onModalOpen={handleOpenModal} 
                        isLarge={true}
                      />
                    ) : (
                      <div className="featured-product h-full opacity-0"></div>
                    )}
                  </div>
                  
                  {/* 2 ảnh nhỏ bên phải */}
                  <div className="lg:col-span-1 grid grid-cols-1 gap-6">
                    {p3 ? (
                      <div className="small-product h-full p-2">
                        <ProductCard product={p3} onProductClick={handleProductClick} onModalOpen={handleOpenModal} isLarge={false} />
                      </div>
                    ) : (
                      <div className="small-product h-full opacity-0"></div>
                    )}
                    {p4 ? (
                      <div className="small-product h-full p-2">
                        <ProductCard product={p4} onProductClick={handleProductClick} onModalOpen={handleOpenModal} isLarge={false} />
                      </div>
                    ) : (
                      <div className="small-product h-full opacity-0"></div>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default AlternatingProductGrid; 