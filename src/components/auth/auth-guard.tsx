'use client';

interface AuthGuardProps {
	children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	// Middleware đã handle tất cả logic authentication và routing
	// Component này chỉ cần render children
	return <>{children}</>;
}
