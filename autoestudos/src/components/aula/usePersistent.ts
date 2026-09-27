import {useCallback, useMemo} from 'react';
import {useStorageSlot} from '@docusaurus/theme-common';

/**
 * Estado JSON persistido no localStorage (via storage slot do Docusaurus).
 * No SSR e na primeira renderização devolve `initial`, então não há mismatch
 * de hidratação. Falhas de storage viram no-op.
 */
export function usePersistent<T>(key: string, initial: T): [T, (next: T) => void, () => void] {
  const [raw, slot] = useStorageSlot(`autoestudos:${key}`);
  const value = useMemo<T>(() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);
  const set = useCallback((next: T) => slot.set(JSON.stringify(next)), [slot]);
  const reset = useCallback(() => slot.del(), [slot]);
  return [value, set, reset];
}
