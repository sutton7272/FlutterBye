import { Suspense, ReactNode } from 'react';
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
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}