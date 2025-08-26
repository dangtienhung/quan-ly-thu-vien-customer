// Export React Query hooks
export * from './queries/books';
export * from './queries/ebooks';
export * from './queries/uploads';

// Export auth hooks
export * from './auth';

// Export library management hooks
export * from './borrow-records';
export * from './fines';
export * from './physical-copies';
export * from './reader-types';
export * from './readers';
export * from './renewals';
export * from './reservations';

// Export other hooks
export { useLoginDialog } from '@/components/auth/AuthProvider';
export * from './queries/books';
export * from './use-debounce';
export * from './use-ref-size';
export * from './use-screensize';
export * from './useAdminNotifications';
export * from './useNotifications';
