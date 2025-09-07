# Hướng dẫn sử dụng chức năng Quên mật khẩu

## Tổng quan

Chức năng quên mật khẩu cho phép người dùng đặt lại mật khẩu thông qua email khi họ quên mật khẩu hiện tại.

## Luồng hoạt động

### 1. Yêu cầu đặt lại mật khẩu
- Người dùng truy cập `/forgot-password`
- Nhập địa chỉ email đã đăng ký
- Hệ thống gửi email chứa link đặt lại mật khẩu

### 2. Đặt lại mật khẩu
- Người dùng nhấp vào link trong email
- Được chuyển đến `/reset-password?token=...`
- Nhập mật khẩu mới và xác nhận
- Hệ thống cập nhật mật khẩu

## Các trang và components

### 1. Forgot Password Page (`/forgot-password`)
- **File**: `src/app/(auth)/forgot-password/page.tsx`
- **Chức năng**:
  - Form nhập email
  - Validation email
  - Gửi yêu cầu reset password
  - Hiển thị thông báo thành công

### 2. Reset Password Page (`/reset-password`)
- **File**: `src/app/(auth)/reset-password/page.tsx`
- **Chức năng**:
  - Nhận token từ URL
  - Form nhập mật khẩu mới
  - Validation mật khẩu
  - Cập nhật mật khẩu
  - Hiển thị thông báo thành công

### 3. Updated Login Page
- **File**: `src/app/(auth)/login/page.tsx`
- **Thay đổi**: Thêm link "Quên mật khẩu?" dẫn đến `/forgot-password`

## API Integration

### 1. Auth API (`src/apis/auth.ts`)
```typescript
// Gửi email đặt lại mật khẩu
forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }>

// Đặt lại mật khẩu với token
resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }>
```

### 2. Auth Hooks (`src/hooks/auth.ts`)
```typescript
// Hook cho forgot password
export const useForgotPassword = () => {
  const forgotPassword = useCallback(async (data: ForgotPasswordRequest) => {
    // Implementation
  }, []);
  return { forgotPassword };
};

// Hook cho reset password
export const useResetPassword = () => {
  const resetPassword = useCallback(async (data: ResetPasswordRequest) => {
    // Implementation
  }, []);
  return { resetPassword };
};
```

## Types

### 1. Auth Types (`src/types/auth.ts`)
```typescript
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
```

## Security Features

### 1. Token Security
- JWT token có thời hạn 15 phút
- Token chứa thông tin user ID và email
- Token được verify trước khi reset password

### 2. Password Validation
- Mật khẩu tối thiểu 6 ký tự
- Xác nhận mật khẩu phải khớp
- Client-side validation

### 3. Email Validation
- Format email hợp lệ
- Kiểm tra email có tồn tại trong hệ thống

## Auth Guard Updates

### 1. Public Routes
```typescript
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
```

### 2. Route Protection
- `/forgot-password`: Không cần authentication
- `/reset-password`: Không cần authentication (cần token hợp lệ)

## UI/UX Features

### 1. Responsive Design
- Mobile-friendly layout
- Responsive forms
- Touch-friendly buttons

### 2. Loading States
- Loading spinners
- Disabled states during API calls
- Progress indicators

### 3. Error Handling
- Client-side validation
- Server error messages
- User-friendly error display

### 4. Success States
- Success confirmation
- Clear next steps
- Navigation options

## Email Template

### 1. Reset Password Email
- Professional HTML template
- Responsive design
- Security warnings
- Clear call-to-action button
- Fallback text link

### 2. Email Content
- Personalized greeting
- Clear instructions
- Security notices
- 15-minute expiration warning
- Contact information

## Testing

### 1. Manual Testing
1. Truy cập `/forgot-password`
2. Nhập email hợp lệ
3. Kiểm tra email nhận được
4. Nhấp vào link trong email
5. Đặt lại mật khẩu
6. Đăng nhập với mật khẩu mới

### 2. Error Cases
- Email không tồn tại
- Token hết hạn
- Token không hợp lệ
- Mật khẩu không khớp
- Network errors

## Configuration

### 1. Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8002
```

### 2. Backend Configuration
```env
NODEMAILER_USER=your-email@gmail.com
NODEMAILER_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### 1. Common Issues
- **Email không được gửi**: Kiểm tra cấu hình Nodemailer
- **Token không hợp lệ**: Kiểm tra thời gian hết hạn (15 phút)
- **Link không hoạt động**: Kiểm tra FRONTEND_URL configuration

### 2. Debug Steps
1. Kiểm tra console logs
2. Verify API endpoints
3. Check email delivery
4. Validate token format

## Security Considerations

### 1. Rate Limiting
- Implement rate limiting for forgot password requests
- Prevent email spam

### 2. Token Management
- Short token expiration (15 minutes)
- One-time use tokens
- Secure token generation

### 3. Email Security
- Use HTTPS for email links
- Validate email domains
- Monitor suspicious activity

## Future Enhancements

### 1. Additional Features
- Email verification for new accounts
- Two-factor authentication
- Password strength indicators
- Account lockout after failed attempts

### 2. UI Improvements
- Dark mode support
- Multi-language support
- Accessibility improvements
- Progressive Web App features
