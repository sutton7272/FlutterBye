import { Suspense, ReactNode } from 'react';
import { FastLoadingFallback } from './fast-loading-fallback';

interface SuspenseWrapperProps {
  children: ReactNode;
}

export function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={<FastLoadingFallback />}>
      {children}
    </Suspense>
  );
}