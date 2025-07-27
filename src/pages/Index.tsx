import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductFilter from '@/components/ProductFilter';
import AlternatingProductGrid from '@/components/AlternatingProductGrid';
import Footer from '@/components/Footer';
import { getProducts, getProductsByMainCategory, Product } from '@/services/productService';

const Index = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        let response;
        if (activeFilter === 'All') {
          response = await getProducts();
          setProducts(response.products);
        } else if (activeFilter === 'cake') {
          response = await getProductsByMainCategory('bánh');
          setProducts(response.products);
        } else if (activeFilter === 'drink') {
          response = await getProductsByMainCategory('nước');
          setProducts(response.products);
        } else if (activeFilter === 'best-sellers') {
          // Lấy tất cả sản phẩm và lọc theo isBestSeller
          response = await getProducts();
          setProducts(response.products.filter(p => p.isBestSeller));
        } else if (activeFilter === 'must-try') {
          // Lấy tất cả sản phẩm và lọc theo isMustTry
          response = await getProducts();
          setProducts(response.products.filter(p => p.isMustTry));
        } else if (activeFilter === 'new-arrivals') {
          // Lấy tất cả sản phẩm và lọc theo isNewArrival
          response = await getProducts();
          setProducts(response.products.filter(p => p.isNewArrival));
        } else if (activeFilter === 'trending') {
          // Lấy tất cả sản phẩm và lọc theo isTrending
          response = await getProducts();
          setProducts(response.products.filter(p => p.isTrending));
        } else {
          response = await getProducts();
          setProducts(response.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      <div className="container mx-auto px-4 py-8">
        <AlternatingProductGrid products={products} isLoading={isLoading} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
