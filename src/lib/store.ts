/**
 * Local file-based JSON store.
 * All data is persisted in .data/ at the project root.
 * This is server-side only (Node.js fs).
 */
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(collection: string) {
  return path.join(DATA_DIR, `${collection}.json`);
}

export function readCollection<T>(collection: string): T[] {
  ensureDir();
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) return [];
  try {
    const raw = fs.readFileSync(fp, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function writeCollection<T>(collection: string, data: T[]): void {
  ensureDir();
  fs.writeFileSync(filePath(collection), JSON.stringify(data, null, 2), "utf-8");
}

export function findById<T extends { id: string }>(collection: string, id: string): T | null {
  const items = readCollection<T>(collection);
  return items.find((i) => i.id === id) ?? null;
}

export function insertOne<T extends { id: string }>(collection: string, item: T): T {
  const items = readCollection<T>(collection);
  items.push(item);
  writeCollection(collection, items);
  return item;
}

export function updateOne<T extends { id: string }>(
  collection: string,
  id: string,
  updates: Partial<T>
): T | null {
  const items = readCollection<T>(collection);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  writeCollection(collection, items);
  return items[idx];
}

export function deleteOne(collection: string, id: string): boolean {
  const items = readCollection<{ id: string }>(collection);
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  writeCollection(collection, next);
  return true;
}

/** Returns true if a collection file already exists and is non-empty. */
export function isSeeded(collection: string): boolean {
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) return false;
  try {
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"));
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}
