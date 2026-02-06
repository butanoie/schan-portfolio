/**
 * Animations context for managing application animations state.
 *
 * Provides animations enabled/disabled state to all components in the application tree.
 *
 * Handles persistence to localStorage and allows users to disable animations
 * for accessibility or preference reasons.
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/**
 * Context value shape for animations management.
 */
interface AnimationsContextType {
  /** Whether animations are enabled */
  animationsEnabled: boolean;

  /** Set whether animations are enabled */
  setAnimationsEnabled: (enabled: boolean) => void;

  /** Whether the component is mounted (for SSR hydration) */
  isMounted: boolean;
}

/**
 * Animations context instance.
 * Provides animations enabled/disabled state to child components.
 */
const AnimationsContext = createContext<AnimationsContextType | undefined>(
  undefined
);

/**
 * Storage key for persisting animations preference.
 */
const ANIMATIONS_STORAGE_KEY = "portfolio-animations-enabled";

/**
 * Provider component that manages animations state.
 *
 * Features:
 * - Persists user preference to localStorage
 * - Defaults to enabled unless explicitly disabled
 * - Prevents flash of unstyled content (FOUC) during hydration
 *
 * @param props - Component props
 * @param props.children - Child components to wrap with animations context
 * @returns Animations provider wrapping children with context
 *
 * @example
 * ```tsx
 * <AnimationsContextProvider>
 *   <App />
 * </AnimationsContextProvider>
 * ```
 */
export function AnimationsContextProvider({ children }: { children: ReactNode }) {
  // Initialize state with stored preference, defaulting to true (animations enabled)
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }
    const saved = localStorage.getItem(ANIMATIONS_STORAGE_KEY);
    // If nothing saved, default to true (animations enabled)
    // If saved, parse as boolean ("true" -> true, "false" -> false)
    return saved === null ? true : saved === "true";
  });

  const [isMounted, setIsMounted] = useState(false);

  /**
   * Initialize mounted flag on mount.
   * The animations state is already initialized during useState,
   * so we only need to set isMounted here.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  /**
   * Update animations state and save preference.
   *
   * @param enabled - Whether animations should be enabled
   */
  const setAnimationsEnabled = (enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    if (typeof window === "undefined") return;

    localStorage.setItem(ANIMATIONS_STORAGE_KEY, String(enabled));

    // Dispatch custom event for other listeners
    const event = new CustomEvent("animationschange", {
      detail: { enabled },
    });
    window.dispatchEvent(event);
  };

  return (
    <AnimationsContext.Provider
      value={{
        animationsEnabled,
        setAnimationsEnabled,
        isMounted,
      }}
    >
      {children}
    </AnimationsContext.Provider>
  );
}

/**
 * Hook to access animations context.
 *
 * @returns Animations context value with animationsEnabled, setAnimationsEnabled, and isMounted
 * @throws Error if used outside of AnimationsContextProvider
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const { animationsEnabled } = useAnimationsContext();
 *   return (
 *     <Box
 *       sx={{
 *         transition: animationsEnabled ? 'all 0.3s ease' : 'none',
 *       }}
 *     >
 *       Content
 *     </Box>
 *   );
 * }
 * ```
 */
export function useAnimationsContext(): AnimationsContextType {
  const context = useContext(AnimationsContext);
  if (!context) {
    throw new Error(
      "useAnimationsContext must be used within an AnimationsContextProvider"
    );
  }
  return context;
}
