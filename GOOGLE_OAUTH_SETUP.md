# Hướng dẫn cấu hình Google OAuth

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Kích hoạt Google+ API và Google OAuth2 API

## Bước 2: Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Web application**
4. Điền thông tin:
   - **Name**: Tên ứng dụng của bạn
   - **Authorized JavaScript origins**: 
     - `http://localhost:8080` (cho development)
     - `https://yourdomain.com` (cho production)
   - **Authorized redirect URIs**:
     - `http://localhost:8080`
     - `https://yourdomain.com`

## Bước 3: Cập nhật Client ID

1. Sau khi tạo, copy **Client ID**
2. Mở file `src/components/Login/LoginModal.script.ts`
3. Thay thế `YOUR_GOOGLE_CLIENT_ID` bằng Client ID thật:

```typescript
const GOOGLE_CLIENT_ID = "your-actual-client-id-here.apps.googleusercontent.com";
```

## Bước 4: Cấu hình cho Production

Khi deploy lên production, cần:

1. Thêm domain thật vào **Authorized JavaScript origins**
2. Thêm domain thật vào **Authorized redirect URIs**
3. Cập nhật Client ID trong code

## Lưu ý bảo mật

- **KHÔNG** commit Client Secret vào code
- Sử dụng environment variables cho production
- Chỉ sử dụng Client ID ở frontend
- Client Secret chỉ dùng ở backend (nếu cần)

## Test

1. Chạy ứng dụng: `npm run dev`
2. Mở modal đăng nhập
3. Click "Đăng nhập với Google"
4. Chọn tài khoản Google
5. Kiểm tra thông tin user trong My Account page

## Troubleshooting

### Lỗi "popup_closed_by_user"
- Kiểm tra Authorized JavaScript origins
- Đảm bảo domain khớp với cấu hình

### Lỗi "access_denied"
- Kiểm tra scope trong code
- Đảm bảo API đã được kích hoạt

### Lỗi CORS
- Kiểm tra Authorized redirect URIs
- Đảm bảo protocol (http/https) khớp 