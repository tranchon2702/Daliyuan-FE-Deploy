import { X, ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    category?: string;
    rating?: number;
    description?: string;
  };
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-dessert-cream border-dessert-secondary/20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 p-0 bg-white/90 hover:bg-white rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-6">
            <DialogHeader>
              <div className="space-y-3">
                {product.category && (
                  <Badge variant="secondary" className="w-fit">
                    {product.category}
                  </Badge>
                )}
                <DialogTitle className="text-xl font-bold text-dessert-primary leading-tight">
                  {product.name}
                </DialogTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 4.8)
                            ? "fill-dessert-accent text-dessert-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating || 4.8} (24 đánh giá)
                  </span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-2xl font-bold bg-accent-gradient bg-clip-text text-transparent">
                {product.price}
              </div>
              
              <p className="text-dessert-primary/70 leading-relaxed">
                {product.description || "Bánh cao cấp được chế biến từ nguyên liệu tươi ngon, mang đến hương vị tuyệt vời và độc đáo."}
              </p>

              <div className="flex space-x-3 pt-4">
                <Button className="flex-1 bg-accent-gradient text-white hover:shadow-glow transition-all duration-300">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>
                <Button variant="outline" size="icon" className="border-dessert-secondary/30">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-green-600 font-medium">
                ✓ Còn hàng - Giao hàng trong 2-3 ngày
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;