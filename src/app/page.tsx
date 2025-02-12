'use client';

import { AuthProvider } from './contexts/auth.context';
import AppHome from './pages/AppHome';

export default function Home() {
  return (
    <>
      <AuthProvider>
        <AppHome />
      </AuthProvider>
    </>
  );
}
