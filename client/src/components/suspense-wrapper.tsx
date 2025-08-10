import { Suspense, ReactNode } from 'react';
import { SimpleFallback } from './simple-fallback';

interface SuspenseWrapperProps {
  children: ReactNode;
}

export function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return (
    <Suspense fallback={<SimpleFallback />}>
      {children}
    </Suspense>
  );
}