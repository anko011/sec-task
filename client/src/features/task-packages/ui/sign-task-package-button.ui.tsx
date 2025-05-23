import { CheckIcon } from '@radix-ui/react-icons';
import type { IconButtonProps } from '@radix-ui/themes';
import { IconButton, Tooltip } from '@radix-ui/themes';

import { Link } from '~/shared/ui/link';

export type SignTaskPackageButtonProps = IconButtonProps & {};

export function SignTaskPackageButton({ ...props }: SignTaskPackageButtonProps) {
    return (
        <Tooltip content="Закрыть пакет задач">
            <Link asChild to="#">
                <IconButton color="jade" highContrast {...props}>
                    <CheckIcon />
                </IconButton>
            </Link>
        </Tooltip>
    );
}
