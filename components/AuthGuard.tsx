import React from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Allow access without authentication
  return <>{children}</>;
}