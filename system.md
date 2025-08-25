# Hệ thống Quản lý Thư viện - Customer Frontend

> File này mô tả cấu trúc thư mục, dependencies và tổ chức code của ứng dụng customer frontend.

## 📦 **Dependencies**

### **Core Dependencies**
```
@hookform/resolvers: ^5.2.1          # Form validation với Zod
@radix-ui/react-dialog: ^1.1.14      # UI Components (Dialog, Dropdown, Label, Slot)
@radix-ui/react-dropdown-menu: ^2.1.15
@radix-ui/react-label: ^2.1.7
@radix-ui/react-slot: ^1.2.3
@tanstack/react-query: ^5.84.2       # State management & data fetching
@tanstack/react-query-devtools: ^5.84.2
@tanstack/react-query-next-experimental: ^5.84.2
axios: ^1.11.0                        # HTTP client
class-variance-authority: ^0.7.1      # CSS class utilities
clsx: ^2.1.1                          # Conditional CSS classes
keyboardjs: ^2.7.0                    # Keyboard shortcuts
lucide-react: ^0.539.0                # Icon library
next: 15.4.6                          # React framework
next-themes: ^0.4.6                   # Theme switching
pdfjs-dist: ^5.4.54                   # PDF.js library
react: ^18                             # React core
react-dom: ^18                         # React DOM
react-draggable: ^4.5.0               # Draggable components
react-hook-form: ^7.62.0              # Form management
react-pageflip: ^2.0.3                # Page flip animation
react-pdf: ^10.0.1                    # PDF viewer
react-share: ^5.2.2                   # Social sharing
react-zoom-pan-pinch: ^3.7.0          # Zoom & pan functionality
screenfull: ^6.0.2                    # Fullscreen API
sonner: ^2.0.7                        # Toast notifications
tailwind-merge: ^3.3.1                # Tailwind CSS utilities
zod: ^4.0.17                          # Schema validation
```

### **Dev Dependencies**
```
@eslint/eslintrc: ^3                  # ESLint configuration
@tailwindcss/postcss: ^4              # Tailwind CSS PostCSS
@types/keyboardjs: ^2.5.3             # TypeScript types
@types/node: ^20                      # Node.js types
@types/react: ^18                     # React types
@types/react-dom: ^18                 # React DOM types
eslint: ^9                            # Code linting
eslint-config-next: 15.4.6            # Next.js ESLint config
tailwindcss: ^4                       # CSS framework
tw-animate-css: ^1.3.6                # Tailwind animations
typescript: ^5                         # TypeScript compiler
```

## 🏗️ **Cấu trúc thư mục**

