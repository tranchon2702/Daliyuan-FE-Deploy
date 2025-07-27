import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Heart, ShoppingCart, Plus, Minus, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProductDetail } from "./ProductDetails.script";

const ProductDetail = () => {
  const { t, i18n } = useTranslation();
  const {
    product,
    relatedProducts,
    quantity,
    selectedImage,
    loading,
    error,
    selectedUnitType,
    handleQuantityChange,
    handleImageSelect,
    handleUnitTypeChange,
    handleAddToCart,
    handleAddToWishlist,
    handleWriteReview,
    getSelectedPrice,
    formatPrice,
    getImageUrl,
    getTotalPrice
  } = useProductDetail();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-dessert-primary mx-auto mb-4" />
            <p className="text-dessert-primary">{t('common.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-red-500">{t('common.error')}</h2>
            <p className="text-gray-600 mb-6">{error || t('product_detail.product_not_found')}</p>
            <Link to="/">
              <Button size="lg" className="bg-dessert-primary hover:bg-dessert-warm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back_to_home')}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Hiển thị tên và mô tả sản phẩm theo ngôn ngữ hiện tại
  const displayName = i18n.language === 'zh' && product.nameZh ? product.nameZh : product.name;
  const displayDescription = i18n.language === 'zh' && product.descriptionZh ? product.descriptionZh : product.description;
  const categoryName = product.category && typeof product.category === 'object' ? product.category.name : t('common.category');

  // Tạo mảng tất cả các ảnh để hiển thị trong gallery
  const allImages = [...(product.images || [])];
  
  // Thêm các ảnh từ productTypeImages vào mảng allImages
  if (product.productTypeImages && product.productTypeImages.length > 0) {
    product.productTypeImages.forEach(typeImage => {
      if (typeImage.images && typeImage.images.length > 0) {
        allImages.push(...typeImage.images);
      }
    });
  }

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
          <span>
            {i18n.language === 'zh' 
              ? t(`product.mainCategory.${product.mainCategory === 'bánh' ? 'cake' : 'drink'}`) 
              : product.mainCategory === 'bánh' ? 'Bánh ngọt' : 'Nước giải khát'}
          </span>
          <span>/</span>
          <span className="text-foreground">{displayName}</span>
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
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-50">
              <img
                src={selectedImage >= 0 && allImages[selectedImage] 
                  ? getImageUrl(allImages[selectedImage]) 
                  : product.mainImage 
                    ? getImageUrl(product.mainImage) 
                    : '/placeholder.svg'}
                alt={displayName}
                className="w-full h-full object-contain"
              />
            </div>
            {allImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {/* Hiển thị ảnh chính đầu tiên */}
                <button
                  onClick={() => handleImageSelect(-1)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors bg-gray-50 ${
                    selectedImage === -1
                      ? "border-dessert-primary"
                      : "border-border hover:border-dessert-warm"
                  }`}
                >
                  <img
                    src={product.mainImage ? getImageUrl(product.mainImage) : '/placeholder.svg'}
                    alt={`${displayName} main`}
                    className="w-full h-full object-contain"
                  />
                </button>
                
                {/* Hiển thị tất cả các ảnh khác */}
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors bg-gray-50 ${
                      selectedImage === index
                        ? "border-dessert-primary"
                        : "border-border hover:border-dessert-warm"
                    }`}
                  >
                    <img
                      src={image ? getImageUrl(image) : '/placeholder.svg'}
                      alt={`${displayName} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {categoryName}
              </Badge>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                {displayName}
              </h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-dessert-primary">
                  {formatPrice(getTotalPrice())}
                </span>
                {product.discountPrice > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('product_detail.weight')} 500g • {t('product_detail.serves')} 4-6 {t('common.people')}
              </p>
            </div>

            <p className="text-foreground leading-relaxed">
              {displayDescription}
            </p>

            <Separator />

            {/* Đơn vị tính */}
            {product.unitOptions && product.unitOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">
                  {t('product_modal.unit_type')}:
                </h3>
                <RadioGroup 
                  value={selectedUnitType} 
                  onValueChange={handleUnitTypeChange}
                  className="flex flex-wrap gap-3"
                >
                  {product.unitOptions.map((option) => (
                    <div key={option.unitType} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.unitType} 
                        id={`unit-${option.unitType}`} 
                        className="text-red-600"
                      />
                      <Label 
                        htmlFor={`unit-${option.unitType}`}
                        className="cursor-pointer text-sm"
                      >
                        {i18n.language === 'zh' ? t(`product.unitTypes.${option.unitType}`) : option.unitType} ({formatPrice(option.price)})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

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

              {product.status === 'Còn hàng' ? (
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
        <Tabs defaultValue="description" className="mt-8">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="description">{t('product_detail.tabs.description')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('product_detail.tabs.reviews')}</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <h3 className="text-lg font-medium">{t('product_detail.detailed_description')}</h3>
            {/* Hiển thị mô tả sản phẩm từ database */}
            {displayDescription ? (
              <>
                {/* Cải thiện việc phát hiện nội dung HTML và hiển thị đúng */}
                {displayDescription.includes('<') && displayDescription.includes('>') ? (
                  <div 
                    className="text-muted-foreground prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: displayDescription }} 
                  />
                ) : (
                  <p className="text-muted-foreground whitespace-pre-line">{displayDescription}</p>
                )}
                
                {/* Hiển thị nội dung gốc cho debug nếu cần */}
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-8 p-4 border border-gray-200 rounded-lg">
                    <summary className="text-sm text-gray-500 cursor-pointer">Debug: Raw Description</summary>
                    <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">{JSON.stringify(displayDescription, null, 2)}</pre>
                  </details>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">{t('product_detail.no_description')}</p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {product.ratings && product.ratings.length > 0 ? (
              <div className="space-y-6">
                {product.ratings.map((rating, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{rating.name || t('product_detail.anonymous')}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < rating.rating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{rating.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">{t('product_detail.no_reviews')}</p>
                <Button onClick={handleWriteReview}>
                  {t('product_detail.write_review')}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">{t('product_detail.related_products')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                // Hiển thị tên sản phẩm liên quan theo ngôn ngữ hiện tại
                const relatedProductName = i18n.language === 'zh' && relatedProduct.nameZh 
                  ? relatedProduct.nameZh 
                  : relatedProduct.name;
                  
                return (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-dessert-light mb-3">
                      <img
                        src={relatedProduct.image ? `${backendUrl}${relatedProduct.image}` : '/placeholder.svg'}
                        alt={relatedProductName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-sm group-hover:text-dessert-primary transition-colors">
                      {relatedProductName}
                    </h3>
                    <p className="text-dessert-primary font-semibold">
                      {relatedProduct.price}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;