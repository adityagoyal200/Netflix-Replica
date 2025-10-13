import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SWRConfig } from 'swr';
import fetcher from '@/libs/fetcher';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import '../styles/globals.css';

export default function App({ 
  Component, 
  pageProps: {
    session,
    ...pageProps
  }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{
        fetcher,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 2000, // 2 seconds deduplication
        focusThrottleInterval: 5000, // 5 seconds throttle
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        loadingTimeout: 3000,
        // Cache configuration
        provider: () => new Map(),
        onError: (error) => {
          console.error('SWR Error:', error);
        },
        onLoadingSlow: (key) => {
          console.warn('SWR Loading slow:', key);
        },
        onSuccess: (data, key) => {
          // Optional: Log successful data fetches in development
          if (process.env.NODE_ENV === 'development') {
            console.log('SWR Success:', key);
          }
        }
      }}>
        <PerformanceMonitor />
        <Component {...pageProps} />
        <Analytics />
      </SWRConfig>
    </SessionProvider>
  );
}

