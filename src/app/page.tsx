'use client';

import Image from 'next/image';
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
