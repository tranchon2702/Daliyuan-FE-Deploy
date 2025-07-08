// Cart business logic and utilities
import chocolateCakeImg from "@/assets/chocolate-cake.jpg";
import blackForestImg from "@/assets/black-forest.jpg";
import tiramisuImg from "@/assets/tiramisu.jpg";

// Types
export const CartItem = {
  id: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String
};

// Initial cart data
export const initialCartItems = [
  {
    id: "1",
    name: "Black Forest Hộp Thiếc",
    price: 399600,
    quantity: 2,
    image: blackForestImg,
  },
  {
    id: "2",
    name: "Chocolate Dream Cake",
    price: 243000,
    quantity: 1,
    image: chocolateCakeImg,
  },
  {
    id: "3",
    name: "Tiramisu Classic",
    price: 156000,
    quantity: 3,
    image: tiramisuImg,
  },
];

// Constants
export const SHIPPING_FEE = 30000; // 30,000 VND
export const FREE_SHIPPING_THRESHOLD = 500000; // 500,000 VND
export const PAYMENT_METHODS = ["visa", "mastercard", "momo", "zalopay"];

// Utility functions
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'VND';
};

export const calculateSubtotal = (cartItems) => {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const calculateShipping = (subtotal) => {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
};

export const calculateDiscount = (promoCode, subtotal) => {
  // Simple discount logic - can be expanded
  if (promoCode.toLowerCase() === 'save10') {
    return Math.round(subtotal * 0.1);
  }
  if (promoCode.toLowerCase() === 'save20') {
    return Math.round(subtotal * 0.2);
  }
  return 0;
};

export const calculateTotal = (cartItems, promoCode = '') => {
  const subtotal = calculateSubtotal(cartItems);
  const shipping = calculateShipping(subtotal);
  const discount = calculateDiscount(promoCode, subtotal);
  return subtotal + shipping - discount;
};

// Cart management functions
export const updateCartItemQuantity = (cartItems, id, newQuantity) => {
  if (newQuantity <= 0) {
    return removeCartItem(cartItems, id);
  }
  return cartItems.map(item =>
    item.id === id ? { ...item, quantity: newQuantity } : item
  );
};

export const removeCartItem = (cartItems, id) => {
  return cartItems.filter(item => item.id !== id);
};

export const addCartItem = (cartItems, newItem) => {
  const existingItem = cartItems.find(item => item.id === newItem.id);
  if (existingItem) {
    return updateCartItemQuantity(cartItems, newItem.id, existingItem.quantity + 1);
  }
  return [...cartItems, { ...newItem, quantity: 1 }];
};

export const clearCart = () => {
  return [];
};

// Validation functions
export const validatePromoCode = (promoCode) => {
  const validCodes = ['save10', 'save20', 'freeship'];
  return validCodes.includes(promoCode.toLowerCase());
};

export const isCartEmpty = (cartItems) => {
  return cartItems.length === 0;
};

export const getCartItemCount = (cartItems) => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// Local storage functions
export const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialCartItems;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return initialCartItems;
  }
};

// Export all functions as default object
export default {
  // Data
  initialCartItems,
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  PAYMENT_METHODS,
  
  // Utility functions
  formatPrice,
  calculateSubtotal,
  calculateShipping,
  calculateDiscount,
  calculateTotal,
  
  // Cart management
  updateCartItemQuantity,
  removeCartItem,
  addCartItem,
  clearCart,
  
  // Validation
  validatePromoCode,
  isCartEmpty,
  getCartItemCount,
  
  // Storage
  saveCartToStorage,
  loadCartFromStorage
};
