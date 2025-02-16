import { Link as RadixLink, type LinkProps as RadixLinkProps } from '@radix-ui/themes';
import type { FC } from 'react';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router';

/**Пропсы компонента Link */
export type LinkProps = RadixLinkProps & {
    /** Ссылка */
    to: string;
};

/**
 * Компонент ссылки
 * @example
 * <Link to="/admin">Админ</Link>
 */
export const Link: FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(({ children, to, ...props }, ref) => (
    <RadixLink asChild ref={ref} {...props}>
        <RouterLink to={to}>{children}</RouterLink>
    </RadixLink>
));
