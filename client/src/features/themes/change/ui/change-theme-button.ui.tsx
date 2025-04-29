import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';

import { useTheme } from './theme.context';
//TODO: it needs to add a using local storage
export function ChangeThemeButton() {
    const theme = useTheme();
    return (
        <IconButton
            highContrast
            onClick={() => {
                theme.changeTheme();
            }}
        >
            {theme.mode === 'dark' ? <SunIcon /> : <MoonIcon />}
        </IconButton>
    );
}
