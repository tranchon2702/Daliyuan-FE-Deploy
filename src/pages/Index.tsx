import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductFilter from "@/components/ProductFilter";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductFilter />
      <ProductGrid />
      <Footer />
    </div>
  );
};

export default Index;
