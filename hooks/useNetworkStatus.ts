// Powered by OnSpace.AI - Network Status Hook
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
}

export function useNetworkStatus(): NetworkState {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: true,
    isInternetReachable: true,
  });

  useEffect(() => {
    // Web always connected (SSR safe)
    if (Platform.OS === 'web') return;

    let unsubscribe: (() => void) | undefined;

    const setupNetInfo = async () => {
      try {
        const NetInfo = await import('@react-native-community/netinfo');
        unsubscribe = NetInfo.default.addEventListener(state => {
          setNetworkState({
            isConnected: state.isConnected ?? true,
            isInternetReachable: state.isInternetReachable,
          });
        });
        // Initial fetch
        const state = await NetInfo.default.fetch();
        setNetworkState({
          isConnected: state.isConnected ?? true,
          isInternetReachable: state.isInternetReachable,
        });
      } catch {
        // NetInfo not available — assume connected
      }
    };

    setupNetInfo();
    return () => unsubscribe?.();
  }, []);

  return networkState;
}
