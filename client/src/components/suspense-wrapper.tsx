import { Suspense, ReactNode, startTransition, useState, useEffect } from 'react';
import { LoadingSpinner } from './loading-spinner';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  return (
    <Suspense 
      fallback={
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-transparent">
            <LoadingSpinner />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}