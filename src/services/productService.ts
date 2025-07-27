import api from './api';

export interface Product {
  _id: string;
  name: string;
  nameZh?: string;
  slug: string;
  code: string;
  description: string;
  descriptionZh?: string;
  price: number;
  discountPrice: number;
  mainImage: string;
  images: string[];
  productTypeImages?: {
    unitType: string;
    images: string[];
  }[];
  category: any;
  mainCategory: string;
  unitOptions: {
    unitType: string;
    price: number;
    stock: number;
  }[];
  stock: number;
  isFeatured: boolean;
  status: string;
  ratings?: {
    user: string;
    name?: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  numReviews?: number;
  averageRating?: number;
  ingredients?: string;
  imageVariants?: {
    original: string;
    webp: string;
    thumbnailWebp: string;
    mediumWebp: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  totalProducts: number;
}

// Lấy tất cả sản phẩm với phân trang và tìm kiếm
export const getProducts = async (
  keyword = '',
  page = 1,
  category = '',
  mainCategory = '',
  extraFilters: Record<string, any> = {}
): Promise<ProductsResponse> => {
  try {
    let query = `/products?keyword=${keyword}&page=${page}&category=${category}&mainCategory=${mainCategory}`;
    Object.entries(extraFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query += `&${key}=${value}`;
      }
    });
    const { data } = await api.get(query);
    return data;
  } catch (error) {
    throw error;
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Lấy sản phẩm theo slug hoặc ID
export const getProductBySlug = async (slugOrId: string): Promise<Product> => {
  try {
    // Kiểm tra xem tham số là ID MongoDB hay slug
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(slugOrId);
    
    if (isMongoId) {
      // Nếu là ID MongoDB, sử dụng endpoint ID
      const { data } = await api.get(`/products/${slugOrId}`);
      return data;
    } else {
      // Nếu là slug, sử dụng endpoint slug
      const { data } = await api.get(`/products/slug/${slugOrId}`);
      return data;
    }
  } catch (error) {
    throw error;
  }
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const { data } = await api.get(`/products/featured?limit=${limit}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (
  categoryId: string,
  page = 1
): Promise<ProductsResponse> => {
  try {
    const { data } = await api.get(`/products/category/${categoryId}?page=${page}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Lấy sản phẩm theo danh mục chính (bánh/nước)
export const getProductsByMainCategory = async (
  mainCategory: string,
  page = 1
): Promise<ProductsResponse> => {
  try {
    const { data } = await api.get(`/products/main-category/${mainCategory}?page=${page}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Thêm sản phẩm mới
export const createProduct = async (productData: any) => {
  if (productData instanceof FormData) {
    return api.post('/products', productData);
  }
  return api.post('/products', productData);
};

// Sửa sản phẩm
export const updateProduct = async (id: string, productData: any) => {
  if (productData instanceof FormData) {
    return api.put(`/products/${id}`, productData);
  }
  return api.put(`/products/${id}`, productData);
};

// Xóa sản phẩm
export const deleteProduct = async (id: string) => {
  try {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
}; 