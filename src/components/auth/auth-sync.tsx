'use client';

import { useSyncAuth } from '@/hooks/use-sync-auth';

export function AuthSync() {
	useSyncAuth();
	return null;
}
