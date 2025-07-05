import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartModal from "@/components/CartModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigation = [
    { name: "Shop", href: "/" },
    { name: "Giới Thiệu", href: "/about" },
    { name: "Liên Hệ", href: "/contact" },
    { name: "Giỏ Hàng", href: "/cart" },
  ];

  return (
    <header className="bg-dessert-cream/95 backdrop-blur-md sticky top-0 z-50 border-b border-dessert-secondary/20 shadow-card">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-dessert-secondary/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <div className="text-center group cursor-pointer">
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-dessert-primary group-hover:text-dessert-dark transition-colors duration-300">
                The350F
              </h1>
              <p className="text-xs text-dessert-primary/60 tracking-widest uppercase font-medium">
                Dessert & More
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-sm font-medium text-dessert-primary hover:text-dessert-dark transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-gradient group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-dessert-secondary/50 hover:scale-105 transition-all duration-300"
            >
              <Search className="h-5 w-5 text-dessert-primary" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-dessert-secondary/50 hover:scale-105 transition-all duration-300">
              <User className="h-5 w-5 text-dessert-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-dessert-secondary/50 hover:scale-105 transition-all duration-300"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5 text-dessert-primary" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent-gradient rounded-full text-xs flex items-center justify-center text-white font-medium shadow-glow animate-pulse">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-border">
            <div className="relative max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-sm font-medium text-foreground hover:text-dessert-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
      
      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;