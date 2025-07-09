import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProductDetail } from "./ProductDetails.script";

const ProductDetail = () => {
  const { t } = useTranslation();
  const {
    product,
    relatedProducts,
    quantity,
    selectedImage,
    handleQuantityChange,
    handleImageSelect,
    handleAddToCart,
    handleAddToWishlist,
    handleWriteReview,
  } = useProductDetail();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-dessert-primary transition-colors">
            {t('product_detail.breadcrumb_home')}
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-dessert-primary hover:text-dessert-warm transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('product_detail.back_button')}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-dessert-light">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-dessert-primary"
                      : "border-border hover:border-dessert-warm"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-dessert-primary">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('product_detail.weight')} {product.weight} • {t('product_detail.serves')} {product.serves}
              </p>
            </div>

            <p className="text-foreground leading-relaxed">
              {product.description}
            </p>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{t('product_detail.quantity')}</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('product_detail.add_to_cart')}
                </Button>
                <Button variant="outline" size="lg" onClick={handleAddToWishlist}>
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {product.inStock ? (
                <p className="text-sm text-green-600 font-medium">
                  {t('product_detail.in_stock')}
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  {t('product_detail.out_of_stock')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">{t('product_detail.tabs.description')}</TabsTrigger>
            <TabsTrigger value="ingredients">{t('product_detail.tabs.ingredients')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('product_detail.tabs.reviews')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-foreground leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-muted-foreground">
                {t('product_detail.detailed_description')}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="ingredients" className="mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">{t('product_detail.main_ingredients')}</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-dessert-primary rounded-full"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                {product.nutritionInfo}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {t('product_detail.no_reviews')}
                </p>
                <Button variant="outline" className="mt-4" onClick={handleWriteReview}>
                  {t('product_detail.write_review')}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="font-serif text-2xl font-bold mb-6">{t('product_detail.related_products')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="group"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-dessert-light mb-3">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-sm group-hover:text-dessert-primary transition-colors">
                  {relatedProduct.name}
                </h3>
                <p className="text-dessert-primary font-semibold">
                  {relatedProduct.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;