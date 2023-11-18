import { atom, useAtom } from 'jotai';

export type THEME_MODE = 'dark' | 'light';

const theme = atom<THEME_MODE>('light');

export const useThemeData = () => useAtom(theme);