```
quan-ly-thu-vien-customer/
├── .next/                             # Next.js build output
├── .git/                              # Git repository
├── node_modules/                      # Dependencies
├── public/                            # Static assets
├── src/                               # Source code
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # Authentication routes (no header/footer)
│   │   │   ├── login/                 # Login page
│   │   │   │   └── page.tsx           # Login page component
│   │   │   └── layout.tsx             # Auth layout (no header/footer)
│   │   ├── (main)/                    # Main routes với RootLayoutShell
│   │   │   ├── books/                 # Books pages
│   │   │   │   └── [slug]/            # Dynamic book routes
│   │   │   │       └── register/      # Book registration page
│   │   │   │           └── page.tsx   # Registration page component
│   │   │   ├── layout.tsx             # Main layout với RootLayoutShell
│   │   │   └── page.tsx               # Home page
│   │   ├── favicon.ico                # Site icon
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout (chỉ có QueryClientProviders)
│   │   └── page.tsx                   # Root page (redirect to main)
│   │
│   ├── apis/                          # API client functions
│   │   ├── auth.ts                    # Authentication API
│   │   ├── books.ts                   # Books API
│   │   ├── borrow-records.ts          # Borrow records API
│   │   ├── ebooks.ts                  # E-books API
│   │   ├── fines.ts                   # Fines API
│   │   ├── index.ts                   # API exports
│   │   ├── notifications.ts           # Notifications API
│   │   ├── physical-copies.ts         # Physical copies API
│   │   ├── reader-types.ts            # Reader types API
│   │   ├── readers.ts                 # Readers API
│   │   ├── renewals.ts                # Renewals API
│   │   ├── reservations.ts            # Reservations API
│   │   └── uploads.ts                 # File uploads API
│   │
│   ├── components/                    # Reusable components
│   │   ├── ui/                        # Base UI components
│   │   │   ├── admin-notification-form.tsx
│   │   │   ├── button.tsx             # Button component
│   │   │   ├── dialog.tsx             # Dialog component
│   │   │   ├── dropdown-menu.tsx      # Dropdown menu
│   │   │   ├── form.tsx               # Form components
│   │   │   ├── input.tsx              # Input component
│   │   │   ├── label.tsx              # Label component
│   │   │   ├── loading.tsx            # Loading states
│   │   │   ├── notification-dropdown.tsx
│   │   │   ├── send-reminder-form.tsx
│   │   │   ├── sonner.tsx             # Toast notifications
│   │   │   └── textarea.tsx           # Textarea component
│   │   │
│   │   ├── auth/                      # Authentication components
│   │   │   ├── AuthProvider.tsx       # Auth context provider
│   │   │   ├── AuthTest.tsx           # Auth testing component
│   │   │   ├── index.ts               # Auth exports
│   │   │   └── LoginDialog.tsx        # Login dialog
│   │   │
│   │   ├── flipbook-viewer/           # PDF/Flipbook viewer
│   │   │   ├── toolbar/               # Viewer toolbar
│   │   │   │   ├── slider-nav/        # Navigation slider
│   │   │   │   ├── toolbar.tsx        # Main toolbar
│   │   │   │   └── zoom.tsx           # Zoom controls
│   │   │   │
│   │   │   ├── flipbook/              # Flipbook components
│   │   │   │   ├── flipbook.tsx       # Main flipbook
│   │   │   │   ├── flipbook-loader.tsx # Loading component
│   │   │   │   └── pdf-page.tsx       # PDF page renderer
│   │   │   │
│   │   │   ├── pad-loading/           # Loading animations
│   │   │   │   ├── pdf-loading.tsx    # PDF loading
│   │   │   │   └── style.css          # Loading styles
│   │   │   │
│   │   │   ├── flipbook-viewer.tsx    # Main viewer component
│   │   │   └── share.tsx              # Sharing functionality
│   │   │
│   │   ├── layout/                    # Layout components
│   │   │   └── Footer.tsx             # Site footer
│   │   │
│   │   ├── navigation/                # Navigation components
│   │   │   └── Navbar.tsx             # Navigation bar
│   │   │
│   │   ├── providers/                 # Context providers
│   │   │   └── query-client-provider.tsx # React Query provider
│   │   │
│   │   ├── uploads/                   # Upload components
│   │   │   └── UploadTest.tsx         # Upload testing
│   │   │
│   │   └── register-library-card-dialog.tsx # Library card registration
│   │
│   ├── configs/                       # Configuration files
│   │   └── instances.ts               # Axios instances & config
│   │
│   ├── contexts/                      # React contexts
│   │   └── AuthContext.tsx            # Authentication context
│   │
│   ├── features/                      # Feature-based components
│   │   ├── home/                      # Home page features
│   │   │   └── components/            # Home components
│   │   │       ├── BannerSection.tsx  # Banner section
│   │   │       ├── BookSection.tsx    # Books display
│   │   │       ├── CategoriesSection.tsx # Categories
│   │   │       ├── HeroSection.tsx    # Hero section
│   │   │       ├── MediaSection.tsx   # Media content
│   │   │       └── index.ts           # Home exports
│   │   │
│   │   ├── book-detail/               # Book detail features
│   │   │   └── components/            # Book detail components
│   │   │       ├── BookDetailFooter.tsx # Book footer
│   │   │       ├── BookDetailHeader.tsx # Book header
│   │   │       ├── BookDetailHero.tsx   # Book hero section
│   │   │       ├── BookIntroduction.tsx # Book introduction
│   │   │       ├── CommentsSection.tsx  # Comments
│   │   │       ├── RelatedBooks.tsx     # Related books
│   │   │       └── index.ts             # Book detail exports
│   │   │
│   │   └── (main)/                    # Main feature components
│   │       └── books/                 # Books feature
│   │           └── [slug]/            # Dynamic book routes
│   │               └── register/      # Book registration feature
│   │                   └── components/ # Registration components
│   │                       ├── BookInfoCard.tsx      # Book information display
│   │                       ├── ErrorState.tsx        # Error handling states
│   │                       ├── LoadingState.tsx      # Loading states
│   │                       ├── PageHeader.tsx        # Page header
│   │                       ├── RegistrationForm.tsx  # Registration form
│   │                       └── index.ts              # Component exports
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── queries/                   # React Query hooks
│   │   │   ├── books.ts               # Books queries
│   │   │   ├── ebooks.ts              # E-books queries
│   │   │   └── uploads.ts             # Uploads queries
│   │   │
│   │   ├── use-debounce.ts            # Debounce utility
│   │   ├── use-ref-size.ts            # Ref size hook
│   │   ├── use-screensize.ts          # Screen size hook
│   │   ├── useAdminNotifications.ts   # Admin notifications
│   │   ├── useNotifications.ts        # User notifications
│   │   ├── reader-types.ts            # Reader types hooks
│   │   ├── readers.ts                 # Readers hooks
│   │   ├── renewals.ts                # Renewals hooks
│   │   ├── reservations.ts            # Reservations hooks
│   │   ├── uploads.ts                 # Uploads hooks
│   │   ├── auth.ts                    # Authentication hooks
│   │   ├── books.ts                   # Books hooks
│   │   ├── borrow-records.ts          # Borrow records hooks
│   │   ├── ebooks.ts                  # E-books hooks
│   │   ├── fines.ts                   # Fines hooks
│   │   ├── index.ts                   # Hooks exports
│   │   └── physical-copies.ts         # Physical copies hooks
│   │
│   ├── layouts/                       # Layout components
│   │   ├── components/                # Layout sub-components
│   │   │   ├── Footer.tsx             # Layout footer
│   │   │   ├── Header.tsx             # Layout header
│   │   │   └── index.ts               # Layout exports
│   │   └── root-layout.tsx            # Root layout wrapper
│   │
│   ├── lib/                           # Utility libraries
│   │   └── utils.ts                   # Common utilities
│   │
│   └── types/                         # TypeScript type definitions
│       ├── auth.ts                    # Authentication types
│       ├── books.ts                   # Books types
│       ├── borrow-records.ts          # Borrow records types
│       ├── ebooks.ts                  # E-books types
│       ├── fines.ts                   # Fines types
│       ├── index.ts                   # Types exports
│       ├── physical-copies.ts         # Physical copies types
│       ├── reader-types.ts            # Reader types
│       ├── readers.ts                 # Readers types
│       ├── renewals.ts                # Renewals types
│       ├── reservations.ts            # Reservations types
│       └── uploads.ts                 # Uploads types
│
├── templates/                          # HTML templates
├── .env                               # Environment variables
├── .gitignore                         # Git ignore rules
├── components.json                     # Component configuration
├── eslint.config.mjs                  # ESLint configuration
├── next.config.ts                     # Next.js configuration
├── package.json                       # Dependencies & scripts
├── postcss.config.mjs                 # PostCSS configuration
├── README.md                          # Project documentation
├── system.md                          # This file
└── tsconfig.json                      # TypeScript configuration
```

