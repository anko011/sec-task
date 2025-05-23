import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Button, Flex, type FlexProps, IconButton } from '@radix-ui/themes';
import type { ReactNode } from 'react';

import type { Paginated } from '~/shared/api';

export type PaginationProps = Omit<FlexProps, 'onChange'> & {
    data: Omit<Paginated<unknown>, 'items'>;
    maxVisiblePages?: number;
    onChange?: (params: { limit: number; offset: number; total?: number }) => void;
};

function getPageRange(maxVisiblePages: number, currentPage: number, totalPages: number) {
    const half = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - half);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return { endPage, startPage };
}

export function Pagination({ data, maxVisiblePages = 5, onChange, ...props }: PaginationProps) {
    const { limit, offset, total } = data;
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (page: number) => {
        const offset = (page - 1) * limit;
        onChange?.({ limit, offset, total });
    };

    const renderPageButton = (page: number) => (
        <Button
            highContrast
            key={page}
            onClick={() => {
                handlePageChange(page);
            }}
            type="button"
            variant={page === currentPage ? 'solid' : 'ghost'}
        >
            {page}
        </Button>
    );

    const renderEllipsis = (key: string) => (
        <Button disabled highContrast key={key} type="button">
            ...
        </Button>
    );

    const { endPage, startPage } = getPageRange(maxVisiblePages, currentPage, totalPages);
    const pages: ReactNode[] = [];

    if (startPage > 1) {
        pages.push(renderPageButton(1));
        if (startPage > 2) pages.push(renderEllipsis('start-ellipsis'));
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(renderPageButton(i));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push(renderEllipsis('end-ellipsis'));
        pages.push(renderPageButton(totalPages));
    }

    return (
        <Flex align="center" gap="4" {...props}>
            <IconButton
                disabled={currentPage <= 1}
                highContrast
                onClick={() => {
                    handlePageChange(currentPage - 1);
                }}
                type="button"
            >
                <ChevronLeftIcon />
            </IconButton>

            {pages}

            <IconButton
                disabled={currentPage >= totalPages}
                highContrast
                onClick={() => {
                    handlePageChange(currentPage + 1);
                }}
                type="button"
            >
                <ChevronRightIcon />
            </IconButton>
        </Flex>
    );
}
