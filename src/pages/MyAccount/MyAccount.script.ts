import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProvinces, getDistricts, getWards } from "../Checkout/Checkout.script";
import i18n from '@/i18n'; // Import i18n instance
import axios from "axios";

// API URL
const API_URL = import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL + "/api" : "http://localhost:5000/api";

// ===== TYPES & INTERFACES =====
export interface UserData {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  address?: {
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  avatar?: string;
  googleId?: string;
  loginMethod?: "email" | "google";
  isAdmin?: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string; // code
  cityName?: string;
  district: string; // code
  districtName?: string;
  ward: string; // code
  wardName?: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: "delivered" | "processing" | "cancelled" | "pending";
  total: number;
  items: string[];
}

export interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

// ===== CONSTANTS =====
const SIDEBAR_ITEMS = [
  { key: "profile", icon: "User", label: 'my_account_page.sidebar.profile' },
  { key: "orders", icon: "Package", label: 'my_account_page.sidebar.orders' },
  { key: "address", icon: "MapPin", label: 'my_account_page.sidebar.address' },
  { key: "settings", icon: "Settings", label: 'my_account_page.sidebar.settings' },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD001",
    date: "2024-01-15",
    status: "delivered",
    total: 250000,
    items: ["Bánh Tiramisu", "Bánh Chocolate"]
  },
  {
    id: "ORD002", 
    date: "2024-01-10",
    status: "processing",
    total: 180000,
    items: ["Bánh Black Forest"]
  },
  {
    id: "ORD003",
    date: "2024-01-05", 
    status: "cancelled",
    total: 120000,
    items: ["Bánh Carrot Cake"]
  }
];

