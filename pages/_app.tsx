import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SWRConfig } from 'swr';
import fetcher from '@/libs/fetcher';
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
      }}>
        <Component {...pageProps} />
        <Analytics />
      </SWRConfig>
    </SessionProvider>
  );
}

