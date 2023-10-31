export function mapKeys(obj: object, keyUpdater: (key: string) => string) {
  return Object.entries(obj).reduce(
    (acc, [key, val]) => {
      const updatedKey = keyUpdater(key);
      acc[updatedKey] = val;
      return acc;
    },
    {} as Record<string | number, unknown>,
  );
}
