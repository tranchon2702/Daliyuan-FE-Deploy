import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const ProductFilter = ({ activeFilter, onFilterChange }: ProductFilterProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const filters = [
    { name: "All", label: t('product_filter.filters.all') },
    { name: "cake", label: t('product_filter.filters.cake') },
    { name: "drink", label: t('product_filter.filters.drink') },
    { name: "best-sellers", label: t('product_filter.filters.best_sellers') },
    { name: "must-try", label: t('product_filter.filters.must_try') },
    { name: "new-arrivals", label: t('product_filter.filters.new_arrivals') },
    { name: "trending", label: t('product_filter.filters.trending') },
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
            {t('product_filter.title')}
          </h3>
          <p className="text-dessert-primary/70 max-w-2xl mx-auto">
            {t('product_filter.subtitle')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up">
          {filters.map((filter, index) => (
            <Button
              key={filter.name}
              variant={activeFilter === filter.name ? "default" : "ghost"}
              onClick={() => onFilterChange(filter.name)}
              className={`px-8 py-3 rounded-full transition-all duration-300 font-medium ${
                activeFilter === filter.name
                  ? "bg-accent-gradient text-white shadow-hover scale-105"
                  : "hover:bg-gray-100 hover:text-dessert-primary hover:scale-105 text-dessert-primary"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Search and Filter Row */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 px-6 py-3 rounded-full border-dessert-primary/20 hover:border-dessert-primary hover:bg-gray-100 transition-all duration-300"
          >
            <Filter className="h-4 w-4 text-dessert-primary" />
            <span className="text-dessert-primary font-medium">{t('product_filter.filter_button')}</span>
          </Button>
          <div className="relative group">
            <Input
              type="text"
              placeholder={t('product_filter.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-80 rounded-full border-dessert-primary/20 focus:border-dessert-primary focus:ring-dessert-primary/20 bg-white/50 backdrop-blur-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dessert-primary/60 group-focus-within:text-dessert-primary transition-colors" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFilter;