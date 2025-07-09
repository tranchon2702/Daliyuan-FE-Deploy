import { useState } from 'react';

// From useAdminDashboard.ts
const initialStats = {
    totalRevenue: { amount: '12,345,678đ', change: '+12.5%' },
    orders: { amount: '+1,234', change: '+8.2%' },
    newCustomers: { amount: '+345', change: '+21.7%' },
    articles: { amount: '54', change: '-1.2%' }
};

export const useAdminDashboard = () => {
    const [stats] = useState(initialStats);
    return { stats };
};

// From useAdminNews.ts
const initialArticles = [
    { id: 1, title: 'Chào mừng đến với cửa hàng bánh của chúng tôi!', author: 'Admin', status: 'Đã xuất bản', createdDate: '2023-10-20' },
    { id: 2, title: 'Công thức bí mật cho món bánh Tiramisu ngon nhất', author: 'Chef John', status: 'Đã xuất bản', createdDate: '2023-10-18' },
    { id: 3, title: 'Khuyến mãi đặc biệt tháng 11', author: 'Marketing Team', status: 'Bản nháp', createdDate: '2023-10-25' },
];

export const useAdminNews = () => {
    const [articles, setArticles] = useState(initialArticles);
    const handleSearch = (searchTerm: string) => {
        if (!searchTerm) { setArticles(initialArticles); return; }
        setArticles(initialArticles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())));
    };
    const handleFilterChange = (status: string) => {
        if (status === 'all') { setArticles(initialArticles); return; }
        const statusMap: { [key: string]: string } = { published: 'Đã xuất bản', draft: 'Bản nháp' };
        setArticles(initialArticles.filter(a => a.status === statusMap[status]));
    };
    const addArticle = () => console.log("Add new article");
    const updateArticle = (id: number) => console.log(`Update article ${id}`);
    const deleteArticle = (id: number) => setArticles(prev => prev.filter(a => a.id !== id));
    return { articles, articleCount: articles.length, handleSearch, handleFilterChange, addArticle, updateArticle, deleteArticle };
};

// From useAdminProducts.ts
export type Product = {
    id: number;
    name: string;
    code: string;
    category: string;
    price: string;
    status: 'Còn hàng' | 'Hết hàng';
    stock: number;
    isFeatured: boolean;
    createdDate: string;
    image: string;
};

const initialProducts: Product[] = [
    { id: 1, name: 'Black Forest Cake', code: 'SP001', category: 'Bánh Kem', price: '550.000đ', status: 'Còn hàng', stock: 20, isFeatured: true, createdDate: '2023-10-24', image: '/src/assets/black-forest.jpg' },
    { id: 2, name: 'Classic Tiramisu', code: 'SP002', category: 'Bánh Mousse', price: '450.000đ', status: 'Còn hàng', stock: 15, isFeatured: false, createdDate: '2023-10-23', image: '/src/assets/tiramisu.jpg' },
    { id: 3, name: 'Chocolate Truffle Cake', code: 'SP003', category: 'Bánh Kem', price: '600.000đ', status: 'Hết hàng', stock: 0, isFeatured: true, createdDate: '2023-10-22', image: '/src/assets/chocolate-cake.jpg' },
];

export const useAdminProducts = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    // State cho form thêm sản phẩm mới
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [category, setCategory] = useState('Bánh Kem');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(0);
    const [image, setImage] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [status, setStatus] = useState<'Còn hàng' | 'Hết hàng'>('Còn hàng');

    const resetAddProductForm = () => {
        setName('');
        setCode('');
        setCategory('Bánh Kem');
        setPrice('');
        setStock(0);
        setImage('');
        setIsFeatured(false);
        setStatus('Còn hàng');
    };

    const handleAddProductSubmit = async () => {
        const newProductData = { name, code, category, price, stock, image, isFeatured, status };
        console.log("[LOG] Dữ liệu sản phẩm chuẩn bị gửi lên API:", newProductData);
        try {
            // Giả lập gọi API, thay URL bằng API thật của bạn sau này
            // const response = await fetch('/api/products', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(newProductData),
            // });
            // const result = await response.json();
            // console.log('[LOG] Kết quả trả về từ API:', result);
        } catch (error) {
            console.error('[LOG] Lỗi khi gọi API thêm sản phẩm:', error);
        }
        const newProduct: Product = {
            ...newProductData,
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            createdDate: new Date().toISOString().split('T')[0],
        };
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        setAddModalOpen(false); // Close modal on success
        resetAddProductForm();
    };

    const handleProductSearch = (searchTerm: string) => {
        if (!searchTerm) { setProducts(initialProducts); return; }
        const lowercasedTerm = searchTerm.toLowerCase();
        setProducts(initialProducts.filter(p => p.name.toLowerCase().includes(lowercasedTerm) || p.code.toLowerCase().includes(lowercasedTerm)));
    };
    const handleProductFilterChange = (filterType: string, value: string) => {
        if (value === 'all') { setProducts(initialProducts); return; }
        setProducts(initialProducts.filter(product => {
            if (filterType === 'status') {
                if (value === 'available') return product.status === 'Còn hàng';
                if (value === 'sold') return product.status === 'Hết hàng';
            }
            if (filterType === 'category') { return product.category === value; }
            return false;
        }));
    };
    const addProduct = async (newProductData: Omit<Product, 'id' | 'createdDate'>) => {
        console.log("[LOG] Dữ liệu sản phẩm chuẩn bị gửi lên API:", newProductData);
        try {
            // Giả lập gọi API, thay URL bằng API thật của bạn sau này
            // const response = await fetch('/api/products', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(newProductData),
            // });
            // const result = await response.json();
            // console.log('[LOG] Kết quả trả về từ API:', result);
            // Sau này bạn có thể xử lý thêm ở đây
        } catch (error) {
            console.error('[LOG] Lỗi khi gọi API thêm sản phẩm:', error);
        }
        const newProduct: Product = {
            ...newProductData,
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            createdDate: new Date().toISOString().split('T')[0],
        };
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        setAddModalOpen(false); // Close modal on success
    };
    const updateProduct = (id: number) => console.log(`Update product ${id}`);
    const deleteProduct = (id: number) => setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    return { 
        products, 
        productCount: products.length, 
        isAddModalOpen,
        openAddModal: () => setAddModalOpen(true),
        closeAddModal: () => setAddModalOpen(false),
        handleSearch: handleProductSearch, 
        handleFilterChange: handleProductFilterChange, 
        addProduct: handleAddProductSubmit, 
        updateProduct, 
        deleteProduct,
        // Trả về state và setter cho form modal
        name, setName,
        code, setCode,
        category, setCategory,
        price, setPrice,
        stock, setStock,
        image, setImage,
        isFeatured, setIsFeatured,
        status, setStatus,
        resetAddProductForm,
    };
};

// From useAdminOrders.ts
const initialOrders = [
  {
    id: "HD001",
    so: "2507020128100012", // Thêm trường "So"
    customer: "NHA SACH HOANG PHUC 88",
    phone: "0918646839",
    address: "188 NGUYEN AN NINH, DI AN, BINH DUONG",
    deliveryAddress: "654 Pham Van Chi, P.8, Q.6, TP.HCM",
    date: "2025-07-02 09:36:27",
    products: [
      { name: "LONGREN", code: "2023-30", qty: 30, price: 205000, total: 6355000, note: "" },
      { name: "KMJQ", code: "8269", qty: 30, price: 205000, total: 4100000, note: "" },
      { name: "CLWZ", code: "8816", qty: 50, price: 105000, total: 7380000, note: "" },
      { name: "KMQ", code: "8210", qty: 50, price: 165000, total: 15910000, note: "" },
      { name: "BAOTIAN", code: "2373/2365", qty: 30, price: 225000, total: 4500000, note: "" },
      { name: "BBL", code: "3902", qty: 20, price: 165000, total: 9900000, note: "" },
      { name: "BBL", code: "3901", qty: 20, price: 205000, total: 4100000, note: "" },
      { name: "ZHM", code: "3186", qty: 31, price: 215000, total: 15910000, note: "" },
    ],
    note: "Giao hàng giờ hành chính",
    totalQty: 261,
    totalAmount: 47415000,
    receiver: "Nguyễn Văn A",
    cashier: "",
    creator: "",
    packer: "",
    checker: "",
    picker: "",
  },
];

export type Order = (typeof initialOrders)[0];

export const useAdminOrders = () => {
    const [orders, setOrders] = useState(initialOrders);

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm) {
            setOrders(initialOrders);
            return;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        setOrders(initialOrders.filter(order =>
            order.id.toLowerCase().includes(lowercasedTerm) ||
            order.customer.toLowerCase().includes(lowercasedTerm) ||
            order.so.toLowerCase().includes(lowercasedTerm) ||
            order.phone.includes(lowercasedTerm)
        ));
    };

    return { orders, orderCount: orders.length, handleSearch };
};

// From useAdminSystem.ts
const initialStoreInfo = {
    name: 'The 350F',
    description: 'Tiệm bánh ngọt trực tuyến chuyên các loại bánh kem, mousse, và tart.',
};

export const useAdminSystem = () => {
    const [storeInfo, setStoreInfo] = useState(initialStoreInfo);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const handleInfoChange = (field: keyof typeof initialStoreInfo, value: string) => setStoreInfo(prev => ({ ...prev, [field]: value }));
    const handleMaintenanceChange = (checked: boolean) => setMaintenanceMode(checked);
    const saveStoreInfo = () => { console.log("Saving store info:", storeInfo); alert("Thông tin cửa hàng đã được cập nhật!"); };
    const saveMaintenanceMode = () => { console.log("Saving maintenance mode:", maintenanceMode); alert(`Chế độ bảo trì đã được ${maintenanceMode ? 'bật' : 'tắt'}.`); };
    return { storeInfo, maintenanceMode, handleInfoChange, handleMaintenanceChange, saveStoreInfo, saveMaintenanceMode };
}; 