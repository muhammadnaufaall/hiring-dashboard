'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './use-auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'applicant';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { loading, isAuthenticated, isAdmin, isApplicant } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      // Check role requirements
      if (requiredRole === 'admin' && !isAdmin) {
        router.push('/unauthorized');
        return;
      }

      if (requiredRole === 'applicant' && !isApplicant) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [
    loading,
    isAuthenticated,
    isAdmin,
    isApplicant,
    requiredRole,
    router,
    pathname,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return null;
  }

  // Check role
  if (requiredRole === 'admin' && !isAdmin) {
    return null;
  }

  if (requiredRole === 'applicant' && !isApplicant) {
    return null;
  }

  return <>{children}</>;
}
