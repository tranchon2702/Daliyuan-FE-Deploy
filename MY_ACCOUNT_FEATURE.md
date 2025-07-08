# Tính Năng Trang Tài Khoản - My Account

## Tổng Quan
Tính năng trang tài khoản cho phép người dùng đã đăng nhập quản lý thông tin cá nhân, xem lịch sử đơn hàng và quản lý địa chỉ giao hàng.

## Các Tính Năng Chính

### 1. Đăng Nhập và Chuyển Hướng
- Khi đăng nhập thành công, người dùng sẽ được chuyển hướng tự động đến trang `/my-account`
- Thông tin đăng nhập được lưu trong localStorage
- Modal đăng nhập sẽ tự động đóng sau khi đăng nhập thành công

### 2. Trang Tài Khoản (`/my-account`)
- **Thông tin cá nhân**: Xem và chỉnh sửa thông tin cá nhân (sau đăng nhập lần đầu sẽ trống)
- **Lịch sử đơn hàng**: Xem các đơn hàng đã đặt với trạng thái
- **Địa chỉ giao hàng**: Quản lý địa chỉ giao hàng

### 3. Header Navigation
- Hiển thị trạng thái đăng nhập
- Dropdown menu cho người dùng đã đăng nhập
- Không thêm menu "Tài Khoản" vào navigation chính

## Cấu Trúc Files

```
src/
├── pages/
│   └── MyAccount/
│       ├── MyAccount.tsx          # Component chính
│       └── MyAccount.script.ts    # Logic và state management
├── components/
│   ├── Header.tsx                 # Cập nhật với trạng thái đăng nhập
│   └── Login/
│       ├── LoginModal.tsx         # Modal đăng nhập
│       └── LoginModal.script.ts   # Logic đăng nhập
└── App.tsx                        # Thêm route /my-account
```

## Cách Sử Dụng

### Đăng Nhập
1. Click vào icon User trong header
2. Nhập thông tin đăng nhập
3. Sau khi đăng nhập thành công, sẽ được chuyển hướng đến `/my-account`

### Quản Lý Tài Khoản
1. Sau đăng nhập thành công, tự động chuyển đến `/my-account`
2. Sử dụng các tab để chuyển đổi giữa các chức năng:
   - **Thông tin cá nhân**: Điền thông tin cá nhân (sau đăng nhập lần đầu sẽ trống)
   - **Đơn hàng**: Xem lịch sử đơn hàng
   - **Địa chỉ giao hàng**: Quản lý địa chỉ

### Đăng Xuất
1. Click vào icon User trong header
2. Chọn "Đăng xuất" từ dropdown menu
3. Hoặc vào trang tài khoản và click "Đăng xuất"

## Bảo Mật
- Kiểm tra trạng thái đăng nhập trước khi cho phép truy cập trang tài khoản
- Tự động chuyển hướng về trang chủ nếu chưa đăng nhập
- Xóa thông tin đăng nhập khi đăng xuất

## TODO
- [ ] Tích hợp với API backend thực tế
- [ ] Thêm validation cho form chỉnh sửa thông tin
- [ ] Thêm tính năng đổi mật khẩu
- [ ] Thêm tính năng quản lý nhiều địa chỉ giao hàng
- [ ] Thêm tính năng theo dõi đơn hàng chi tiết
- [ ] Thêm tính năng đánh giá sản phẩm đã mua 