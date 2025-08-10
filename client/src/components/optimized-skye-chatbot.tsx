import { memo, lazy, Suspense } from 'react';

// Lazy load the full Skye chatbot to reduce initial bundle size
const SkyeChatbot = lazy(() => import('./skye-chatbot').then(module => ({ default: module.SkyeChatbot })));

// Lightweight loading placeholder for Skye
const SkyeChatPlaceholder = memo(() => (
  <div className="fixed bottom-4 right-4 z-50">
    <div className="w-12 h-12 bg-electric-blue/20 rounded-full animate-pulse border border-electric-blue/30"></div>
  </div>
));

SkyeChatPlaceholder.displayName = 'SkyeChatPlaceholder';

// Optimized Skye chatbot wrapper with lazy loading
export const OptimizedSkyeChatbot = memo(() => (
  <Suspense fallback={<SkyeChatPlaceholder />}>
    <SkyeChatbot />
  </Suspense>
));

OptimizedSkyeChatbot.displayName = 'OptimizedSkyeChatbot';