import { ResetIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function BackButton() {
    const navigate = useNavigate();
    const location = useLocation();
    const [historyStack, setHistoryStack] = useState<string[]>([]);

    useEffect(() => {
        setHistoryStack((prev) => [...prev, location.key]);
    }, [location]);

    const canGoBack = historyStack.length > 1;

    const handleGoBack = () => {
        if (canGoBack) {
            void navigate(-1);
        }
    };

    return (
        <IconButton disabled={!canGoBack} onClick={handleGoBack} variant="ghost">
            <ResetIcon />
        </IconButton>
    );
}
