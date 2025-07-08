# Tính năng Đăng nhập Google

## Tổng quan

Dự án đã được tích hợp tính năng đăng nhập bằng Google OAuth 2.0. Người dùng có thể đăng nhập bằng tài khoản Google của họ thay vì tạo tài khoản mới.

## Tính năng

- ✅ Đăng nhập bằng Google OAuth 2.0
- ✅ Lấy thông tin cơ bản từ Google (email, tên, avatar)
- ✅ Lưu trữ thông tin user trong localStorage
- ✅ Hiển thị badge "Đăng nhập bằng Google" trong My Account
- ✅ Xử lý lỗi và loading states
- ✅ Responsive design

## Cấu trúc Files

```
src/
├── components/
│   ├── Login/
│   │   ├── LoginModal.tsx          # UI của modal đăng nhập
│   │   └── LoginModal.script.ts    # Logic xử lý đăng nhập
│   └── GoogleOAuthNotice.tsx       # Thông báo khi chưa cấu hình
├── pages/
│   └── MyAccount/
│       ├── MyAccount.tsx           # UI trang tài khoản
│       └── MyAccount.script.ts     # Logic xử lý tài khoản
├── types/
│   └── google.d.ts                 # Type definitions cho Google API
└── GOOGLE_OAUTH_SETUP.md           # Hướng dẫn cấu hình
```

## Cách hoạt động

1. **Khởi tạo**: Khi user click "Đăng nhập với Google", hệ thống sẽ load Google OAuth script
2. **Xác thực**: Google sẽ mở popup để user đăng nhập và cấp quyền
3. **Lấy thông tin**: Sau khi xác thực thành công, hệ thống sẽ lấy thông tin user từ Google API
4. **Lưu trữ**: Thông tin user được lưu vào localStorage với key `userData`
5. **Chuyển hướng**: User được chuyển đến trang My Account

## Thông tin User được lưu

```typescript
interface UserData {
  fullName: string;      // Tên đầy đủ từ Google
  email: string;         // Email từ Google
  phone: string;         // Để trống, user có thể cập nhật sau
  address: string;       // Để trống, user có thể cập nhật sau
  avatar: string;        // URL avatar từ Google
  googleId?: string;     // ID duy nhất từ Google
  loginMethod?: "email" | "google"; // Phương thức đăng nhập
}
```

## Bảo mật

- Chỉ sử dụng Client ID ở frontend (không cần Client Secret)
- Thông tin user được lưu locally (có thể nâng cấp lên backend sau)
- Sử dụng HTTPS cho production
- Validate domain trong Google Cloud Console

## Nâng cấp trong tương lai

- [ ] Tích hợp với backend API
- [ ] JWT token authentication
- [ ] Refresh token handling
- [ ] Logout khỏi Google
- [ ] Liên kết tài khoản Google với tài khoản email

## Troubleshooting

### Lỗi thường gặp

1. **"Google đăng nhập thất bại"**
   - Kiểm tra Client ID có đúng không
   - Kiểm tra domain có trong Authorized JavaScript origins không

2. **"Không thể lấy thông tin người dùng"**
   - Kiểm tra scope có đúng không
   - Kiểm tra API đã được kích hoạt chưa

3. **Popup bị chặn**
   - Cho phép popup cho domain của bạn
   - Kiểm tra cài đặt browser

### Debug

Mở Developer Tools (F12) và xem Console để debug:
- Log khi click nút Google
- Log khi nhận response từ Google
- Log khi lưu user data

## Test

1. Chạy `npm run dev` (sẽ chạy trên http://localhost:8080)
2. Mở modal đăng nhập
3. Click "Đăng nhập với Google"
4. Chọn tài khoản Google
5. Kiểm tra thông tin trong My Account page
6. Kiểm tra localStorage có userData không 