// Save data migration chain (v1 → v2 → v3 → ...)
// Add migration functions here when data structure changes.

interface SaveData {
  version: number;
  state: unknown;
  savedAt: number;
}

export function migrateSave(_data: SaveData): null {
  // Example: if (data.version === 1) return migrateV1toV2(data.state);
  // Currently at v1 — no migrations needed.
  return null;
}
