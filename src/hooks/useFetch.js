import { useCallback, useEffect, useState } from 'react';
export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => { setLoading(true); setError(null);
    fn().then(setData).catch((e) => setError(e?.response?.data?.message || e.message || 'Something went wrong')).finally(() => setLoading(false));
  }, deps);
  useEffect(() => { run(); }, [run]);
  return { data, loading, error, reload: run };
}
