import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartModal from "@/components/CartModal";
import LoginModal from "@/components/User/LoginModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const Header = () => {
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoggedIn");
      const user = localStorage.getItem("userData");
      
      if (loginStatus === "true" && user) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(user));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const navigation = [
    { name: t('header.nav.shop'), href: "/" },
    { name: t('header.nav.about'), href: "/about" },
    { name: t('header.nav.contact'), href: "/contact" },
    { name: t('header.nav.cart'), href: "/cart" },
    { name: t('header.nav.payment'), href: "/hinh-thuc-thanh-toan" },
  ];

  const isActivePage = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-dessert-cream/95 backdrop-blur-md sticky top-0 z-50 border-b border-dessert-secondary/20 shadow-card">
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-dessert-secondary/50 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>{t('header.menu')}</SheetTitle>
                </SheetHeader>
                <nav className="space-y-4 py-4">
                  {navigation.map((item) => {
                    const isActive = isActivePage(item.href);
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`block text-base font-medium transition-colors ${
                          isActive
                            ? "text-dessert-primary font-semibold"
                            : "text-foreground hover:text-dessert-primary"
                        }`}
                      >
                        {item.name}
                      </a>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <div className="text-center group cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-dessert-primary group-hover:text-dessert-dark transition-colors duration-300">
                The350F
              </h1>
              <p className="text-xs text-dessert-primary/60 tracking-widest uppercase font-medium">
                {t('header.tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = isActivePage(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative text-sm font-medium transition-all duration-300 group ${
                    isActive 
                      ? "text-dessert-dark font-semibold" 
                      : "text-dessert-primary hover:text-dessert-dark"
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent-gradient transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-dessert-secondary/50 hover:scale-105 transition-all duration-300">
                  {i18n.language.toUpperCase()}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => changeLanguage('vi')}>Tiếng Việt</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('zh')}>中文</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-dessert-secondary/50 hover:scale-105 transition-all duration-300"
            >
              <Search className="h-5 w-5 text-dessert-primary" />
            </Button>
            {isLoggedIn ? (
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-dessert-secondary/50 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/my-account")}
                >
                  <User className="h-5 w-5 text-dessert-primary" />
                </Button>
                {/* Dropdown menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userData?.fullName}</p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => navigate("/my-account")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {t('header.my_account')}
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("isLoggedIn");
                        localStorage.removeItem("userData");
                        setIsLoggedIn(false);
                        setUserData(null);
                        navigate("/");
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('header.logout')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-dessert-secondary/50 hover:scale-105 transition-all duration-300"
                onClick={() => setIsLoginOpen(true)}
              >
                <User className="h-5 w-5 text-dessert-primary" />
              </Button>
            )}
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
                placeholder={t('header.search_placeholder')}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
      
      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
};

export default Header;