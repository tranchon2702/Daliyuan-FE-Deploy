import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    // Log khi ấn nút đăng nhập
    console.log("Form data đầy đủ:", formData);
    console.log("==================");

    try {
      // Validate form data
      if (!formData.email.trim()) {
        throw new Error("Vui lòng nhập email");
      }
      if (!formData.password.trim()) {
        throw new Error("Vui lòng nhập mật khẩu");
      }

      // TODO: Call API đăng nhập ở đây
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("✅ Đăng nhập thành công - sẵn sàng call API");
      
      // Store login state with minimal user data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify({
        email: formData.email,
        fullName: "",
        phone: "",
        address: ""
      }));
      // (Không lưu loginTimestamp ở đây)
      
      // Close modal and redirect to my account page
      if (onClose) {
        onClose();
      }
      navigate("/my-account");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi đăng nhập";
      setError(errorMessage);
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
            
            // await saveGoogleUserToBackend(userInfo);

            // Store user data
            const userData = {
              email: userInfo.email,
              fullName: userInfo.name,
              phone: "",
              address: "",
              avatar: userInfo.picture,
              googleId: userInfo.id
            };

            // Save to localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("loginMethod", "google");
            localStorage.setItem("googleAvatar", userInfo.picture);
            // Save login timestamp
            localStorage.setItem("loginTimestamp", Date.now().toString());

            console.log("✅ Đăng nhập Google thành công:", userData);

            // Close modal and redirect
            if (onClose) {
              onClose();
            }
            navigate("/my-account");

          } catch (error) {
            console.error("Error getting user info:", error);
            setError("Không thể lấy thông tin người dùng từ Google");
          } finally {
            setIsLoading(false);
          }
        },
      });

      // Trigger Google OAuth flow
      client.requestAccessToken();

    } catch (error) {
      console.error("Google login error:", error);
      setError("Có lỗi xảy ra khi đăng nhập với Google");
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
      // Ví dụ endpoint, bạn thay đổi sau này nếu cần
      const response = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userInfo.email,
          fullName: userInfo.name,
          avatar: userInfo.picture,
          googleId: userInfo.id,
        }),
      });
      if (!response.ok) {
        throw new Error('Không thể lưu thông tin user vào hệ thống');
      }
      const data = await response.json();
      console.log('Kết quả lưu user Google vào backend:', data);
      return data;
    } catch (error) {
      console.error('Lỗi khi lưu user Google vào backend:', error);
      return null;
    }
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  const handleRegister = () => {
    console.log("Register clicked");
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setShowPassword(false);
    setError(null);
    setIsLoading(false);
  };

  // Check if Google OAuth is configured
  const isGoogleConfigured = !!GOOGLE_CLIENT_ID;

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