import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Button, Flex, type FlexProps, IconButton } from '@radix-ui/themes';
import type { ReactNode } from 'react';

/** Пропсы компонента {@link Pagination} */
export type PaginationProps = FlexProps & {
    /** Текущая страница */
    currentPage: number;
    /** Количество видимы страниц вокруг активной */
    maxVisiblePages?: number;
    /** Обработчик смены страницы */
    onPageChange?: (page: number) => void;
    /** Общее количество страниц */
    totalPages: number;
};

/**
 * Вычисляет диапазон видимых страниц для пагинации.
 *
 * @param maxVisiblePages - Максимальное количество видимых страниц.
 * @param currentPage - Текущая страница.
 * @param totalPages - Общее количество страниц.
 * @returns Объект с начальной и конечной страницами диапазона.
 * startPage - Начальная страница диапазона.
 * endPage - Конечная страница диапазона.
 *
 * @example
 * const {startPage, endPage} = getPageRange(5, 10, 20);
 * console.log(startPage); // 8
 * console.log(endPage); // 12
 */
function getPageRange(maxVisiblePages: number, currentPage: number, totalPages: number) {
    const half = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - half);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return { endPage, startPage };
}

/**
 * Компонент пагинации для навигации по страницам.
 *
 * @param props - Свойства компонента.
 * @param props.currentPage - Текущая активная страница.
 * @param [props.maxVisiblePages] - Максимальное количество видимых страниц в пагинации.
 * @param [props.onPageChange] - Функция обратного вызова, вызываемая при изменении страницы.
 * @param props.totalPages - Общее количество страниц.
 * @param [props...] - Дополнительные свойства для контейнера пагинации (например, стили).
 * @returns Компонент пагинации.
 *
 * @example
 * <Pagination
 *   currentPage={5}
 *   totalPages={20}
 *   onPageChange={(page) => console.log('Переход на страницу:', page)}
 * />
 */
export function Pagination({ currentPage, maxVisiblePages = 5, onPageChange, totalPages, ...props }: PaginationProps) {
    const handlePageChange = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) onPageChange?.(page);
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
