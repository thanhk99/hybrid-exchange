import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
      return result;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      onError?.(error);
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    refetch
  };
}

export function useMutation<T, P = any>(
  apiFunction: (params: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const mutate = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(params);
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
      return result;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(error);
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset
  };
}