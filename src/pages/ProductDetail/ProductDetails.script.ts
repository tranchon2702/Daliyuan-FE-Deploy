import { useState } from "react";
import { useParams } from "react-router-dom";
import chocolateCakeImg from "@/assets/chocolate-cake.jpg";
import blackForestImg from "@/assets/black-forest.jpg";
import tiramisuImg from "@/assets/tiramisu.jpg";

// Types for TypeScript support
export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  images: string[];
  inStock: boolean;
  category: string;
  ingredients: string[];
  nutritionInfo: string;
  weight: string;
  serves: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: string;
  image: string;
}

export const useProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app this would come from API
  const product: Product = {
    id: id || "1",
    name: "Black Forest Hộp Thiếc",
    price: "399,600VND",
    originalPrice: "450,000VND",
    description: "Bánh Black Forest hộp thiếc cao cấp với lớp kem tươi mềm mịn, cherry tươi và chocolate đen Bỉ nguyên chất. Được đóng gói trong hộp thiếc sang trọng, thích hợp làm quà tặng.",
    images: [blackForestImg, chocolateCakeImg, tiramisuImg],
    inStock: true,
    category: "Bánh Hộp Thiếc",
    ingredients: ["Kem tươi", "Cherry tươi", "Chocolate đen Bỉ", "Bánh quy", "Rượu rum"],
    nutritionInfo: "Calories: 350 per serving",
    weight: "500g",
    serves: "4-6 người",
  };

  const relatedProducts: RelatedProduct[] = [
    {
      id: "2",
      name: "Chocolate Dream Cake",
      price: "243,000VND",
      image: chocolateCakeImg,
    },
    {
      id: "3",
      name: "Tiramisu Classic",
      price: "156,000VND",
      image: tiramisuImg,
    },
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
    console.log(`Adding ${quantity} of ${product.name} to cart`);
  };

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist logic
    console.log(`Adding ${product.name} to wishlist`);
  };

  const handleWriteReview = () => {
    // TODO: Implement write review logic
    console.log("Opening review form");
  };

  return {
    product,
    relatedProducts,
    quantity,
    selectedImage,
    handleQuantityChange,
    handleImageSelect,
    handleAddToCart,
    handleAddToWishlist,
    handleWriteReview,
  };
}; 