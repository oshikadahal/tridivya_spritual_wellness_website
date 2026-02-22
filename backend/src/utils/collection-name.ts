export function resolveCollectionName(baseName: string): string {
  const prefix = process.env.TEST_COLLECTION_PREFIX;
  if (process.env.NODE_ENV === 'test' && prefix) {
    return `${prefix}${baseName}`;
  }
  return baseName;
}
