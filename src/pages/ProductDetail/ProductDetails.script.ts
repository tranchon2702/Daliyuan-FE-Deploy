import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProductBySlug, Product as ApiProduct } from "@/services/productService";
import { addToCart } from "@/services/cartService";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";

export interface RelatedProduct {
  id: string;
  name: string;
  nameZh?: string;
  price: string;
  image: string;
}

export const useProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(-1); // Default to main image (-1)
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [selectedUnitType, setSelectedUnitType] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError(t('product_detail.missing_id'));
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProductBySlug(id);
        setProduct(data);
        
        // Debug description
        console.log("Product description:", {
          description: data.description,
          descriptionZh: data.descriptionZh,
          hasDescription: !!data.description,
          hasDescriptionZh: !!data.descriptionZh,
          descriptionLength: data.description?.length || 0,
          descriptionZhLength: data.descriptionZh?.length || 0,
        });
        
        // Đặt đơn vị mặc định là đơn vị đầu tiên
        if (data.unitOptions && data.unitOptions.length > 0) {
          setSelectedUnitType(data.unitOptions[0].unitType);
        }
        
        // TODO: Lấy sản phẩm liên quan từ API
        // Tạm thời để trống
        setRelatedProducts([]);
        
      } catch (err: unknown) {
        console.error("Failed to fetch product:", err);
        
        // Cung cấp thông báo lỗi cụ thể hơn
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          // Lỗi từ server
          if (axiosError.response) {
            if (axiosError.response.status === 404) {
              setError(t('product_detail.product_not_found'));
            } else {
              setError(`${t('product_detail.server_error')} (${axiosError.response.status})`);
            }
          } else if (axiosError.request) {
            // Không nhận được phản hồi từ server
            setError(t('product_detail.network_error'));
          } else {
            // Lỗi khác
            setError(t('product_detail.unknown_error'));
          }
        } else {
          // Lỗi không phải từ Axios
          setError(t('product_detail.unknown_error'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };

  const handleUnitTypeChange = (unitType: string) => {
    setSelectedUnitType(unitType);
  };

  // Lấy giá của đơn vị đã chọn
  const getSelectedPrice = (): number => {
    if (!product || !product.unitOptions) return product?.price || 0;
    
    const selectedOption = product.unitOptions.find(option => option.unitType === selectedUnitType);
    return selectedOption ? selectedOption.price : product.price;
  };

  // Tính tổng giá tiền dựa trên số lượng
  const getTotalPrice = (): number => {
    return getSelectedPrice() * quantity;
  };
  
  // Xử lý đường dẫn ảnh
  const getImageUrl = (imagePath: string): string => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    
    if (!imagePath) {
      return '/placeholder.svg';
    }
    
    // Kiểm tra xem image đã là URL đầy đủ chưa
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Kiểm tra xem image có phải là base64 không
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // Xử lý trường hợp đường dẫn có chứa refresh parameter
    if (imagePath.includes('refresh=')) {
      // Lấy đường dẫn cơ bản mà không có query parameters
      const baseUrl = imagePath.split('?')[0];
      return `${backendUrl}${baseUrl}`;
    }
    
    // Nếu là đường dẫn tương đối, thêm backendUrl
    return `${backendUrl}${imagePath}`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'VND';
  };

  const getCurrentUserId = () => {
    const user = localStorage.getItem("userData");
    if (!user) return undefined;
    try {
      const parsed = JSON.parse(user);
      return parsed._id || undefined;
    } catch {
      return undefined;
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedUnitType && product.unitOptions && product.unitOptions.length > 0) {
      toast({
        title: t('product_modal.select_unit_type'),
        description: t('product_modal.please_select_unit_type'),
        variant: "destructive"
      });
      return;
    }

    // Lấy tên sản phẩm theo ngôn ngữ
    const productName = i18n.language === 'zh' && product.nameZh ? product.nameZh : product.name;
    
    const userId = getCurrentUserId();
    addToCart(product, quantity, selectedUnitType, userId);
    
    toast({
      title: t('product_modal.added_to_cart'),
      description: t('product_modal.added_to_cart_description', { 
        quantity: quantity,
        name: productName
      }),
    });
  };

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist logic
    toast({
      title: t('product_detail.added_to_wishlist'),
      description: t('product_detail.added_to_wishlist_description'),
    });
  };

  const handleWriteReview = () => {
    // TODO: Implement write review logic
    toast({
      title: t('product_detail.review_feature'),
      description: t('product_detail.review_feature_coming_soon'),
    });
  };

  return {
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
  };
}; 