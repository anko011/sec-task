/**
 * Рекурсивно удаляет `undefined`, `null`, пустая строка значения, включая вложенные объекты.
 */
export function deepCleanObject<T extends object>(obj: T | undefined | null): Partial<T> {
    if (!obj) return {};

    const filteredEntries = Object.entries(obj)
        .filter(([_, value]) => {
            return value !== undefined && value !== null && value !== '';
        })
        .map(([key, value]) => {
            return [
                key,
                typeof value === 'object' && value !== null && !Array.isArray(value)
                    ? deepCleanObject(value as Record<string, unknown>)
                    : value
            ];
        });

    return Object.fromEntries(filteredEntries) as Partial<T>;
}
