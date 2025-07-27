import { Product } from './productService';

export interface CartItem {
  _id: string;
  name: string;
  nameZh?: string;
  price: number;
  quantity: number;
  image: string;
  unitType: string;
  product: string | Product;
}

// Hàm để thông báo cập nhật giỏ hàng
export const dispatchCartUpdatedEvent = () => {
  window.dispatchEvent(new Event('cartUpdated'));
};

// Helper để lấy key lưu giỏ hàng
const getCartKey = (userId?: string) => userId ? `cart_user_${userId}` : 'cart_guest';

// Lưu giỏ hàng vào localStorage
export const saveCartToLocalStorage = (cartItems: CartItem[], userId?: string) => {
  localStorage.setItem(getCartKey(userId), JSON.stringify(cartItems));
  dispatchCartUpdatedEvent();
};

// Lấy giỏ hàng từ localStorage
export const getCartFromLocalStorage = (userId?: string): CartItem[] => {
  const cartItems = localStorage.getItem(getCartKey(userId));
  return cartItems ? JSON.parse(cartItems) : [];
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (
  product: Product,
  quantity: number,
  unitType: string,
  userId?: string
): CartItem[] => {
  const cartItems = getCartFromLocalStorage(userId);
  
  // Tìm giá của unitType
  const unitOption = product.unitOptions.find(option => option.unitType === unitType);
  const price = unitOption ? unitOption.price : product.price;
  
  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const existItem = cartItems.find(
    item => item.product === product._id && item.unitType === unitType
  );

  if (existItem) {
    // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
    const updatedCartItems = cartItems.map(item =>
      item.product === product._id && item.unitType === unitType
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
    saveCartToLocalStorage(updatedCartItems, userId);
    return updatedCartItems;
  } else {
    // Thêm sản phẩm mới vào giỏ hàng
    const newItem: CartItem = {
      _id: `${product._id}-${unitType}`,
      name: product.name,
      nameZh: product.nameZh,
      price,
      quantity,
      image: product.mainImage,
      unitType,
      product: product._id
    };
    
    const updatedCartItems = [...cartItems, newItem];
    saveCartToLocalStorage(updatedCartItems, userId);
    return updatedCartItems;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = (
  itemId: string,
  quantity: number,
  userId?: string
): CartItem[] => {
  const cartItems = getCartFromLocalStorage(userId);
  
  if (quantity <= 0) {
    // Xóa sản phẩm khỏi giỏ hàng nếu số lượng <= 0
    const updatedCartItems = cartItems.filter(item => item._id !== itemId);
    saveCartToLocalStorage(updatedCartItems, userId);
    return updatedCartItems;
  } else {
    // Cập nhật số lượng
    const updatedCartItems = cartItems.map(item =>
      item._id === itemId ? { ...item, quantity } : item
    );
    saveCartToLocalStorage(updatedCartItems, userId);
    return updatedCartItems;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (itemId: string, userId?: string): CartItem[] => {
  const cartItems = getCartFromLocalStorage(userId);
  const updatedCartItems = cartItems.filter(item => item._id !== itemId);
  saveCartToLocalStorage(updatedCartItems, userId);
  return updatedCartItems;
};

// Xóa toàn bộ giỏ hàng
export const clearCart = (userId?: string): CartItem[] => {
  saveCartToLocalStorage([], userId);
  return [];
};

// Tính tổng tiền giỏ hàng
export const getCartTotal = (cartItems: CartItem[], userId?: string): number => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Tính tổng số lượng sản phẩm trong giỏ hàng
export const getCartItemsCount = (cartItems: CartItem[], userId?: string): number => {
  return cartItems.reduce((count, item) => count + item.quantity, 0);
}; 