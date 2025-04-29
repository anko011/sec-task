import { Theme } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

type ThemeState = {
    changeTheme(): void;
    mode: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children?: ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const changeTheme = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
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
