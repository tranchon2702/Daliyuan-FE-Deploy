/**
 * Tiện ích hỗ trợ xử lý ảnh và chọn kích thước phù hợp
 */

/**
 * Lấy URL ảnh phù hợp dựa trên kích thước hiển thị
 * @param {Object} imageVariants - Đối tượng chứa các biến thể ảnh
 * @param {number} width - Chiều rộng hiển thị
 * @param {boolean} supportsWebp - Trình duyệt có hỗ trợ WebP không
 * @returns {string} URL của ảnh phù hợp
 */
export const getResponsiveImageUrl = (imageVariants, width, supportsWebp = true) => {
  if (!imageVariants) return '/placeholder.svg';
  
  // Nếu không có biến thể ảnh, trả về ảnh gốc hoặc placeholder
  if (!imageVariants.original) {
    return '/placeholder.svg';
  }
  
  // Chọn định dạng phù hợp
  if (supportsWebp) {
    // Chọn kích thước phù hợp với WebP
    if (width <= 150) {
      return imageVariants.thumbnailWebp || imageVariants.webp || imageVariants.original;
    } else {
      return imageVariants.mediumWebp || imageVariants.webp || imageVariants.original;
    }
  } else {
    // Nếu không hỗ trợ WebP, sử dụng ảnh gốc
    return imageVariants.original;
  }
};

/**
 * Kiểm tra trình duyệt có hỗ trợ WebP không
 * @returns {Promise<boolean>} Promise trả về true nếu trình duyệt hỗ trợ WebP
 */
export const checkWebpSupport = async () => {
  if (!window || !window.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  try {
    return await createImageBitmap(blob).then(() => true, () => false);
  } catch (e) {
    return false;
  }
};

/**
 * Hook React để lấy ảnh phù hợp
 * @param {Object} product - Sản phẩm chứa thông tin ảnh
 * @param {string} size - Kích thước hiển thị ('thumbnail' hoặc 'medium')
 * @param {boolean} useWebp - Có sử dụng WebP nếu hỗ trợ không
 * @returns {string} URL của ảnh phù hợp
 */
export const getOptimalImageUrl = (product, size = 'medium', useWebp = true) => {
  if (!product) return '/placeholder.svg';
  
  // Nếu sản phẩm không có imageVariants, trả về mainImage
  if (!product.imageVariants || product.imageVariants.length === 0) {
    return product.mainImage || '/placeholder.svg';
  }
  
  // Lấy biến thể ảnh đầu tiên
  const imageVariant = product.imageVariants[0];
  
  // Nếu không có biến thể ảnh, trả về mainImage
  if (!imageVariant) {
    return product.mainImage || '/placeholder.svg';
  }
  
  // Chọn ảnh phù hợp dựa trên kích thước và định dạng
  if (useWebp) {
    if (size === 'thumbnail') {
      return imageVariant.thumbnailWebp || imageVariant.webp || imageVariant.original || product.mainImage || '/placeholder.svg';
    } else {
      return imageVariant.mediumWebp || imageVariant.webp || imageVariant.original || product.mainImage || '/placeholder.svg';
    }
  } else {
    return imageVariant.original || product.mainImage || '/placeholder.svg';
  }
};

/**
 * Hàm tạo srcSet cho thẻ img
 * @param {Object} imageVariants - Đối tượng chứa các biến thể ảnh
 * @param {boolean} useWebp - Có sử dụng WebP nếu hỗ trợ không
 * @returns {string} srcSet attribute
 */
export const generateSrcSet = (imageVariants, useWebp = true) => {
  if (!imageVariants) return '';
  
  const srcSetArray = [];
  
  if (useWebp) {
    if (imageVariants.thumbnailWebp) {
      srcSetArray.push(`${imageVariants.thumbnailWebp} 150w`);
    }
    
    if (imageVariants.mediumWebp) {
      srcSetArray.push(`${imageVariants.mediumWebp} 600w`);
    }
    
    if (imageVariants.webp) {
      srcSetArray.push(`${imageVariants.webp} 1200w`);
    }
  } else {
    if (imageVariants.original) {
      srcSetArray.push(`${imageVariants.original} 1200w`);
    }
  }
  
  return srcSetArray.join(', ');
};

/**
 * Hàm tạo sizes attribute cho thẻ img
 * @param {string} defaultSize - Kích thước mặc định
 * @returns {string} sizes attribute
 */
export const generateSizes = (defaultSize = '100vw') => {
  return `(max-width: 768px) 100vw, ${defaultSize}`;
};

export default {
  getResponsiveImageUrl,
  checkWebpSupport,
  getOptimalImageUrl,
  generateSrcSet,
  generateSizes
}; 