import { DrawingPinIcon } from '@radix-ui/react-icons';
import type { IconButtonProps } from '@radix-ui/themes';
import { IconButton, Tooltip } from '@radix-ui/themes';

import { Link } from '~/shared/ui/link';

export type FixTaskPackageButtonProps = IconButtonProps & {};

export function FixTaskPackageButton({ ...props }: FixTaskPackageButtonProps) {
    return (
        <Tooltip content="Зафиксировать пакет задач">
            <Link asChild to="#">
                <IconButton color="yellow" highContrast {...props}>
                    <DrawingPinIcon />
                </IconButton>
            </Link>
        </Tooltip>
    );
}