// ===== UTILITY FUNCTIONS =====
const getStatusBadge = (status: Order["status"]) => {
  const t = i18n.t;
  switch (status) {
    case "delivered":
      return { text: t('my_account_page.orders_tab.statuses.delivered'), className: "bg-green-100 text-green-800" };
    case "processing":
      return { text: t('my_account_page.orders_tab.statuses.processing'), className: "bg-blue-100 text-blue-800" };
    case "cancelled":
      return { text: t('my_account_page.orders_tab.statuses.cancelled'), className: "bg-red-100 text-red-800" };
    case "pending":
      return { text: t('my_account_page.orders_tab.statuses.pending'), className: "bg-yellow-100 text-yellow-800" };
    default:
      return { text: t('my_account_page.orders_tab.statuses.pending'), className: "bg-gray-100 text-gray-800" };
  }
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('vi-VN') + 'đ';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ===== TOAST UTILITY =====
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = i18n.t(message); // Use i18n for toast messages
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

// ===== MAIN HOOK =====
export const useMyAccount = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ===== STATE MANAGEMENT =====
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    phone: "",
    address: {}
  });

  // Địa chỉ giao hàng (nhiều địa chỉ)
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserData>(userData);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== AUTHENTICATION & DATA LOADING =====
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const token = localStorage.getItem("token");
      
      if (!isLoggedIn || !token) {
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        // Lấy thông tin người dùng từ API
        await fetchUserProfile(token);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Nếu token không hợp lệ, đăng xuất người dùng
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Lấy thông tin người dùng từ API
  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userProfile = response.data;
      
      // Kiểm tra và lấy avatar từ localStorage nếu đăng nhập bằng Google
      const loginMethod = localStorage.getItem("loginMethod") || "email";
      let avatar = userProfile.avatar;
      
      if (loginMethod === "google") {
        const googleAvatar = localStorage.getItem("googleAvatar");
        if (googleAvatar) {
          avatar = googleAvatar;
        }
      }

      const updatedUserData = {
        ...userProfile,
        avatar,
        loginMethod: loginMethod as "email" | "google"
      };

      setUserData(updatedUserData);
      setEditData(updatedUserData);
      
      // Cập nhật lại thông tin trong localStorage
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      
      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  // ===== ĐỊA CHỈ GIAO HÀNG (CRUD) =====
  // Load addresses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("addresses");
    if (stored) {
      setAddresses(JSON.parse(stored));
    }
  }, []);

  // Save addresses to localStorage
  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
    localStorage.setItem("addresses", JSON.stringify(newAddresses));
  };

  // Thêm địa chỉ mới
  const addAddress = (address: Omit<Address, "id">) => {
    const id = `addr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newAddr: Address = { ...address, id };
    let newAddresses = [...addresses, newAddr];
    // Nếu là địa chỉ đầu tiên, đặt làm mặc định
    if (newAddresses.length === 1) newAddresses[0].isDefault = true;
    saveAddresses(newAddresses);
    showToast("my_account_page.toasts.add_address_success");
  };

  // Sửa địa chỉ
  const updateAddress = (id: string, updated: Partial<Address>) => {
    const newAddresses = addresses.map(addr =>
      addr.id === id ? { ...addr, ...updated } : addr
    );
    saveAddresses(newAddresses);
    showToast("my_account_page.toasts.update_address_success");
  };

  // Xóa địa chỉ
  const deleteAddress = (id: string) => {
    let newAddresses = addresses.filter(addr => addr.id !== id);
    // Nếu xóa địa chỉ mặc định, gán mặc định cho địa chỉ đầu tiên còn lại
    if (addresses.find(a => a.id === id)?.isDefault && newAddresses.length > 0) {
      newAddresses[0].isDefault = true;
    }
    saveAddresses(newAddresses);
    showToast("my_account_page.toasts.delete_address_success");
  };

  // Đặt địa chỉ mặc định
  const setDefaultAddress = (id: string) => {
    const newAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(newAddresses);
    showToast("my_account_page.toasts.default_address_set");
  };

  // ===== ADDRESS FORM MANAGEMENT =====
  const [showForm, setShowForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  
  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data);
    };
    loadProvinces();
  }, []);

  // Load districts when province changes
  const handleProvinceChange = async (provinceCode: string) => {
    const data = await getDistricts(provinceCode);
    setDistricts(data);
    setWards([]);
  };

  // Load wards when district changes
  const handleDistrictChange = async (districtCode: string) => {
    const data = await getWards(districtCode);
    setWards(data);
  };

  // Form actions
  const onAddNew = () => {
    setCurrentAddress(null);
    setShowForm(true);
  };

  const onEdit = (addr: Address) => {
    setCurrentAddress(addr);
    setShowForm(true);
  };

  const onCancel = () => setShowForm(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const getNameByCode = (list: any[], code: string) => list.find(i => i.code == code)?.name || "";
    
    const cityCode = formData.get('city') as string;
    const districtCode = formData.get('district') as string;
    const wardCode = formData.get('ward') as string;
    
    const newAddress: Omit<Address, "id"> = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: cityCode,
      cityName: getNameByCode(provinces, cityCode),
      district: districtCode,
      districtName: getNameByCode(districts, districtCode),
      ward: wardCode,
      wardName: getNameByCode(wards, wardCode),
      isDefault: formData.get('isDefault') === 'on'
    };
    
    if (currentAddress) {
      // Update existing address
      updateAddress(currentAddress.id, newAddress);
      
      // If setting as default, update all other addresses
      if (newAddress.isDefault && !currentAddress.isDefault) {
        const otherAddresses = addresses.filter(a => a.id !== currentAddress.id);
        otherAddresses.forEach(a => {
          if (a.isDefault) updateAddress(a.id, { isDefault: false });
        });
      }
    } else {
      // Add new address
      addAddress(newAddress);
      
      // If setting as default, update all other addresses
      if (newAddress.isDefault) {
        addresses.forEach(a => {
          if (a.isDefault) updateAddress(a.id, { isDefault: false });
        });
      }
    }
    
    setShowForm(false);
  };

  // ===== AVATAR MANAGEMENT =====
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      // Trong một ứng dụng thực tế, bạn sẽ tải lên file này lên server
      // Ở đây chúng ta sẽ giả lập bằng cách chuyển đổi file thành base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        // Cập nhật avatar trong dữ liệu chỉnh sửa
        setEditData(prev => ({
          ...prev,
          avatar: base64String
        }));
        
        setIsUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
      
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setIsUploadingAvatar(false);
      showToast("my_account_page.toasts.avatar_upload_error", "error");
    }
};

  const resetToGoogleAvatar = () => {
    if (userData.loginMethod === "google") {
      const googleAvatar = localStorage.getItem("googleAvatar");
      if (googleAvatar) {
        setEditData(prev => ({
          ...prev,
          avatar: googleAvatar
        }));
        showToast("my_account_page.toasts.avatar_reset_success");
      }
    }
  };

  // ===== PROFILE MANAGEMENT =====
  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Gọi API cập nhật thông tin người dùng
      const response = await axios.put(
        `${API_URL}/users/profile`, 
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedUserData = response.data;
      
      // Cập nhật thông tin người dùng trong state và localStorage
      setUserData({
        ...updatedUserData,
        avatar: editData.avatar, // Giữ lại avatar đã chọn
        loginMethod: userData.loginMethod
      });
      
      localStorage.setItem("userData", JSON.stringify({
        ...updatedUserData,
        avatar: editData.avatar,
        loginMethod: userData.loginMethod
      }));
      
      setIsEditing(false);
      showToast("my_account_page.toasts.profile_update_success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("my_account_page.toasts.profile_update_error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  // ===== AUTHENTICATION =====
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("loginMethod");
    localStorage.removeItem("googleAvatar");
    localStorage.removeItem("loginTimestamp");
    navigate("/");
  };

  // ===== RETURN VALUES =====
  return {
    userData,
    editData,
    setEditData,
    isEditing,
    setIsEditing,
    isLoading,
    isUploadingAvatar,
    fileInputRef,
    handleAvatarClick,
    handleAvatarUpload,
    resetToGoogleAvatar,
    handleSaveProfile,
    handleCancelEdit,
    handleLogout,
    SIDEBAR_ITEMS,
    orders,
    addresses,
    showForm,
    currentAddress,
    provinces,
    districts,
    wards,
    handleProvinceChange,
    handleDistrictChange,
    onAddNew,
    onEdit,
    onCancel,
    handleSubmit,
    deleteAddress,
    setDefaultAddress,
    getStatusBadge,
    formatCurrency,
    formatDate,
    getInitials
  };
}; 