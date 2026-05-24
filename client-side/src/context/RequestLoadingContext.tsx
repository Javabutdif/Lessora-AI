import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { subscribeToRequestLoading } from "../services/api";

type RequestLoadingContextValue = {
  activeRequestCount: number;
  isLoading: boolean;
  suppressGlobalOverlay: () => () => void;
};

const RequestLoadingContext = createContext<RequestLoadingContextValue | undefined>(
  undefined,
);

export function RequestLoadingProvider({ children }: PropsWithChildren) {
  const [activeRequestCount, setActiveRequestCount] = useState(0);
  const [overlaySuppressions, setOverlaySuppressions] = useState(0);

  useEffect(() => {
    return subscribeToRequestLoading(setActiveRequestCount);
  }, []);

  const suppressGlobalOverlay = useCallback(() => {
    setOverlaySuppressions((count) => count + 1);

    return () => {
      setOverlaySuppressions((count) => Math.max(0, count - 1));
    };
  }, []);

  const value = useMemo(
    () => ({
      activeRequestCount,
      isLoading: activeRequestCount > 0,
      suppressGlobalOverlay,
    }),
    [activeRequestCount, suppressGlobalOverlay],
  );
  const showGlobalOverlay = value.isLoading && overlaySuppressions === 0;

  return (
    <RequestLoadingContext.Provider value={value}>
      <View className="flex-1">
        {children}
        {showGlobalOverlay ? (
          <View
            pointerEvents="auto"
            className="absolute inset-0 z-50 items-center justify-center bg-navy/20 px-8"
          >
            <View className="items-center rounded-2xl bg-white px-6 py-5 shadow-sm shadow-navy/10">
              <ActivityIndicator color="#2F5BFF" size="large" />
              <Text className="mt-3 text-center font-poppins-semi text-sm text-secondary">
                Loading
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </RequestLoadingContext.Provider>
  );
}

export function useRequestLoading() {
  const context = useContext(RequestLoadingContext);

  if (!context) {
    throw new Error("useRequestLoading must be used inside RequestLoadingProvider");
  }

  return context;
}

export function useSuppressGlobalRequestOverlay() {
  const { suppressGlobalOverlay } = useRequestLoading();

  useEffect(() => suppressGlobalOverlay(), [suppressGlobalOverlay]);
}
