import { useState } from "react";

export const contactInfo = [
  {
    icon: 'MapPin',
    title: 'Địa chỉ',
    details: [
      '123 Nguyễn Văn A, Quận 1, TP.HCM',
      '456 Lê Văn B, Quận 3, TP.HCM',
    ],
  },
  {
    icon: 'Phone',
    title: 'Điện thoại',
    details: [
      'Hotline: 0123 456 789',
      'Đặt hàng: 0987 654 321',
    ],
  },
  {
    icon: 'Mail',
    title: 'Email',
    details: [
      'info@the350f.com',
      'order@the350f.com',
    ],
  },
  {
    icon: 'Clock',
    title: 'Giờ mở cửa',
    details: [
      'Thứ 2 - Chủ nhật: 8:00 - 22:00',
      'Nghỉ lễ: 9:00 - 21:00',
    ],
  },
];

export const stores = [
  {
    name: 'Cửa hàng Quận 1',
    address: '123 Nguyễn Văn A, Quận 1, TP.HCM',
    phone: '0123 456 789',
    hours: '8:00 - 22:00',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
  },
  {
    name: 'Cửa hàng Quận 3',
    address: '456 Lê Văn B, Quận 3, TP.HCM',
    phone: '0987 654 321',
    hours: '8:00 - 22:00',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
  },
];

export const iconMap = {
  MapPin: 'MapPin',
  Phone: 'Phone',
  Mail: 'Mail',
  Clock: 'Clock',
};

export function useContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleContactFormSubmit(form);
  };

  return {
    form,
    handleChange,
    handleSubmit,
  };
}

export function handleContactFormSubmit({ name, phone, email, subject, message }) {
  console.log('Dữ liệu form liên hệ:', {
    name,
    phone,
    email,
    subject,
    message,
  });
} 