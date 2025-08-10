import { memo, lazy, Suspense } from 'react';

// Lazy load the full navbar to reduce initial bundle size
const Navbar = lazy(() => import('./navbar'));

// Lightweight navbar skeleton
const NavbarSkeleton = memo(() => (
  <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75">
    <div className="container mx-auto px-4">
      <div className="flex h-16 items-center justify-between">
        <div className="w-32 h-8 bg-slate-700 rounded animate-pulse"></div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-8 bg-slate-700 rounded animate-pulse"></div>
          <div className="w-24 h-8 bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </header>
));

NavbarSkeleton.displayName = 'NavbarSkeleton';

// Optimized navbar wrapper with lazy loading
export const OptimizedNavbar = memo(() => (
  <Suspense fallback={<NavbarSkeleton />}>
    <Navbar />
  </Suspense>
));

OptimizedNavbar.displayName = 'OptimizedNavbar';