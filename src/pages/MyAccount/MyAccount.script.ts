import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProvinces, getDistricts, getWards } from "../Checkout/Checkout.script";

// ===== TYPES & INTERFACES =====
export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  googleId?: string;
  loginMethod?: "email" | "google";
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
  { key: "profile", icon: "User", label: "Thông tin cá nhân" },
  { key: "orders", icon: "Package", label: "Đơn hàng" },
  { key: "address", icon: "MapPin", label: "Địa chỉ giao hàng" },
  { key: "settings", icon: "Settings", label: "Cài đặt" },
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
  switch (status) {
    case "delivered":
      return { text: "Đã giao", className: "bg-green-100 text-green-800" };
    case "processing":
      return { text: "Đang xử lý", className: "bg-blue-100 text-blue-800" };
    case "cancelled":
      return { text: "Đã hủy", className: "bg-red-100 text-red-800" };
    case "pending":
      return { text: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" };
    default:
      return { text: "Chờ xử lý", className: "bg-gray-100 text-gray-800" };
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
  toast.textContent = message;
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
    address: "",
    avatar: "https://via.placeholder.com/100"
  });

  // Địa chỉ giao hàng (nhiều địa chỉ)
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserData>(userData);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // ===== AUTHENTICATION & DATA LOADING =====
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        navigate("/");
        return;
      }

      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        const loginMethod = localStorage.getItem("loginMethod") || "email";
        
        // Nếu là Google, kiểm tra timeout 24h
        if (loginMethod === "google") {
          const loginTimestamp = localStorage.getItem("loginTimestamp");
          if (loginTimestamp) {
            const now = Date.now();
            const loginTime = parseInt(loginTimestamp, 10);
            const hours24 = 24 * 60 * 60 * 1000;
            if (now - loginTime > hours24) {
              // Hết hạn, tự động đăng xuất
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userData");
              localStorage.removeItem("loginMethod");
              localStorage.removeItem("googleAvatar");
              localStorage.removeItem("loginTimestamp");
              navigate("/");
              return;
            }
          }
        }
        
        if (loginMethod === "google" && parsedUserData.googleId) {
          const googleAvatar = localStorage.getItem("googleAvatar");
          if (googleAvatar) {
            parsedUserData.avatar = googleAvatar;
          }
        }
        
        setUserData(prev => ({
          ...prev,
          ...parsedUserData,
          loginMethod: loginMethod as "email" | "google"
        }));
        setEditData(prev => ({
          ...prev,
          ...parsedUserData,
          loginMethod: loginMethod as "email" | "google"
        }));
      }
    };

    checkAuth();
  }, [navigate]);

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
    showToast("Đã thêm địa chỉ mới!");
  };

  // Sửa địa chỉ
  const updateAddress = (id: string, updated: Partial<Address>) => {
    const newAddresses = addresses.map(addr =>
      addr.id === id ? { ...addr, ...updated } : addr
    );
    saveAddresses(newAddresses);
    showToast("Đã cập nhật địa chỉ!");
  };

  // Xóa địa chỉ
  const deleteAddress = (id: string) => {
    let newAddresses = addresses.filter(addr => addr.id !== id);
    // Nếu xóa địa chỉ mặc định, gán mặc định cho địa chỉ đầu tiên còn lại
    if (!newAddresses.some(addr => addr.isDefault) && newAddresses.length > 0) {
      newAddresses[0].isDefault = true;
    }
    saveAddresses(newAddresses);
    showToast("Đã xóa địa chỉ!");
  };

  // Chọn địa chỉ mặc định
  const setDefaultAddress = (id: string) => {
    const newAddresses = addresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
    saveAddresses(newAddresses);
    showToast("Đã chọn địa chỉ mặc định!");
  };

  // ===== MODAL LOCATION LOGIC =====
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: ""
  });
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load provinces on open form
  useEffect(() => {
    if (showForm) {
      setLoadingProvinces(true);
      getProvinces().then(data => {
        setProvinces(data);
        setLoadingProvinces(false);
      });
    }
  }, [showForm]);

  // Load districts when city changes
  useEffect(() => {
    if (form.city) {
      setLoadingDistricts(true);
      getDistricts(form.city).then(data => {
        setDistricts(data);
        setLoadingDistricts(false);
      });
    } else {
      setDistricts([]);
      setForm(f => ({ ...f, district: "", ward: "" }));
    }
  }, [form.city]);

  // Load wards when district changes
  useEffect(() => {
    if (form.district) {
      setLoadingWards(true);
      getWards(form.district).then(data => {
        setWards(data);
        setLoadingWards(false);
      });
    } else {
      setWards([]);
      setForm(f => ({ ...f, ward: "" }));
    }
  }, [form.district]);

  // Reset form when closing
  useEffect(() => {
    if (!showForm) {
      setEditId(null);
      setForm({ fullName: "", phone: "", address: "", city: "", district: "", ward: "" });
      setProvinces([]);
      setDistricts([]);
      setWards([]);
    }
  }, [showForm]);

  const onAddNew = () => {
    setEditId(null);
    setShowForm(true);
  };
  const onEdit = (addr: any) => {
    setEditId(addr.id);
    setForm({ ...addr });
    setShowForm(true);
  };
  const onCancel = () => setShowForm(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Lấy tên từ danh sách dropdown
    const getNameByCode = (list: any[], code: string) => list.find(i => i.code == code)?.name || "";
    const cityName = getNameByCode(provinces, form.city);
    const districtName = getNameByCode(districts, form.district);
    const wardName = getNameByCode(wards, form.ward);
    const addressWithNames = {
      ...form,
      cityName,
      districtName,
      wardName,
    };
    // Log giá trị form để chuẩn bị cho call API sau này
    console.log("Form submit:", addressWithNames);

    if (editId) {
      updateAddress(editId, addressWithNames);
    } else {
      addAddress(addressWithNames);
    }
    setShowForm(false);
  };

  const modalProps = {
    open: showForm,
    onOpenChange: setShowForm,
    form,
    setForm,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    provinces,
    districts,
    wards,
    handleSubmit,
    editId,
    onCancel,
    onAddNew,
    onEdit,
  };

  // ===== AVATAR HANDLERS =====
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Vui lòng chọn file hình ảnh (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước file không được vượt quá 5MB', 'error');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData(prev => ({
          ...prev,
          avatar: result
        }));
        setIsUploadingAvatar(false);
        showToast('Avatar đã được cập nhật thành công!');
      };
      reader.onerror = () => {
        showToast('Có lỗi xảy ra khi đọc file', 'error');
        setIsUploadingAvatar(false);
      };
      reader.readAsDataURL(file);

      // TODO: Upload to server
      // const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await fetch('/api/upload-avatar', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // setEditData(prev => ({
      //   ...prev,
      //   avatar: data.avatarUrl
      // }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast('Có lỗi xảy ra khi tải lên avatar', 'error');
      setIsUploadingAvatar(false);
    }
  };

  const resetToGoogleAvatar = () => {
    const googleAvatar = localStorage.getItem("googleAvatar");
    if (googleAvatar) {
      setEditData(prev => ({
        ...prev,
        avatar: googleAvatar
      }));
      showToast('Đã khôi phục avatar Google!');
    } else {
      showToast('Không tìm thấy avatar Google', 'error');
    }
  };

  // ===== PROFILE HANDLERS =====
  const handleSaveProfile = async () => {
    try {
      console.log("Updating profile:", editData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(editData);
      setIsEditing(false);
      
      localStorage.setItem("userData", JSON.stringify(editData));
      
      showToast('Thông tin cá nhân đã được cập nhật thành công!');
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast('Có lỗi xảy ra khi cập nhật thông tin', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  // ===== AUTHENTICATION HANDLERS =====
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("loginMethod");
    localStorage.removeItem("googleAvatar");
    
    navigate("/");
  };

  // ===== RETURN VALUES =====
  return {
    // State
    userData,
    editData,
    setEditData,
    orders,
    isEditing,
    setIsEditing,
    isUploadingAvatar,
    fileInputRef,
    addresses,

    // Constants
    SIDEBAR_ITEMS,
    
    // Handlers
    handleAvatarClick,
    handleAvatarUpload,
    resetToGoogleAvatar,
    handleSaveProfile,
    handleCancelEdit,
    handleLogout,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    
    // Utilities
    getStatusBadge,
    formatCurrency,
    formatDate,
    getInitials,
    showToast,

    // Modal location props
    modalProps,
  };
}; 