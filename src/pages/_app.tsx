import { Provider as JotaiProvider } from 'jotai';
import type { AppProps } from 'next/app';
import Layout from 'src/layout/Layout';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <JotaiProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </JotaiProvider>
    );
}
