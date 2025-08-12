'use client';

import { AuthProvider as AuthContextProvider } from '@/contexts/AuthContext';
import React, { createContext, useCallback, useContext, useState } from 'react';
import LoginDialog from './LoginDialog';

interface AuthProviderProps {
	children: React.ReactNode;
}

// Create a context for login dialog state
interface LoginDialogContextType {
	isLoginDialogOpen: boolean;
	openLoginDialog: () => void;
	closeLoginDialog: () => void;
	onLoginSuccess?: () => void;
	setOnLoginSuccess: (callback: () => void) => void;
}

const LoginDialogContext = createContext<LoginDialogContextType | undefined>(
	undefined
);

export const useLoginDialog = (): LoginDialogContextType => {
	const context = useContext(LoginDialogContext);
	if (context === undefined) {
		throw new Error('useLoginDialog must be used within an AuthProvider');
	}
	return context;
};

// Main AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
	const [onLoginSuccess, setOnLoginSuccess] = useState<
		(() => void) | undefined
	>(undefined);

	const openLoginDialog = useCallback(() => {
		setIsLoginDialogOpen(true);
	}, []);

	const closeLoginDialog = useCallback(() => {
		setIsLoginDialogOpen(false);
		setOnLoginSuccess(undefined);
	}, []);

	const handleLoginSuccess = useCallback(() => {
		if (onLoginSuccess) {
			onLoginSuccess();
		}
		closeLoginDialog();
	}, [onLoginSuccess, closeLoginDialog]);

	// Create a context value for login dialog
	const loginDialogContext = {
		isLoginDialogOpen,
		openLoginDialog,
		closeLoginDialog,
		onLoginSuccess,
		setOnLoginSuccess,
	};

	return (
		<AuthContextProvider>
			<LoginDialogContext.Provider value={loginDialogContext}>
				{children}
				<LoginDialog
					isOpen={isLoginDialogOpen}
					onClose={closeLoginDialog}
					onSuccess={handleLoginSuccess}
				/>
			</LoginDialogContext.Provider>
		</AuthContextProvider>
	);
};
