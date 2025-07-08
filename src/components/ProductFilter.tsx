import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProductFilter = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = [
    { name: "All", label: "Tất Cả" },
    { name: "best-sellers", label: "Bán Chạy Nhất" },
    { name: "must-try", label: "Phải Thử" },
    { name: "new-arrivals", label: "Sản Phẩm Mới" },
    { name: "trending", label: "Đang Hot" },
  ];

  return (
    <section className="py-12 bg-subtle-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-dessert-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-dessert-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h3 className="font-display text-3xl lg:text-4xl font-bold text-dessert-primary mb-4">
            Khám Phá Bộ Sưu Tập
          </h3>
          <p className="text-dessert-primary/70 max-w-2xl mx-auto">
            Tìm kiếm sản phẩm yêu thích của bạn từ bộ sưu tập đa dạng và phong phú
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up">
          {filters.map((filter, index) => (
            <Button
              key={filter.name}
              variant={activeFilter === filter.name ? "default" : "ghost"}
              onClick={() => setActiveFilter(filter.name)}
              className={`px-8 py-3 rounded-full transition-all duration-300 font-medium ${
                activeFilter === filter.name
                  ? "bg-accent-gradient text-white shadow-hover scale-105"
                  : "hover:bg-dessert-secondary/50 hover:text-red-500 hover:scale-105 text-dessert-primary"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-2xl mx-auto animate-scale-in">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 px-6 py-3 rounded-full border-dessert-primary/20 hover:border-dessert-primary/40 hover:bg-dessert-secondary/30 transition-all duration-300"
            >
              <Filter className="h-4 w-4 text-dessert-primary" />
              <span className="text-dessert-primary font-medium">Lọc</span>
            </Button>
            <div className="relative group">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-80 rounded-full border-dessert-primary/20 focus:border-dessert-primary focus:ring-dessert-primary/20 bg-white/50 backdrop-blur-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dessert-primary/60 group-focus-within:text-dessert-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFilter;