// Checkout business logic and utilities
import { loadCartFromStorage, formatPrice, calculateSubtotal, calculateShipping, calculateTotal } from "../Cart/Cart.script.js";

// Re-export functions from Cart script for use in Checkout component
export { formatPrice, calculateSubtotal, calculateShipping, calculateTotal };

/**
 * ===== CHECKOUT LOGGING SYSTEM =====
 * 
 * This system logs ONE complete order data object when user clicks "Đặt hàng" button.
 * Simple and clean - just one console.log with all the data.
 * 
 * Usage:
 * - Fill out the checkout form normally
 * - Click "Đặt hàng" button
 * - Check console for "🚀 ORDER DATA FOR API:" - that's your complete data
 * 
 * Console Log (ONLY when submitting):
 * 🚀 ORDER DATA FOR API: { complete order object }
 * 
 * The logged object contains:
 * - orderId, timestamp
 * - customerInfo (main + other shipping)
 * - items (cart items with details)
 * - payment (method, totals, agreeTerms)
 * - metadata (session, userAgent, etc.)
 */

// Constants
export const TAX_RATE = 0.1; // 10% VAT
export const HOTLINE = "1800.8287";
export const DELIVERY_TIMES = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// API endpoints for Vietnamese administrative data
const API_BASE_URL = "https://provinces.open-api.vn/api";

// Cache for API data
let provincesCache = null;
let districtsCache = {};
let wardsCache = {};

// ===== LOGGING AND DATA PROCESSING FUNCTIONS =====

// Log shipping information changes
export const logShippingInfoChange = (field, value, type = 'main') => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    type: 'shipping_info_change',
    field,
    value,
    infoType: type, // 'main' or 'other'
    sessionId: sessionStorage.getItem('checkout_session_id') || 'unknown'
  };
  
  console.log('🛒 Shipping Info Change:', logData);
  
  // Store in session for debugging
  const changes = JSON.parse(sessionStorage.getItem('shipping_changes') || '[]');
  changes.push(logData);
  sessionStorage.setItem('shipping_changes', JSON.stringify(changes));
  
  return logData;
};

// Process and validate shipping information
export const processShippingInfo = (shippingInfo, otherShippingInfo) => {
  const timestamp = new Date().toISOString();
  
  // Get location names from codes
  const getLocationNames = (provinceCode, districtCode, wardCode, provinces, districts, wards) => {
    const province = provinces.find(p => p.code == provinceCode);
    const district = districts.find(d => d.code == districtCode);
    const ward = wards.find(w => w.code == wardCode);
    
    return {
      provinceName: province?.name || 'Unknown',
      districtName: district?.name || 'Unknown', 
      wardName: ward?.name || 'Unknown'
    };
  };

  // Process main shipping info
  const mainShipping = {
    ...shippingInfo,
    locationNames: getLocationNames(
      shippingInfo.city, 
      shippingInfo.district, 
      shippingInfo.ward,
      provincesCache || [],
      districtsCache[shippingInfo.city] || [],
      wardsCache[shippingInfo.district] || []
    ),
    processedAt: timestamp
  };

  // Process other shipping info if exists
  let processedOtherShipping = null;
  if (shippingInfo.otherAddress === 'true' && otherShippingInfo) {
    processedOtherShipping = {
      ...otherShippingInfo,
      locationNames: getLocationNames(
        otherShippingInfo.city,
        otherShippingInfo.district, 
        otherShippingInfo.ward,
        provincesCache || [],
        districtsCache[otherShippingInfo.city] || [],
        wardsCache[otherShippingInfo.district] || []
      ),
      processedAt: timestamp
    };
  }

  const processedData = {
    mainShipping,
    otherShipping: processedOtherShipping,
    hasOtherAddress: shippingInfo.otherAddress === 'true',
    timestamp,
    validation: {
      isValid: validateForm(shippingInfo, otherShippingInfo).length === 0,
      errors: validateForm(shippingInfo, otherShippingInfo)
    }
  };
  
  // Store processed data for API call
  sessionStorage.setItem('processed_shipping_data', JSON.stringify(processedData));
  
  return processedData;
};

// Prepare data for API submission
export const prepareOrderDataForAPI = (shippingInfo, otherShippingInfo, cartItems, paymentMethod) => {
  const processedShipping = processShippingInfo(shippingInfo, otherShippingInfo);
  
  const orderData = {
    orderId: `ORDER-${Date.now()}`,
    customerInfo: {
      main: processedShipping.mainShipping,
      other: processedShipping.otherShipping,
      hasOtherAddress: processedShipping.hasOtherAddress
    },
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
      image: item.image
    })),
    payment: {
      method: paymentMethod,
      subtotal: calculateSubtotal(cartItems),
      shipping: calculateShipping(calculateSubtotal(cartItems)),
      tax: calculateTax(calculateSubtotal(cartItems)),
      total: calculateCheckoutTotal(cartItems)
    },
    metadata: {
      createdAt: new Date().toISOString(),
      sessionId: sessionStorage.getItem('checkout_session_id') || 'unknown',
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    }
  };

  console.log('🚀 Order Data Prepared for API:', orderData);
  
  // Store for debugging
  sessionStorage.setItem('order_data_for_api', JSON.stringify(orderData));
  
  return orderData;
};

// Log form validation results
export const logFormValidation = (shippingInfo, otherShippingInfo) => {
  const validation = validateForm(shippingInfo, otherShippingInfo);
  const timestamp = new Date().toISOString();
  
  const validationLog = {
    timestamp,
    type: 'form_validation',
    isValid: validation.length === 0,
    errors: validation,
    missingFields: validateRequiredFields(shippingInfo, otherShippingInfo),
    hasOtherAddress: shippingInfo.otherAddress === 'true',
    sessionId: sessionStorage.getItem('checkout_session_id') || 'unknown'
  };
  
  console.log('✅ Form Validation:', validationLog);
  
  // Store validation history
  const validations = JSON.parse(sessionStorage.getItem('validation_history') || '[]');
  validations.push(validationLog);
  sessionStorage.setItem('validation_history', JSON.stringify(validations));
  
  return validationLog;
};

// Initialize checkout session
export const initializeCheckoutSession = () => {
  const sessionId = `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('checkout_session_id', sessionId);
  
  const sessionData = {
    sessionId,
    startedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer
  };
  
  console.log('🎯 Checkout Session Started:', sessionData);
  sessionStorage.setItem('checkout_session_data', JSON.stringify(sessionData));
  
  return sessionId;
};

// API functions
export const fetchProvinces = async () => {
  if (provincesCache) return provincesCache;
  try {
    const response = await fetch(`${API_BASE_URL}/p/`);
    const data = await response.json();
    provincesCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

export const fetchDistricts = async (provinceCode) => {
  if (districtsCache[provinceCode]) return districtsCache[provinceCode];
  
  try {
    const response = await fetch(`${API_BASE_URL}/p/${provinceCode}?depth=2`);
    const data = await response.json();
    districtsCache[provinceCode] = data.districts || [];
    return data.districts || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

export const fetchWards = async (districtCode) => {
  if (wardsCache[districtCode]) return wardsCache[districtCode];
  
  try {
    const response = await fetch(`${API_BASE_URL}/d/${districtCode}?depth=2`);
    const data = await response.json();
    wardsCache[districtCode] = data.wards || [];
    return data.wards || [];
  } catch (error) {
    console.error('Error fetching wards:', error);
    return [];
  }
};

// Fallback data (if API fails)
export const FALLBACK_PROVINCES = [
  { code: 1, name: "Hà Nội" },
  { code: 79, name: "Hồ Chí Minh" },
  { code: 48, name: "Đà Nẵng" },
  { code: 92, name: "Cần Thơ" },
  { code: 31, name: "Hải Phòng" },
  { code: 56, name: "Khánh Hòa" },
  { code: 46, name: "Thừa Thiên Huế" },
  { code: 77, name: "Bà Rịa - Vũng Tàu" },
  { code: 74, name: "Lâm Đồng" },
  { code: 60, name: "Bình Dương" }
];

export const FALLBACK_DISTRICTS = {
  1: [ // Hà Nội
    { code: 1, name: "Quận Ba Đình" },
    { code: 2, name: "Quận Hoàn Kiếm" },
    { code: 3, name: "Quận Hai Bà Trưng" },
    { code: 4, name: "Quận Đống Đa" },
    { code: 5, name: "Quận Tây Hồ" },
    { code: 6, name: "Quận Cầu Giấy" },
    { code: 7, name: "Quận Thanh Xuân" },
    { code: 8, name: "Quận Hoàng Mai" },
    { code: 9, name: "Quận Long Biên" },
    { code: 16, name: "Quận Nam Từ Liêm" },
    { code: 17, name: "Quận Bắc Từ Liêm" },
    { code: 18, name: "Quận Hà Đông" }
  ],
  79: [ // Hồ Chí Minh
    { code: 760, name: "Quận 1" },
    { code: 761, name: "Quận 12" },
    { code: 762, name: "Quận Thủ Đức" },
    { code: 763, name: "Quận 9" },
    { code: 764, name: "Quận Gò Vấp" },
    { code: 765, name: "Quận Bình Thạnh" },
    { code: 766, name: "Quận Tân Bình" },
    { code: 767, name: "Quận Tân Phú" },
    { code: 768, name: "Quận Phú Nhuận" },
    { code: 769, name: "Quận 2" },
    { code: 770, name: "Quận 3" },
    { code: 771, name: "Quận 10" },
    { code: 772, name: "Quận 11" },
    { code: 773, name: "Quận 4" },
    { code: 774, name: "Quận 5" },
    { code: 775, name: "Quận 6" },
    { code: 776, name: "Quận 8" },
    { code: 777, name: "Quận Bình Tân" },
    { code: 778, name: "Quận 7" },
    { code: 783, name: "Huyện Củ Chi" },
    { code: 784, name: "Huyện Hóc Môn" },
    { code: 785, name: "Huyện Bình Chánh" },
    { code: 786, name: "Huyện Nhà Bè" },
    { code: 787, name: "Huyện Cần Giờ" }
  ]
};

// Initial state
export const initialShippingInfo = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  district: "",
  ward: "",
  postalCode: "",
  deliveryDate: "",
  deliveryTime: "",
  otherAddress: "",
  orderNote: ""
};

export const initialOtherShippingInfo = {
  fullName: "",
  phone: "",
  city: "",
  district: "",
  ward: "",
  address: ""
};

// Utility functions
export const getCartItems = () => {
  return loadCartFromStorage();
};

export const calculateTax = (subtotal) => {
  return Math.round(subtotal * TAX_RATE);
};

export const calculateCheckoutTotal = (cartItems, promoCode = '') => {
  const subtotal = calculateSubtotal(cartItems);
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  return subtotal + shipping + tax;
};

// Location data functions
export const getProvinces = async () => {
    try {
      const provinces = await fetchProvinces();
      return provinces.length > 0 ? provinces : FALLBACK_PROVINCES;
    } catch (error) {
      console.error('Error getting provinces:', error);
      return FALLBACK_PROVINCES;
    }
  };

export const getDistricts = async (provinceCode) => {
  if (!provinceCode) return [];
  
  try {
    const districts = await fetchDistricts(provinceCode);
    return districts.length > 0 ? districts : FALLBACK_DISTRICTS[provinceCode] || [];
  } catch (error) {
    console.error('Error getting districts:', error);
    return FALLBACK_DISTRICTS[provinceCode] || [];
  }
};

export const getWards = async (districtCode) => {
  if (!districtCode) return [];
  
  try {
    const wards = await fetchWards(districtCode);
    return wards;
  } catch (error) {
    console.error('Error getting wards:', error);
    return [];
  }
};

// Validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequiredFields = (shippingInfo, otherShippingInfo) => {
  const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'district', 'ward', 'deliveryDate', 'deliveryTime'];
  const missingFields = requiredFields.filter(field => !shippingInfo[field]);
  
  // Check other shipping info if enabled
  if (shippingInfo.otherAddress === 'true') {
    const otherRequiredFields = ['fullName', 'city', 'district', 'ward', 'address'];
    const missingOtherFields = otherRequiredFields.filter(field => !otherShippingInfo[field]);
    missingFields.push(...missingOtherFields.map(field => `other${field.charAt(0).toUpperCase() + field.slice(1)}`));
  }
  
  return missingFields;
};

export const validateForm = (shippingInfo, otherShippingInfo) => {
  const errors = [];
  
  // Check required fields
  const missingFields = validateRequiredFields(shippingInfo, otherShippingInfo);
  if (missingFields.length > 0) {
    errors.push(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
  }
  
  // Validate email
  if (shippingInfo.email && !validateEmail(shippingInfo.email)) {
    errors.push('Email không hợp lệ');
  }
  
  // Validate phone
  if (shippingInfo.phone && !validatePhone(shippingInfo.phone)) {
    errors.push('Số điện thoại không hợp lệ');
  }
  
  // Validate delivery date
  if (shippingInfo.deliveryDate) {
    const deliveryDate = new Date(shippingInfo.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deliveryDate < today) {
      errors.push('Ngày giao hàng không thể là ngày trong quá khứ');
    }
  }
  
  return errors;
};

// Form handling functions
export const handleInputChange = (shippingInfo, setShippingInfo, field, value) => {
  // Update state only - no logging here
  setShippingInfo(prev => ({ ...prev, [field]: value }));
};

export const handleOtherInputChange = (otherShippingInfo, setOtherShippingInfo, field, value) => {
  // Update state only - no logging here
  setOtherShippingInfo(prev => ({ ...prev, [field]: value }));
};

// Order processing functions
export const processOrder = async (shippingInfo, otherShippingInfo, cartItems, paymentMethod) => {
  try {
    // Get the logged order data from sessionStorage
    const loggedOrderData = sessionStorage.getItem('last_order_data');
    const orderData = loggedOrderData ? JSON.parse(loggedOrderData) : null;
    
    if (!orderData) {
      throw new Error('No order data found. Please submit the form first.');
    }
    
    console.log('🔄 Data trước khi call api:', orderData);
    
    // TODO: Replace this with actual API call
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(orderData)
    // });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful response
    const apiResponse = {
      success: true,
      orderId: orderData.orderId,
      status: 'pending',
      message: 'Order processed successfully'
    };
    
    console.log('✅ Order Processed Successfully:', apiResponse);
    
    return {
      success: true,
      orderId: orderData.orderId,
      data: orderData,
      apiResponse
    };
  } catch (error) {
    console.error('❌ Order Processing Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Local storage functions
export const saveShippingInfo = (shippingInfo) => {
  try {
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
  } catch (error) {
    console.error('Error saving shipping info:', error);
  }
};

export const loadShippingInfo = () => {
  try {
    const saved = localStorage.getItem('shippingInfo');
    return saved ? JSON.parse(saved) : initialShippingInfo;
  } catch (error) {
    console.error('Error loading shipping info:', error);
    return initialShippingInfo;
  }
};

// Component logic functions
export const initializeCheckoutData = () => {
  const items = getCartItems();
  const savedShippingInfo = loadShippingInfo();
  return { items, savedShippingInfo };
};

export const handleSubmitOrder = async (shippingInfo, otherShippingInfo, cartItems, paymentMethod, agreeTerms, toast, navigate) => {
  // Validate form first
  const errors = validateForm(shippingInfo, otherShippingInfo);
  if (errors.length > 0) {
    toast({
      title: "Thông tin chưa đầy đủ",
      description: errors.join('. '),
      variant: "destructive"
    });
    return false;
  }

  // ===== LOG TẤT CẢ DỮ LIỆU KHI ẤN "ĐẶT HÀNG" =====
  const subtotal = calculateSubtotal(cartItems);
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const total = calculateCheckoutTotal(cartItems);
  
  const orderData = {
    orderId: `ORDER-${Date.now()}`,
    timestamp: new Date().toISOString(),
    customerInfo: {
      main: {
        ...shippingInfo,
        phone: shippingInfo.phone ? `${shippingInfo.phone.substring(0, 3)}***${shippingInfo.phone.substring(7)}` : 'N/A'
      },
      ...(shippingInfo.otherAddress === 'true' && otherShippingInfo && {
        other: {
          ...otherShippingInfo,
          phone: otherShippingInfo.phone ? `${otherShippingInfo.phone.substring(0, 3)}***${otherShippingInfo.phone.substring(7)}` : 'N/A'
        }
      })
    },
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
      image: item.image
    })),
    payment: {
      method: paymentMethod,
      subtotal: formatPrice(subtotal),
      shipping: formatPrice(shipping),
      tax: formatPrice(tax),
      total: formatPrice(total),
      agreeTerms
    }
  };

  console.log('🚀 ORDER DATA FOR API:', orderData);
  
  // Store in sessionStorage for debugging
  sessionStorage.setItem('last_order_data', JSON.stringify(orderData));

  toast({
    title: "Đang xử lý đơn hàng...",
    description: "Chúng tôi đang xử lý thanh toán của bạn"
  });

  try {
    const result = await processOrder(shippingInfo, otherShippingInfo, cartItems, paymentMethod);
    
    if (result.success) {
      toast({
        title: "Đặt hàng thành công!",
        description: `Mã đơn hàng: ${result.orderId}`,
      });
      navigate("/payment-success");
      return true;
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Có lỗi xảy ra khi xử lý đơn hàng",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    toast({
      title: "Lỗi",
      description: "Có lỗi xảy ra khi xử lý đơn hàng",
      variant: "destructive"
    });
    return false;
  }
};

export const calculateOrderTotals = (cartItems) => {
  const subtotal = calculateSubtotal(cartItems);
  const shipping = 30000; // Fixed shipping for now
  const tax = calculateTax(subtotal);
  const total = calculateCheckoutTotal(cartItems);
  
  return { subtotal, shipping, tax, total };
};

// Export all functions as default object
export default {
  // Constants
  TAX_RATE,
  HOTLINE,
  DELIVERY_TIMES,
  
  // API functions
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  getProvinces,
  getDistricts,
  getWards,
  
  // Fallback data
  FALLBACK_PROVINCES,
  FALLBACK_DISTRICTS,
  
  // Initial state
  initialShippingInfo,
  initialOtherShippingInfo,
  
  // Utility functions
  getCartItems,
  calculateTax,
  calculateCheckoutTotal,
  
  // Validation
  validateEmail,
  validatePhone,
  validateRequiredFields,
  validateForm,
  
  // Form handling
  handleInputChange,
  handleOtherInputChange,
  
  // Order processing
  processOrder,
  
  // Storage
  saveShippingInfo,
  loadShippingInfo,
  
  // Component logic
  initializeCheckoutData,
  handleSubmitOrder,
  calculateOrderTotals,
  logShippingInfoChange,
  processShippingInfo,
  prepareOrderDataForAPI,
  logFormValidation,
  initializeCheckoutSession
};

// ===== DEBUG AND EXPORT FUNCTIONS =====

// Export all logged data for debugging
export const exportAllLoggedData = () => {
  const sessionId = sessionStorage.getItem('checkout_session_id');
  const sessionData = JSON.parse(sessionStorage.getItem('checkout_session_data') || '{}');
  const shippingChanges = JSON.parse(sessionStorage.getItem('shipping_changes') || '[]');
  const validationHistory = JSON.parse(sessionStorage.getItem('validation_history') || '[]');
  const processedShippingData = JSON.parse(sessionStorage.getItem('processed_shipping_data') || '{}');
  const orderDataForAPI = JSON.parse(sessionStorage.getItem('order_data_for_api') || '{}');
  
  const allData = {
    sessionId,
    sessionData,
    shippingChanges,
    validationHistory,
    processedShippingData,
    orderDataForAPI,
    exportTimestamp: new Date().toISOString()
  };
  
  console.log('📊 All Logged Data:', allData);
  
  // Create downloadable JSON file
  const dataStr = JSON.stringify(allData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `checkout-data-${sessionId}-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  return allData;
};

// Get logged order data for API call
export const getLoggedOrderData = () => {
  const loggedOrderData = sessionStorage.getItem('last_order_data');
  if (!loggedOrderData) {
    console.log('⚠️ No order data found. Please submit the form first.');
    return null;
  }
  
  const orderData = JSON.parse(loggedOrderData);
  console.log('📋 Retrieved logged order data for API:', orderData);
  return orderData;
};

// Get current checkout state for API
export const getCurrentCheckoutState = () => {
  const loggedOrderData = getLoggedOrderData();
  
  return {
    hasOrderData: !!loggedOrderData,
    orderData: loggedOrderData,
    timestamp: new Date().toISOString()
  };
};

// Clear all logged data
export const clearLoggedData = () => {
  sessionStorage.removeItem('checkout_session_id');
  sessionStorage.removeItem('checkout_session_data');
  sessionStorage.removeItem('shipping_changes');
  sessionStorage.removeItem('validation_history');
  sessionStorage.removeItem('processed_shipping_data');
  sessionStorage.removeItem('order_data_for_api');
  
  console.log('🧹 All logged data cleared');
};