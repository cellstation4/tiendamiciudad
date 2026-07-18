export function accessibleStoreWhere(userId: string, slug: string) {
  return {
    userId,
    store: { slug, deletedAt: null },
  } as const;
}

