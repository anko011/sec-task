/**
 * Рекурсивно удаляет `undefined` и `null` значения, включая вложенные объекты.
 * Если нужно фильтровать только `undefined`, замените проверку на `value == null`.
 */
export function deepCleanObject<T extends Record<string, unknown>>(
  obj: T | undefined | null,
): Partial<T> {
  if (!obj) return {};

  const filteredEntries = Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null) // Фильтруем и undefined, и null
    .map(([key, value]) => [
      key,
      typeof value === 'object' && value !== null && !Array.isArray(value)
        ? deepCleanObject(value as Record<string, unknown>)
        : value,
    ]);

  return Object.fromEntries(filteredEntries) as Partial<T>;
}
