import React from 'react';
import { Toaster } from '../components/ui/sonner';
import { AuthProvider } from '@/modules/auth/auth.provider';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Toaster closeButton position="bottom-left" />
      <AuthProvider>{children}</AuthProvider>
    </React.Fragment>
  );
}

export default Providers;
