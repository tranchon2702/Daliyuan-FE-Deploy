import { useState, useEffect } from 'react';
import api from '@/services/api';
import {
  getProducts,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  Product as ApiProduct
} from '@/services/productService';
import { getCategories, Category } from '@/services/categoryService';

// Mở rộng interface Product để bao gồm các thuộc tính mới
interface ExtendedProduct extends ApiProduct {
  isBestSeller?: boolean;
  isMustTry?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  giaGoi?: number;
  giaThung?: number;
  giaLoc?: number;
}

// Dashboard Stats Interface
interface DashboardStats {
  totalRevenue: { amount: string; change: string };
  orders: { amount: string; change: string };
  newCustomers: { amount: string; change: string };
  articles: { amount: string; change: string };
}

// Order Interface
export interface Order {
  id: string;
  so: string;
  customer: string;
  phone: string;
  address: string;
  deliveryAddress: string;
  date: string;
  products: {
    name: string;
    code: string;
    qty: number;
    price: number;
    total: number;
    note: string;
  }[];
  note: string;
  totalQty: number;
  totalAmount: number;
  receiver: string;
  cashier: string;
  creator: string;
  packer: string;
  checker: string;
  picker: string;
}

// Article Interface
interface Article {
  id: number;
  title: string;
  author: string;
  status: string;
  createdDate: string;
}

// Store Info Interface
interface StoreInfo {
  name: string;
  description: string;
}

// useAdminDashboard hook
export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: { amount: '0đ', change: '+0%' },
    orders: { amount: '0', change: '+0%' },
    newCustomers: { amount: '0', change: '+0%' },
    articles: { amount: '0', change: '+0%' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Gọi API để lấy dữ liệu dashboard từ backend
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard');
        // Sử dụng dữ liệu mẫu nếu API chưa được triển khai
        setStats({
          totalRevenue: { amount: '12,345,678đ', change: '+12.5%' },
          orders: { amount: '+1,234', change: '+8.2%' },
          newCustomers: { amount: '+345', change: '+21.7%' },
          articles: { amount: '54', change: '-1.2%' }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // fetchTrigger được thêm vào dependencies để tránh gọi API liên tục
  }, [fetchTrigger]);

  return { stats, loading, error, refreshData: () => setFetchTrigger(prev => prev + 1) };
};

