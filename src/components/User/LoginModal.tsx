import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLoginModal, LoginModalProps } from "./LoginModal.script.js";
import GoogleOAuthNotice from "@/components/GoogleOAuthNotice";
import { useTranslation } from "react-i18next";

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const {
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
    isGoogleConfigured,
  } = useLoginModal(onClose);
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-dessert-primary">{t('login_modal.title')}</SheetTitle>
        </SheetHeader>
        <div className="p-6 mt-7 overflow-y-auto max-h-[calc(100vh-64px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Google OAuth Notice */}
            <GoogleOAuthNotice isVisible={!isGoogleConfigured} />
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('login_modal.account_label')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder={t('login_modal.account_placeholder')}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 border-gray-300 focus:border-dessert-primary focus:ring-dessert-primary"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t('login_modal.password_label')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login_modal.password_placeholder')}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 border-gray-300 focus:border-dessert-primary focus:ring-dessert-primary"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={handlePasswordToggle}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 text-dessert-primary focus:ring-dessert-primary"
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  {t('login_modal.remember_me')}
                </Label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-dessert-primary hover:text-red-500 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {t('login_modal.forgot_password')}
              </button>
            </div>
            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-dessert-primary hover:bg-dessert-dark text-white font-medium py-3 transition-colors duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? t('login_modal.logging_in') : t('login_modal.login_button')}
            </Button>
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('login_modal.or')}</span>
              </div>
            </div>
            {/* Social Login */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 hover:text-red-500 transition-colors disabled:opacity-50"
                onClick={handleGoogleLogin}
                disabled={isLoading || !isGoogleConfigured}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? t('login_modal.processing') : t('login_modal.login_with_google')}
              </Button>
            </div>
            {/* Register Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">{t('login_modal.no_account')}</span>
              <button
                type="button"
                onClick={handleRegister}
                className="text-sm text-dessert-primary hover:text-red-500 font-medium transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {t('login_modal.register_now')}
              </button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoginModal; 