import { useEffect, useState } from 'react';
import type { Overview } from '../lib/types';
import { fetchOverview } from '../lib/api';
import { fallbackOverview } from '../data/fallback';

interface State {
  data: Overview;
  loading: boolean;
  live: boolean;
}

/**
 * Renders instantly with the bundled snapshot, then swaps in live API data
 * once it arrives. No spinner, no layout shift — progressive enhancement.
 */
export function useOverview(): State {
  const [state, setState] = useState<State>({
    data: fallbackOverview,
    loading: true,
    live: false,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    fetchOverview(ctrl.signal)
      .then(({ data, live }) => setState({ data, loading: false, live }))
      .catch(() => setState((s) => ({ ...s, loading: false })));
    return () => ctrl.abort();
  }, []);

  return state;
}
