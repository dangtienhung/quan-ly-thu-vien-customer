# 🔐 Hướng dẫn Setup Hệ thống Authentication Frontend

## 📋 Tổng quan

Hệ thống authentication frontend được xây dựng với:

- **Context API** để quản lý trạng thái đăng nhập
- **Custom Hooks** để tương tác với API
- **Login Dialog** để hiển thị form đăng nhập
- **TypeScript** để type safety

## 🚀 Setup

### 1. Wrap ứng dụng với AuthProvider

Trong file `src/app/layout.tsx` hoặc component root:

```tsx
import { AuthProvider } from '@/components/auth';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="vi">
			<body>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
```

### 2. Environment Variables

Tạo file `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🎯 Cách sử dụng

### Kiểm tra trạng thái đăng nhập

```tsx
import { useIsAuthenticated } from '@/hooks';

function MyComponent() {
	const { isAuthenticated, isLoading } = useIsAuthenticated();

	if (isLoading) return <div>Đang tải...</div>;

	return <div>{isAuthenticated ? 'Đã đăng nhập' : 'Chưa đăng nhập'}</div>;
}
```

### Lấy thông tin người dùng

```tsx
import { useCurrentUser } from '@/hooks';

function UserProfile() {
	const { user, isAuthenticated } = useCurrentUser();

	if (!isAuthenticated) return <div>Vui lòng đăng nhập</div>;

	return (
		<div>
			<h1>Xin chào, {user?.username}!</h1>
			<p>Email: {user?.email}</p>
			<p>Vai trò: {user?.role}</p>
		</div>
	);
}
```

### Hiển thị Login Dialog

```tsx
import { useLoginDialog } from '@/hooks';

function LoginButton() {
	const { openLoginDialog } = useLoginDialog();

	return <button onClick={openLoginDialog}>Đăng nhập</button>;
}
```

### Kiểm tra quyền Admin

```tsx
import { useIsAdmin } from '@/hooks';

function AdminPanel() {
	const { isAdmin } = useIsAdmin();

	if (!isAdmin) return <div>Không có quyền truy cập</div>;

	return (
		<div>
			<h1>Admin Panel</h1>
			{/* Admin content */}
		</div>
	);
}
```

### Bảo vệ route yêu cầu đăng nhập

```tsx
import { useIsAuthenticated, useLoginDialog } from '@/hooks';

function ProtectedComponent() {
	const { isAuthenticated } = useIsAuthenticated();
	const { openLoginDialog, setOnLoginSuccess } = useLoginDialog();

	const handleProtectedAction = () => {
		if (!isAuthenticated) {
			setOnLoginSuccess(() => {
				// Callback sẽ được thực thi sau khi đăng nhập thành công
				console.log('Đăng nhập thành công, thực hiện hành động...');
			});
			openLoginDialog();
			return;
		}

		// Thực hiện hành động khi đã đăng nhập
		console.log('Thực hiện hành động...');
	};

	return (
		<button onClick={handleProtectedAction}>Hành động yêu cầu đăng nhập</button>
	);
}
```

## 🔧 API Functions

### Login

```tsx
import { useLogin } from '@/hooks';

function LoginForm() {
	const { login, isLoading, error } = useLogin();

	const handleSubmit = async (credentials) => {
		const result = await login(credentials);
		if (result.success) {
			console.log('Đăng nhập thành công');
		} else {
			console.error('Lỗi:', result.error);
		}
	};
}
```

### Logout

```tsx
import { useLogout } from '@/hooks';

function LogoutButton() {
	const { logout } = useLogout();

	return <button onClick={logout}>Đăng xuất</button>;
}
```

### Đổi mật khẩu

```tsx
import { useChangePassword } from '@/hooks';

function ChangePasswordForm() {
	const { changePassword } = useChangePassword();

	const handleSubmit = async (data) => {
		const result = await changePassword(data);
		if (result.success) {
			console.log('Đổi mật khẩu thành công');
		} else {
			console.error('Lỗi:', result.error);
		}
	};
}
```

## 🎨 Customization

### Tùy chỉnh Login Dialog

```tsx
import LoginDialog from '@/components/auth/LoginDialog';

function CustomLoginDialog() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<LoginDialog
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			onSuccess={() => {
				console.log('Đăng nhập thành công');
				setIsOpen(false);
			}}
		/>
	);
}
```

### Tùy chỉnh styling

Các components sử dụng Tailwind CSS. Bạn có thể tùy chỉnh:

- Colors trong `tailwind.config.js`
- Spacing và typography
- Component styles trong file component

## 🔒 Security Features

1. **Token Storage**: JWT token được lưu trong localStorage
2. **Auto Logout**: Token hết hạn sẽ tự động logout
3. **Error Handling**: Xử lý lỗi tập trung với thông báo tiếng Việt
4. **Loading States**: Hiển thị trạng thái loading khi cần thiết

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **"useAuth must be used within an AuthProvider"**

   - Đảm bảo đã wrap component với `AuthProvider`

2. **API calls fail**

   - Kiểm tra `NEXT_PUBLIC_API_URL` trong environment variables
   - Đảm bảo backend server đang chạy

3. **Login dialog không hiển thị**
   - Kiểm tra z-index của dialog
   - Đảm bảo không có CSS conflicts

### Debug

```tsx
import { useAuth } from '@/contexts/AuthContext';

function DebugComponent() {
	const auth = useAuth();

	console.log('Auth state:', auth);

	return <div>Check console for auth state</div>;
}
```

## 📚 API Reference

### Login Response Format

API login trả về response với format:

```json
{
	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Sau khi nhận được token, hệ thống sẽ tự động gọi API `/users/me` để lấy thông tin user.

Xem file `src/apis/auth.ts` để biết chi tiết về các API functions.

## 🔄 State Management

Hệ thống sử dụng React Context + useReducer để quản lý state:

- `user`: Thông tin người dùng hiện tại
- `token`: JWT token
- `isAuthenticated`: Trạng thái đăng nhập
- `isLoading`: Trạng thái loading
- `error`: Thông báo lỗi

## 🚀 Next Steps

1. Implement forgot password flow
2. Add user registration
3. Add profile management
4. Implement role-based routing
5. Add session management
