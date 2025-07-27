import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// Types for TypeScript support
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: {
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  isAdmin: boolean;
  token: string;
}

export const useLoginModal = (onClose?: () => void) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google OAuth
  const initializeGoogleAuth = () => {
    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.email.trim()) {
        throw new Error("Vui lòng nhập email");
      }
      if (!formData.password.trim()) {
        throw new Error("Vui lòng nhập mật khẩu");
      }

      // Call API đăng nhập
      const response = await axios.post(`${API_URL}/users/login`, formData);
      const userData: UserData = response.data;
      
      // Store user data and token
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify({
        _id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone || "",
        address: userData.address || {},
        isAdmin: userData.isAdmin
      }));
      localStorage.setItem("token", userData.token);
      localStorage.setItem("loginMethod", "email");
      localStorage.setItem("loginTimestamp", Date.now().toString());
      
      console.log("✅ Đăng nhập thành công");
      
      // Close modal and redirect to my account page
      if (onClose) {
        onClose();
      }
      navigate("/my-account");
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Có lỗi xảy ra khi đăng nhập";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Initialize Google Auth if not already loaded
      initializeGoogleAuth();

      // Wait for Google to load
      await new Promise<void>((resolve) => {
        const checkGoogle = () => {
          if (window.google && window.google.accounts) {
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      });

      // Create Google OAuth client
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: async (response) => {
          if (response.error) {
            throw new Error('Google đăng nhập thất bại');
          }

          try {
            // Get user info from Google
            const userInfo = await getGoogleUserInfo(response.access_token);
            
            // Gọi API lưu user Google vào backend
            const googleLoginData = await saveGoogleUserToBackend(userInfo);
            
            // Store user data
            const userData = {
              _id: googleLoginData._id,
              fullName: googleLoginData.fullName,
              email: googleLoginData.email,
              phone: googleLoginData.phone || "",
              address: googleLoginData.address || {},
              isAdmin: googleLoginData.isAdmin,
              avatar: userInfo.picture
            };

            // Save to localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("token", googleLoginData.token);
            localStorage.setItem("loginMethod", "google");
            localStorage.setItem("googleAvatar", userInfo.picture);
            localStorage.setItem("loginTimestamp", Date.now().toString());

            console.log("✅ Đăng nhập Google thành công");

            // Close modal and redirect
            if (onClose) {
              onClose();
            }
            navigate("/my-account");

          } catch (error: any) {
            console.error("Error getting user info:", error);
            setError(error.response?.data?.message || "Không thể lấy thông tin người dùng từ Google");
          } finally {
            setIsLoading(false);
          }
        },
      });

      // Trigger Google OAuth flow
      client.requestAccessToken();

    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message || "Có lỗi xảy ra khi đăng nhập với Google");
      setIsLoading(false);
    }
  };

  const getGoogleUserInfo = async (accessToken: string): Promise<GoogleUser> => {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin người dùng');
    }

    return response.json();
  };

  // Hàm call API lưu thông tin user Google
  const saveGoogleUserToBackend = async (userInfo: GoogleUser) => {
    try {
      const response = await axios.post(`${API_URL}/users/google-login`, {
        email: userInfo.email,
        fullName: userInfo.name,
        avatar: userInfo.picture,
        googleId: userInfo.id,
      });
      
      if (!response.data) {
        throw new Error('Không thể lưu thông tin user vào hệ thống');
      }
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lưu user Google vào backend:', error);
      throw error;
    }
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  const handleRegister = () => {
    navigate('/register');
    if (onClose) onClose();
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setError(null);
  };

  // Check if Google OAuth is configured
  const isGoogleConfigured = Boolean(GOOGLE_CLIENT_ID);

  return {
    showPassword,
    formData,
    isLoading,
    error,
    handleSubmit,
    handleInputChange,
    handlePasswordToggle,
    handleGoogleLogin,
    handleFacebookLogin,
    handleForgotPassword,
    handleRegister,
    resetForm,
    isGoogleConfigured,
  };
}; 