// useAdminNews hook
export const useAdminNews = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy danh sách bài viết từ backend
      const response = await api.get('/admin/news');
      setArticles(response.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Không thể tải danh sách bài viết');
      // Sử dụng dữ liệu mẫu nếu API chưa được triển khai
      setArticles([
        { id: 1, title: 'Chào mừng đến với cửa hàng bánh của chúng tôi!', author: 'Admin', status: 'Đã xuất bản', createdDate: '2023-10-20' },
        { id: 2, title: 'Công thức bí mật cho món bánh Tiramisu ngon nhất', author: 'Chef John', status: 'Đã xuất bản', createdDate: '2023-10-18' },
        { id: 3, title: 'Khuyến mãi đặc biệt tháng 11', author: 'Marketing Team', status: 'Bản nháp', createdDate: '2023-10-25' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // fetchTrigger được thêm vào dependencies để tránh gọi API liên tục
  }, [fetchTrigger]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      // Thay vì gọi fetchArticles trực tiếp, tăng fetchTrigger để kích hoạt useEffect
      setFetchTrigger(prev => prev + 1);
      return;
    }
    setArticles(prev => prev.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())));
  };

  const handleFilterChange = (status: string) => {
    if (status === 'all') {
      // Thay vì gọi fetchArticles trực tiếp, tăng fetchTrigger để kích hoạt useEffect
      setFetchTrigger(prev => prev + 1);
      return;
    }
    const statusMap: { [key: string]: string } = { published: 'Đã xuất bản', draft: 'Bản nháp' };
    setArticles(prev => prev.filter(a => a.status === statusMap[status]));
  };

  const addArticle = async () => {
    try {
      // Gọi API để thêm bài viết mới
      await api.post('/admin/news', { title: 'Bài viết mới', content: '' });
      // Tải lại danh sách bài viết
      setFetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error adding article:', err);
    }
  };

  const updateArticle = async (id: number) => {
    try {
      // Gọi API để cập nhật bài viết
      await api.put(`/admin/news/${id}`, { title: 'Bài viết đã cập nhật', content: '' });
      // Tải lại danh sách bài viết
      setFetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error updating article:', err);
    }
  };

  const deleteArticle = async (id: number) => {
    try {
      // Gọi API để xóa bài viết
      await api.delete(`/admin/news/${id}`);
      // Cập nhật state
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  return {
    articles,
    articleCount: articles.length,
    loading,
    error,
    handleSearch,
    handleFilterChange,
    addArticle,
    updateArticle,
    deleteArticle
  };
};

// useAdminProducts hook
export const useAdminProducts = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho form thêm/sửa sản phẩm
  const [name, setName] = useState('');
  const [nameZh, setNameZh] = useState('');
  const [code, setCode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionZh, setDescriptionZh] = useState('');
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'Còn hàng' | 'Hết hàng'>('Còn hàng');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isMustTry, setIsMustTry] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [giaGoi, setGiaGoi] = useState('');
  const [giaThung, setGiaThung] = useState('');
  const [giaLoc, setGiaLoc] = useState('');

  // Thêm state cho ảnh chi tiết
  const [detailImages, setDetailImages] = useState<File[]>([]);

  // Lấy danh sách sản phẩm và category khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsRes.products);
        setCategories(categoriesRes);
      } catch (err) {
        console.error('Error fetching products data:', err);
        setError('Không thể tải dữ liệu sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetAddProductForm = () => {
    setName('');
    setNameZh('');
    setCode('');
    setCategoryId('');
    setCategoryName('');
    setPrice('');
    setDescription('');
    setDescriptionZh('');
    setStock(0);
    setImages([]);
    setIsFeatured(false);
    setStatus('Còn hàng');
    setIsBestSeller(false);
    setIsMustTry(false);
    setIsNewArrival(false);
    setIsTrending(false);
    setGiaGoi('');
    setGiaThung('');
    setGiaLoc('');
  };

  const openAddModal = () => {
    resetAddProductForm();
    setAddModalOpen(true);
  };

  const openEditModal = async (id: string) => {
    try {
      const product = products.find(p => p._id === id) as ExtendedProduct;
      if (product) {
        setName(product.name);
        setNameZh(product.nameZh || '');
        setCode(product.code);
        setCategoryId(product.category ? product.category._id || product.category : '');
        // Use mainCategory to determine categoryName
        setCategoryName(product.mainCategory === 'bánh' ? 'Bánh' : product.mainCategory === 'nước' ? 'Nước' : '');
        setPrice(product.price.toString());
        setDescription(product.description);
        setDescriptionZh(product.descriptionZh || '');
        setStock(product.stock);
        // Không set images từ database vì đó là string[], không phải File[]
        // Khi edit, user sẽ thấy ảnh cũ trong preview, nếu muốn đổi thì chọn file mới
        setImages([]); // Reset về rỗng, preview sẽ được set trong AddProductModal
        setIsFeatured(product.isFeatured);
        setStatus(product.status as 'Còn hàng' | 'Hết hàng');
        setIsBestSeller(product.isBestSeller || false);
        setIsMustTry(product.isMustTry || false);
        setIsNewArrival(product.isNewArrival || false);
        setIsTrending(product.isTrending || false);
        setGiaGoi(product.giaGoi?.toString() || '');
        setGiaThung(product.giaThung?.toString() || '');
        setGiaLoc(product.giaLoc?.toString() || '');
      }
    } catch (err) {
      console.error('Error opening edit modal:', err);
    }
  };

  // Thêm sản phẩm
  const handleAddProductSubmit = async () => {
    try {
      if (!images.length) throw new Error('Hình ảnh là bắt buộc');
      
      // Kiểm tra xem images có phải là File objects không
      const hasFileObjects = images.some(img => img instanceof File);
      if (!hasFileObjects) {
        throw new Error('Vui lòng upload file ảnh hợp lệ');
      }
      
      // Xác định mainCategory dựa trên categoryName
      const mainCategory = categoryName === 'Bánh' ? 'bánh' : categoryName === 'Nước' ? 'nước' : '';
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('nameZh', nameZh);
      formData.append('code', code);
      formData.append('description', description);
      formData.append('descriptionZh', descriptionZh);
      formData.append('price', price);
      
      // Thêm file ảnh vào FormData
      images.forEach((file, idx) => {
        if (file instanceof File) {
          console.log(`Adding image ${idx}:`, file.name, file.type, file.size);
          formData.append('images', file);
        }
      });
      
      formData.append('category', categoryId);
      formData.append('mainCategory', mainCategory);
      formData.append('stock', stock.toString());
      formData.append('isFeatured', isFeatured ? 'true' : 'false');
      formData.append('status', status);
      formData.append('isBestSeller', isBestSeller ? 'true' : 'false');
      formData.append('isMustTry', isMustTry ? 'true' : 'false');
      formData.append('isNewArrival', isNewArrival ? 'true' : 'false');
      formData.append('isTrending', isTrending ? 'true' : 'false');
      formData.append('giaGoi', giaGoi);
      formData.append('giaThung', giaThung);
      formData.append('giaLoc', giaLoc);
      // Tạo unitOptions dựa trên mainCategory
      if (mainCategory === 'bánh') {
        formData.append('unitOptions', JSON.stringify([
          { unitType: 'Gói', price: Number(giaGoi) || 0, stock: Number(stock) || 0 },
          { unitType: 'Thùng', price: Number(giaThung) || 0, stock: Math.floor((Number(stock) || 0) / 5) }
        ]));
      } else if (mainCategory === 'nước') {
        formData.append('unitOptions', JSON.stringify([
          { unitType: 'Lốc', price: Number(giaLoc) || 0, stock: Number(stock) || 0 },
          { unitType: 'Thùng', price: Number(giaThung) || 0, stock: Math.floor((Number(stock) || 0) / 4) }
        ]));
      }
      
      // Thêm ảnh chi tiết vào formData
      if (detailImages && detailImages.length > 0) {
        detailImages.forEach((file) => {
          formData.append('images', file);
        });
      }
      
      // In ra tất cả các entries trong FormData để debug
      console.log("Sending create data:");
      for (const pair of formData.entries()) {
        if (pair[0] === 'images') {
          console.log(pair[0], ':', pair[1] instanceof File ? `File: ${(pair[1] as File).name}` : pair[1]);
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }
      
      const response = await apiCreateProduct(formData);
      console.log("Create product response:", response.data);
      
      const res = await getProducts();
      setProducts(res.products);
      setAddModalOpen(false);
      resetAddProductForm();
      return true;
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      throw error;
    }
  };

  // Xóa sản phẩm
  const deleteProduct = async (id: string) => {
    try {
      await apiDeleteProduct(id);
      setProducts(products => products.filter(p => p._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  };

  // Sửa sản phẩm (truyền toàn bộ dữ liệu form lên API)
  const updateProduct = async (id: string | null) => {
    try {
      if (!id) {
        throw new Error('ID sản phẩm không hợp lệ');
      }
      
      // Kiểm tra xem sản phẩm hiện tại có đường dẫn ảnh hợp lệ không
      const currentProduct = products.find(p => p._id === id);
      const hasValidImage = currentProduct && 
        currentProduct.mainImage && 
        (currentProduct.mainImage.startsWith('/uploads/') || 
         currentProduct.mainImage.startsWith('/uploads/images/'));
      
      // Kiểm tra xem images có phải là File objects không
      const hasFileObjects = images.some(img => img instanceof File);
      const hasDetailFileObjects = detailImages && detailImages.length > 0 && detailImages.some(img => img instanceof File);
      
      console.log("Update product check:", {
        hasValidImage,
        hasFileObjects,
        hasDetailFileObjects,
        detailImagesCount: detailImages?.length || 0,
        detailImagesTypes: detailImages?.map(img => img instanceof File ? 'File' : typeof img)
      });
      
      // Nếu không có ảnh hợp lệ và không upload ảnh mới, yêu cầu upload ảnh
      if (!hasValidImage && !hasFileObjects) {
        throw new Error('Vui lòng upload ảnh mới cho sản phẩm này. Đường dẫn ảnh hiện tại không hợp lệ.');
      }
      
      // Xác định mainCategory dựa trên categoryName
      const mainCategory = categoryName === 'Bánh' ? 'bánh' : categoryName === 'Nước' ? 'nước' : '';
      
      // Kiểm tra mainCategory
      if (!mainCategory) {
        throw new Error('Vui lòng chọn loại sản phẩm (Bánh hoặc Nước)');
      }
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('nameZh', nameZh);
      formData.append('code', code);
      formData.append('description', description);
      formData.append('descriptionZh', descriptionZh);
      formData.append('price', price);
      formData.append('mainCategory', mainCategory); // Đảm bảo mainCategory luôn được gửi
      
      // Upload file ảnh chính
      if (hasFileObjects) {
        // Thêm file ảnh vào FormData
        images.forEach((file, idx) => {
          if (file instanceof File) {
            console.log(`Adding main image ${idx} for update:`, file.name, file.type, file.size);
            formData.append('images', file);
          }
        });
      }
      
      // Upload các ảnh chi tiết
      if (hasDetailFileObjects && detailImages) {
        console.log(`Adding ${detailImages.length} detail images to FormData`);
        detailImages.forEach((file, idx) => {
          if (file instanceof File) {
            console.log(`Adding detail image ${idx} for update:`, file.name, file.type, file.size);
            formData.append('images', file);
          }
        });
      } else {
        console.log("No detail file objects to upload");
      }
      
      formData.append('category', categoryId);
      formData.append('stock', stock.toString());
      formData.append('isFeatured', isFeatured ? 'true' : 'false');
      formData.append('status', status);
      formData.append('isBestSeller', isBestSeller ? 'true' : 'false');
      formData.append('isMustTry', isMustTry ? 'true' : 'false');
      formData.append('isNewArrival', isNewArrival ? 'true' : 'false');
      formData.append('isTrending', isTrending ? 'true' : 'false');
      formData.append('giaGoi', giaGoi);
      formData.append('giaThung', giaThung);
      formData.append('giaLoc', giaLoc);
      // Tạo unitOptions dựa trên mainCategory
      if (mainCategory === 'bánh') {
        formData.append('unitOptions', JSON.stringify([
          { unitType: 'Gói', price: Number(giaGoi) || 0, stock: Number(stock) || 0 },
          { unitType: 'Thùng', price: Number(giaThung) || 0, stock: Math.floor((Number(stock) || 0) / 5) }
        ]));
      } else if (mainCategory === 'nước') {
        formData.append('unitOptions', JSON.stringify([
          { unitType: 'Lốc', price: Number(giaLoc) || 0, stock: Number(stock) || 0 },
          { unitType: 'Thùng', price: Number(giaThung) || 0, stock: Math.floor((Number(stock) || 0) / 4) }
        ]));
      }
      
      // Không gửi productTypeImages riêng, tất cả ảnh sẽ được gửi qua trường images
      formData.append('productTypeImages', JSON.stringify([]));
      
      // In ra tất cả các entries trong FormData để debug
      console.log("Sending update data:");
      for (const pair of formData.entries()) {
        if (pair[0] === 'images') {
          console.log(pair[0], ':', pair[1] instanceof File ? `File: ${(pair[1] as File).name}` : pair[1]);
        } else {
          console.log(pair[0], ':', pair[1]);
        }
      }
      
      // Gọi API cập nhật sản phẩm
      const response = await apiUpdateProduct(id, formData);
      console.log("Update product response:", response.data);
      
      // Cập nhật lại danh sách sản phẩm
      const res = await getProducts();
      setProducts(res.products);
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw error;
    }
  };

  // Tìm kiếm, lọc (có thể dùng lại getProducts với params)
  const handleProductSearch = async (searchTerm: string) => {
    try {
      setLoading(true);
      const res = await getProducts(searchTerm);
      setProducts(res.products);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProductFilterChange = async (filterType: string, value: string) => {
    try {
      setLoading(true);
      // Xử lý lọc theo loại
      if (filterType === 'category' && value !== 'all') {
        const res = await getProducts('', 1, value);
        setProducts(res.products);
      } 
      // Xử lý lọc theo trạng thái
      else if (filterType === 'status') {
        if (value === 'available') {
          const res = await getProducts();
          setProducts(res.products.filter(p => p.status === 'Còn hàng'));
        } else if (value === 'sold') {
          const res = await getProducts();
          setProducts(res.products.filter(p => p.status === 'Hết hàng'));
        } else {
          const res = await getProducts();
          setProducts(res.products);
        }
      }
      // Mặc định load lại tất cả
      else {
        const res = await getProducts();
        setProducts(res.products);
      }
    } catch (error) {
      console.error("Lỗi khi lọc sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    productCount: products.length,
    categories,
    isAddModalOpen,
    loading,
    error,
    openAddModal: openAddModal,
    closeAddModal: () => setAddModalOpen(false),
    handleSearch: handleProductSearch,
    handleFilterChange: handleProductFilterChange,
    addProduct: handleAddProductSubmit,
    updateProduct,
    deleteProduct,
    name, setName,
    nameZh, setNameZh,
    code, setCode,
    categoryId, setCategoryId,
    categoryName, setCategoryName,
    price, setPrice,
    description, setDescription,
    descriptionZh, setDescriptionZh,
    stock, setStock,
    images, setImages,
    isFeatured, setIsFeatured,
    status, setStatus,
    resetAddProductForm,
    isBestSeller, setIsBestSeller,
    isMustTry, setIsMustTry,
    isNewArrival, setIsNewArrival,
    isTrending, setIsTrending,
    giaGoi, setGiaGoi,
    giaThung, setGiaThung,
    giaLoc, setGiaLoc,
    setProducts,
    detailImages, setDetailImages,
  };
};

// useAdminOrders hook
export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy danh sách đơn hàng từ backend
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng');
      // Sử dụng dữ liệu mẫu nếu API chưa được triển khai
      setOrders([
        {
          id: "HD001",
          so: "2507020128100012",
          customer: "NHA SACH HOANG PHUC 88",
          phone: "0918646839",
          address: "188 NGUYEN AN NINH, DI AN, BINH DUONG",
          deliveryAddress: "654 Pham Van Chi, P.8, Q.6, TP.HCM",
          date: "2025-07-02 09:36:27",
          products: [
            { name: "LONGREN", code: "2023-30", qty: 30, price: 205000, total: 6355000, note: "" },
            { name: "KMJQ", code: "8269", qty: 30, price: 205000, total: 4100000, note: "" },
          ],
          note: "Giao hàng giờ hành chính",
          totalQty: 60,
          totalAmount: 10455000,
          receiver: "Nguyễn Văn A",
          cashier: "",
          creator: "",
          packer: "",
          checker: "",
          picker: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // fetchTrigger được thêm vào dependencies để tránh gọi API liên tục
  }, [fetchTrigger]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      // Thay vì gọi fetchOrders trực tiếp, tăng fetchTrigger để kích hoạt useEffect
      setFetchTrigger(prev => prev + 1);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    setOrders(prev => prev.filter(order =>
      order.id.toLowerCase().includes(lowercasedTerm) ||
      order.customer.toLowerCase().includes(lowercasedTerm) ||
      order.so.toLowerCase().includes(lowercasedTerm) ||
      order.phone.includes(lowercasedTerm)
    ));
  };

  return { orders, orderCount: orders.length, loading, error, handleSearch };
};

// useAdminSystem hook
export const useAdminSystem = () => {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    name: '',
    description: '',
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        setLoading(true);
        // Gọi API để lấy cài đặt hệ thống từ backend
        const response = await api.get('/admin/settings');
        setStoreInfo(response.data.storeInfo);
        setMaintenanceMode(response.data.maintenanceMode);
      } catch (err) {
        console.error('Error fetching system settings:', err);
        setError('Không thể tải cài đặt hệ thống');
        // Sử dụng dữ liệu mẫu nếu API chưa được triển khai
        setStoreInfo({
          name: 'The 350F',
          description: 'Tiệm bánh ngọt trực tuyến chuyên các loại bánh kem, mousse, và tart.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSystemSettings();
    // fetchTrigger được thêm vào dependencies để tránh gọi API liên tục
  }, [fetchTrigger]);

  const handleInfoChange = (field: keyof StoreInfo, value: string) => {
    setStoreInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleMaintenanceChange = (checked: boolean) => {
    setMaintenanceMode(checked);
  };

  const saveStoreInfo = async () => {
    try {
      // Gọi API để lưu thông tin cửa hàng
      await api.put('/admin/settings/store', storeInfo);
      alert("Thông tin cửa hàng đã được cập nhật!");
      // Refresh data sau khi cập nhật
      setFetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error saving store info:', err);
      alert("Lỗi khi cập nhật thông tin cửa hàng!");
    }
  };

  const saveMaintenanceMode = async () => {
    try {
      // Gọi API để lưu chế độ bảo trì
      await api.put('/admin/settings/maintenance', { maintenanceMode });
      alert(`Chế độ bảo trì đã được ${maintenanceMode ? 'bật' : 'tắt'}.`);
      // Refresh data sau khi cập nhật
      setFetchTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error saving maintenance mode:', err);
      alert("Lỗi khi cập nhật chế độ bảo trì!");
    }
  };

  return {
    storeInfo,
    maintenanceMode,
    loading,
    error,
    handleInfoChange,
    handleMaintenanceChange,
    saveStoreInfo,
    saveMaintenanceMode
  };
}; 