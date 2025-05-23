import { Theme } from '@radix-ui/themes';
import { createContext, type ReactNode, useContext, useState } from 'react';

type ThemeState = {
    changeTheme: () => void;
    mode: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children?: ReactNode }) {
    const theme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const [mode, setMode] = useState<'light' | 'dark'>(theme ?? 'light');

    const changeTheme = () => {
        setMode((prev) => {
            const theme = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            return theme;
        });
    };

    return (
        <ThemeContext.Provider value={{ changeTheme, mode }}>
            <Theme appearance={mode} panelBackground="translucent">
                {children}
            </Theme>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context == null) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}
