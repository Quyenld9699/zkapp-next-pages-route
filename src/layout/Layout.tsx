import { Box } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import ToastNotifier from 'src/components/ToastNotifier/ToastNotifier';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import InitStateAll from 'src/states';

export const sibarWidth = '260px';
export const headerHeight = '68px';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>Auxo App</title>
                <meta name="description" content="auxo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <InitStateAll />
            <Box sx={{ overflow: 'hidden', position: 'relative' }}>
                <Sidebar />
                <Box sx={{ ml: sibarWidth, position: 'relative' }}>
                    <Header />
                    {children}
                </Box>
                <ToastNotifier />
            </Box>
        </>
    );
}
