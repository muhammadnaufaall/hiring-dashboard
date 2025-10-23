'use client';

import { AuthGuard } from '@/modules/auth/auth.guard';
import { useAuth } from '@/modules/auth/use-auth';

export function HomePage(props: PageProps<'/'>) {
  const { user, error, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthGuard requiredRole="admin">
      <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </AuthGuard>
  );
}
