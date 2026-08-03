import { redirect } from 'next/navigation';

/**
 * Root page redirects to /login (unauthenticated) or /chat (authenticated).
 * Per Frontend-Architecture §4.1: "Redirects to /chat or /login based on auth status"
 * For now, always redirect to /login until auth middleware is implemented.
 */
export default function RootPage() {
  redirect('/login');
}
