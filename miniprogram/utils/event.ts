const evs = new Map<string, Set<Function>>();

export const on = (key: string, fn: Function) => {
  if (!evs.has(key)) evs.set(key, new Set());
  evs.get(key)?.add(fn);
};

export const emit = <R extends unknown[] = [], P extends unknown[] = []>(key: string, ...args: P) => {
  return [...(evs.get(key) ?? [])].map((fn) => fn(...args)) as R;
};

export const off = (key: string, fn: Function) => evs.get(key)?.delete(fn);
