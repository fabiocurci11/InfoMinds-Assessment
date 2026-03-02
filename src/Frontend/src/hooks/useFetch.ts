import { useState, useEffect } from "react";

export function useFetch<T>(baseUrl: string, params: Record<string, string | undefined>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      const startTime = Date.now(); 

      try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const url = `${baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Errore: ${response.status}`);
        const result = await response.json();

        //artificial delay
        const duration = Date.now() - startTime;
        const minWait = 500; 

        if (duration < minWait) {
          await new Promise(resolve => setTimeout(resolve, minWait - duration));
        }

        setData(result as T[]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    }, 500); //debounce time

    return () => clearTimeout(timer);
  }, [baseUrl, JSON.stringify(params)]);

  return { data, loading, error };
}