import { useState } from "react";

export const contactInfo = (t) => [
  {
    icon: 'MapPin',
    title: t('contact_page.info.address.title'),
    details: t('contact_page.info.address.details', { returnObjects: true }),
  },
  {
    icon: 'Phone',
    title: t('contact_page.info.phone.title'),
    details: t('contact_page.info.phone.details', { returnObjects: true }),
  },
  {
    icon: 'Mail',
    title: t('contact_page.info.email.title'),
    details: t('contact_page.info.email.details', { returnObjects: true }),
  },
  {
    icon: 'Clock',
    title: t('contact_page.info.hours.title'),
    details: t('contact_page.info.hours.details', { returnObjects: true }),
  },
];

export const stores = (t) => [
  {
    name: 'Cửa hàng Quận 1', // This could also be translated if needed
    address: t('contact_page.info.address.details.0'),
    phone: '0123 456 789',
    hours: '8:00 - 22:00',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
  },
  {
    name: 'Cửa hàng Quận 3', // This could also be translated if needed
    address: t('contact_page.info.address.details.1'),
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