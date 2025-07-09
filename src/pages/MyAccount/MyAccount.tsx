import { useState, useEffect } from "react";
import { User, Package, MapPin, Settings, LogOut, Edit, Save, X, Upload, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMyAccount, UserAvatarProps } from "./MyAccount.script";
import { cn } from "@/lib/utils";
import { getProvinces, getDistricts, getWards } from "../Checkout/Checkout.script";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UpdateLocationModal from "./UpdateLocation-Modal";
import { useTranslation } from 'react-i18next';

// ===== UI COMPONENTS =====

// UserAvatar Component
const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = "User avatar",
  size = "md",
  className,
  onClick,
  isEditing = false,
  isLoading = false,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "relative group",
        onClick && isEditing && "cursor-pointer",
        className
      )}
    >
      <div
        className={cn(
          "relative rounded-full overflow-hidden border-4 border-dessert-secondary transition-all duration-200",
          sizeClasses[size],
          isEditing && onClick && "hover:border-dessert-primary hover:shadow-lg"
        )}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const fallback = parent.querySelector(".avatar-fallback") as HTMLElement;
                if (fallback) {
                  fallback.style.display = "flex";
                }
              }
            }}
          />
        ) : null}
        
        <div
          className={cn(
            "avatar-fallback absolute inset-0 bg-gradient-to-br from-dessert-primary to-dessert-secondary flex items-center justify-center text-white font-semibold",
            iconSizes[size].replace("w-", "text-").replace("h-", ""),
            src ? "hidden" : "flex"
          )}
        >
          {getInitials(alt)}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  sidebarItems: Array<{ key: string; icon: string; label: string }>;
}> = ({ activeTab, onTabChange, onLogout, sidebarItems }) => {
  const { t } = useTranslation();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "User": return <User className="h-5 w-5 text-dessert-primary" />;
      case "Package": return <Package className="h-5 w-5 text-dessert-primary" />;
      case "MapPin": return <MapPin className="h-5 w-5 text-dessert-primary" />;
      case "Settings": return <Settings className="h-5 w-5 text-dessert-primary" />;
      default: return <User className="h-5 w-5 text-dessert-primary" />;
    }
  };

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left
                ${activeTab === item.key ? "bg-dessert-secondary/50 font-semibold" : "hover:bg-dessert-secondary/30"}
              `}
            >
              {getIcon(item.icon)}
              <span className="font-medium">{t(`my_account_page.sidebar.${item.key}`)}</span>
            </button>
          ))}
          <div className="border-t pt-4">
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">{t('my_account_page.sidebar.logout')}</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Profile Tab Component
const ProfileTab: React.FC<{
  userData: any;
  editData: any;
  setEditData: (data: any) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isUploadingAvatar: boolean;
  fileInputRef: any;
  handleAvatarClick: () => void;
  handleAvatarUpload: (event: any) => void;
  resetToGoogleAvatar: () => void;
  handleSaveProfile: () => void;
  handleCancelEdit: () => void;
}> = ({
  userData,
  editData,
  setEditData,
  isEditing,
  setIsEditing,
  isUploadingAvatar,
  fileInputRef,
  handleAvatarClick,
  handleAvatarUpload,
  resetToGoogleAvatar,
  handleSaveProfile,
  handleCancelEdit,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('my_account_page.profile_tab.title')}</CardTitle>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>{t('my_account_page.profile_tab.edit_button')}</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleSaveProfile}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{t('my_account_page.profile_tab.save_button')}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>{t('my_account_page.profile_tab.cancel_button')}</span>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />

        <div className="flex items-center space-x-6">
          <div className="relative">
            <UserAvatar
              src={isEditing ? editData.avatar : userData.avatar}
              alt={isEditing ? editData.fullName : userData.fullName}
              size="lg"
              onClick={handleAvatarClick}
              isEditing={isEditing}
              isLoading={isUploadingAvatar}
            />
            
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <Button
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 bg-dessert-primary hover:bg-dessert-primary/90"
                  onClick={handleAvatarClick}
                  title={t('my_account_page.profile_tab.upload_avatar_title')}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                {userData.loginMethod === "google" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={resetToGoogleAvatar}
                    title={t('my_account_page.profile_tab.reset_google_avatar_title', "Khôi phục ảnh Google")}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-dessert-primary">
              {isEditing ? editData.fullName : userData.fullName || t('my_account_page.profile_tab.name_not_updated', "Chưa cập nhật tên")}
            </h3>
            <p className="text-gray-600">
              {isEditing ? editData.email : userData.email}
            </p>
            {userData.loginMethod === "google" && (
              <div className="flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-xs text-gray-500">{t('my_account_page.profile_tab.google_login', "Đăng nhập bằng Google")}</span>
              </div>
            )}
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                {t('my_account_page.profile_tab.upload_new_avatar_prompt', "Nhấp vào ảnh để tải lên ảnh mới")}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t('my_account_page.profile_tab.full_name_label')}</Label>
            <Input
              id="fullName"
              value={isEditing ? editData.fullName : userData.fullName}
              onChange={(e) => isEditing && setEditData({...editData, fullName: e.target.value})}
              disabled={!isEditing}
              placeholder={t('my_account_page.profile_tab.full_name_placeholder', "Nhập họ và tên của bạn")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('my_account_page.profile_tab.email_label', "Email")}</Label>
            <Input
              id="email"
              type="email"
              value={isEditing ? editData.email : userData.email}
              onChange={(e) => isEditing && setEditData({...editData, email: e.target.value})}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('my_account_page.profile_tab.phone_label', "Số điện thoại")}</Label>
            <Input
              id="phone"
              value={isEditing ? editData.phone : userData.phone}
              onChange={(e) => isEditing && setEditData({...editData, phone: e.target.value})}
              disabled={!isEditing}
              placeholder={t('my_account_page.profile_tab.phone_placeholder', "Nhập số điện thoại của bạn")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">{t('my_account_page.profile_tab.address_label', "Địa chỉ")}</Label>
            <Input
              id="address"
              value={isEditing ? editData.address : userData.address}
              onChange={(e) => isEditing && setEditData({...editData, address: e.target.value})}
              disabled={!isEditing}
              placeholder={t('my_account_page.profile_tab.address_placeholder', "Nhập địa chỉ của bạn")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Orders Tab Component
const OrdersTab: React.FC<{
  orders: any[];
  getStatusBadge: (status: string) => { text: string; className: string };
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}> = ({ orders, getStatusBadge, formatCurrency, formatDate }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('my_account_page.orders_tab.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-dessert-primary">
                    {t('my_account_page.orders_tab.order_id', "Đơn hàng #{{id}}", { id: order.id })}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t('my_account_page.orders_tab.order_date', "Ngày đặt")}: {formatDate(order.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {formatCurrency(order.total)}
                  </p>
                  <Badge className={getStatusBadge(order.status).className}>
                    {getStatusBadge(order.status).text}
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600">
                  {t('my_account_page.orders_tab.products', "Sản phẩm")}: {order.items.join(", ")}
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  {t('my_account_page.orders_tab.view_details_button', "Xem chi tiết")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Address Tab Component
const AddressManagementTab: React.FC<{
  addresses: any[];
  addAddress: (address: any) => void;
  updateAddress: (id: string, updated: any) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  // Thêm các props mới nếu cần
  modalProps: any;
}> = ({ addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, modalProps }) => {
  const { t } = useTranslation();

  // ... giữ lại các hàm handleEdit, ... nhưng không render UI modal ở đây nữa ...
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('my_account_page.address_tab.title')}</CardTitle>
          <Button variant="outline" size="sm" onClick={modalProps.onAddNew}>
            {t('my_account_page.address_tab.add_button')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UpdateLocationModal {...modalProps} />
        <div className="space-y-4">
          {addresses.length === 0 && <div className="text-gray-500">{t('my_account_page.address_tab.no_addresses')}</div>}
          {addresses.map(addr => (
            <div key={addr.id} className={`border rounded-lg p-4 ${addr.isDefault ? "border-dessert-primary" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-dessert-primary mb-2">
                    {addr.isDefault ? t('my_account_page.address_tab.default_badge') : t('my_account_page.address_tab.address_badge', "Địa chỉ")}
                  </h4>
                  <p className="text-gray-600 mb-2">
                    <strong>{addr.fullName}</strong><br />
                    {addr.address}, {addr.wardName || addr.ward}, {addr.districtName || addr.district}, {addr.cityName || addr.city}<br />
                    {t('my_account_page.address_tab.phone_label', "Điện thoại")}: {addr.phone}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 items-end">
                  {!addr.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setDefaultAddress(addr.id)}>
                      {t('my_account_page.address_tab.set_default_button')}
                    </Button>
                  )}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => modalProps.onEdit(addr)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('my_account_page.address_tab.edit_button', 'Sửa')}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => deleteAddress(addr.id)}>
                      <X className="h-4 w-4 mr-2" />
                      {t('my_account_page.address_tab.delete_button', 'Xóa')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Settings Tab Component
const SettingsTab: React.FC = () => {
  const { t } = useTranslation();
  const [promoEmail, setPromoEmail] = useState(() => {
    return localStorage.getItem("promoEmail") === "true";
  });
  const [showChangePw, setShowChangePw] = useState(false);
  const [pw, setPw] = useState({ old: "", new1: "", new2: "" });

  const handleTogglePromo = () => {
    setPromoEmail(v => {
      localStorage.setItem("promoEmail", (!v).toString());
      return !v;
    });
  };

  const handleChangePw = (e: any) => {
    e.preventDefault();
    if (!pw.old || !pw.new1 || !pw.new2) return alert(t('my_account_page.settings_tab.fill_all_fields_alert', "Vui lòng nhập đủ thông tin"));
    if (pw.new1 !== pw.new2) return alert(t('my_account_page.settings_tab.new_password_mismatch_alert', "Mật khẩu mới không khớp"));
    alert(t('my_account_page.settings_tab.password_change_success_alert', "Đổi mật khẩu thành công (giả lập)"));
    setShowChangePw(false);
    setPw({ old: "", new1: "", new2: "" });
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('my_account_page.settings_tab.delete_account_confirm', "Bạn có chắc chắn muốn xóa tài khoản? (giả lập)"))) {
      alert(t('my_account_page.settings_tab.account_deleted_alert', "Tài khoản đã bị xóa (giả lập)"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('my_account_page.settings_tab.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="flex items-center space-x-2">
            <input type="checkbox" checked={promoEmail} onChange={handleTogglePromo} />
            <span>{t('my_account_page.settings_tab.notifications_label')}</span>
          </Label>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => setShowChangePw(v => !v)}>
            {t('my_account_page.settings_tab.change_password_button', 'Đổi mật khẩu')}
          </Button>
          {showChangePw && (
            <form className="mt-3 space-y-2" onSubmit={handleChangePw}>
              <Input type="password" placeholder={t('my_account_page.settings_tab.current_password_placeholder', "Mật khẩu hiện tại")} value={pw.old} onChange={e => setPw(p => ({ ...p, old: e.target.value }))} required />
              <Input type="password" placeholder={t('my_account_page.settings_tab.new_password_placeholder', "Mật khẩu mới")} value={pw.new1} onChange={e => setPw(p => ({ ...p, new1: e.target.value }))} required />
              <Input type="password" placeholder={t('my_account_page.settings_tab.confirm_new_password_placeholder', "Nhập lại mật khẩu mới")} value={pw.new2} onChange={e => setPw(p => ({ ...p, new2: e.target.value }))} required />
              <Button type="submit" size="sm">{t('my_account_page.settings_tab.confirm_button', "Xác nhận")}</Button>
            </form>
          )}
        </div>
        <div>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
            {t('my_account_page.settings_tab.delete_account_button')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ===== MAIN COMPONENT =====
const MyAccount = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const {
    userData,
    editData,
    setEditData,
    orders,
    isEditing,
    setIsEditing,
    isUploadingAvatar,
    fileInputRef,
    handleAvatarClick,
    handleAvatarUpload,
    resetToGoogleAvatar,
    handleSaveProfile,
    handleCancelEdit,
    handleLogout,
    getStatusBadge,
    formatCurrency,
    formatDate,
    SIDEBAR_ITEMS,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    modalProps,
  } = useMyAccount();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-dessert-cream/30 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dessert-primary mb-2">{t('my_account_page.title')}</h1>
            <p className="text-gray-600">
              {userData.fullName ? t('my_account_page.subtitle_logged_in') : t('my_account_page.subtitle_logged_out')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
                sidebarItems={SIDEBAR_ITEMS}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsContent value="profile" className="space-y-6">
                  <ProfileTab
                    userData={userData}
                    editData={editData}
                    setEditData={setEditData}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    isUploadingAvatar={isUploadingAvatar}
                    fileInputRef={fileInputRef}
                    handleAvatarClick={handleAvatarClick}
                    handleAvatarUpload={handleAvatarUpload}
                    resetToGoogleAvatar={resetToGoogleAvatar}
                    handleSaveProfile={handleSaveProfile}
                    handleCancelEdit={handleCancelEdit}
                  />
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                  <OrdersTab
                    orders={orders}
                    getStatusBadge={getStatusBadge}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                  />
                </TabsContent>

                <TabsContent value="address" className="space-y-6">
                  <AddressManagementTab
                    addresses={addresses}
                    addAddress={addAddress}
                    updateAddress={updateAddress}
                    deleteAddress={deleteAddress}
                    setDefaultAddress={setDefaultAddress}
                    modalProps={modalProps}
                  />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <SettingsTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccount; 