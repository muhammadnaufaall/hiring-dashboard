import React from 'react';
import { Toaster } from '../components/ui/sonner';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Toaster closeButton position="bottom-left" />
      {children}
    </React.Fragment>
  );
}

export default Providers;