## 🚀 **Scripts**

```json
{
  "dev": "next dev --turbopack",      # Development server với Turbopack
  "build": "next build",               # Production build
  "start": "next start",               # Production server
  "lint": "next lint"                  # Code linting
}
```

## 🎯 **Kiến trúc ứng dụng**

### **Framework & Architecture**
- **Next.js 15.4.6** với App Router
- **React 18** với TypeScript
- **Tailwind CSS 4** cho styling
- **React Query (TanStack Query)** cho state management
- **Routing**: App Router với dynamic routes, nested layouts và route groups
- **Route Groups**:
  - `(auth)` group cho authentication routes không có header/footer
  - `(main)` group cho main routes với RootLayoutShell (header/footer)
- **Layout Strategy**: Root layout chỉ cung cấp providers, route groups quyết định layout riêng

### **UI Components**
- **Radix UI** cho accessible components
- **Lucide React** cho icons
- **Custom UI components** được xây dựng trên Radix UI

### **State Management**
- **React Context** cho global state (Auth)
- **React Query** cho server state
- **React Hook Form** cho form management

### **Features**
- **Authentication system** với JWT
  - Login dialog component
  - Dedicated login page (`/login`)
  - Form validation với Zod
  - Password visibility toggle
  - Redirect logic sau khi đăng nhập thành công
- **PDF/Flipbook viewer** với react-pageflip
- **File uploads** với drag & drop
- **Responsive design** với Tailwind CSS
- **Theme switching** với next-themes
- **Book registration system** với component-based architecture
  - Modular components cho registration flow
  - Error handling states
  - Loading states
  - Form validation

### **API Integration**
- **Axios** cho HTTP requests
- **RESTful API** endpoints
- **Type-safe** với TypeScript interfaces
- **Error handling** với centralized interceptors

## 📱 **Responsive Design**
- Mobile-first approach
- Tailwind CSS breakpoints
- Custom hooks cho screen size detection

## 🔐 **Security Features**
- JWT authentication
- Protected routes
- Role-based access control
- Secure file uploads
- Authentication routes (`/login`)
- Form validation và error handling
- Redirect after login functionality

## 🏗️ **Component Architecture**

### **Feature-based Organization**
- **Home features**: Hero, banner, book sections
- **Book detail features**: Hero, introduction, comments, related books
- **Registration features**: Modular components cho book registration
  - `LoadingState`: Loading animations
  - `ErrorState`: Centralized error handling với 7 error types
  - `BookInfoCard`: Book information display
  - `RegistrationForm`: Form handling với validation
  - `PageHeader`: Page navigation

### **Component Benefits**
- **Reusability**: Components có thể được sử dụng ở nhiều nơi
- **Maintainability**: Mỗi component có trách nhiệm riêng biệt
- **Testability**: Có thể test từng component riêng lẻ
- **Type Safety**: Interface rõ ràng cho mỗi component
- **Code Organization**: Logic được tổ chức theo feature

## 📚 **Documentation**
- Component documentation
- API documentation
- Type definitions
- Usage examples
- System architecture documentation

---

> **Lưu ý**: File này nên được cập nhật mỗi khi có thay đổi về cấu trúc thư mục, dependencies hoặc kiến trúc ứng dụng.
