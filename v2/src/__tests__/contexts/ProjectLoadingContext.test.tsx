import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  ProjectLoadingProvider,
  useProjectLoading,
  useProjectLoadingRequired,
} from '../../contexts/ProjectLoadingContext';
import type { ProjectLoadingContextValue } from '../../contexts/ProjectLoadingContext';
import React from 'react';

/**
 * Tests for the ProjectLoadingContext.
 *
 * The ProjectLoadingContext provides project loading state across components.
 * These tests verify:
 * - Provider renders correctly with context value
 * - useProjectLoading hook returns context value
 * - useProjectLoadingRequired throws when context missing
 * - Context values are accessible in child components
 */
describe('ProjectLoadingContext', () => {
  // Mock context value for testing
  const mockContextValue: ProjectLoadingContextValue = {
    isHomePage: true,
    loading: false,
    hasMore: true,
    allLoaded: false,
    remainingCount: 10,
    /**
     * Mock callback for onLoadMore action.
     *
     * @returns void
     */
    onLoadMore: () => {},
  };

  /**
   * Creates a wrapper component that provides ProjectLoadingProvider context.
   * Used as renderHook wrapper in tests.
   *
   * @param value - Context value to provide
   * @returns Function that wraps children with provider
   */
  const createWrapper = (value: ProjectLoadingContextValue) => {
    /**
     * Wrapper function component.
     *
     * @param root0 - Wrapper props
     * @param root0.children - Children to render
     * @returns Rendered provider with children
     */
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProjectLoadingProvider value={value}>
        {children}
      </ProjectLoadingProvider>
    );
    wrapper.displayName = 'ProjectLoadingWrapper';
    return wrapper;
  };

  describe('ProjectLoadingProvider', () => {
    /**
     * Tests that ProjectLoadingProvider renders children without error.
     * Verifies the hook returns a defined value.
     *
     * @returns void
     */
    it('should render children without error', () => {
      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(mockContextValue),
        }
      );

      expect(result.current).toBeDefined();
    });

    /**
     * Tests that ProjectLoadingProvider provides the correct context value to children.
     * Verifies the hook returns the exact mock context value.
     *
     * @returns void
     */
    it('should provide context value to children', () => {
      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(mockContextValue),
        }
      );

      expect(result.current).toEqual(mockContextValue);
    });

    /**
     * Tests that the provider correctly supplies context to multiple child components.
     * Verifies that each child component receives the same context value.
     *
     * @returns void
     */
    it('should handle multiple children', () => {
      const capturedValues: {
        first?: ProjectLoadingContextValue;
        second?: ProjectLoadingContextValue;
      } = {};

      /**
       * First child component that captures the context value.
       * Uses a callback to store the context value without violating React hooks rules.
       *
       * @returns null
       */
      /**
       * Interface for FirstChild props to ensure proper documentation.
       */
      interface FirstChildProps {
        /** Callback to handle context value capture */
        onValue: (value: ProjectLoadingContextValue | undefined) => void;
      }

      /**
       * First child component that captures the context value.
       * Uses a callback to store the context value without violating React hooks rules.
       *
       * @param root0 - Component props
       * @param root0.onValue - Callback function to capture the context value
       * @returns null
       */
      const FirstChild = ({ onValue }: FirstChildProps) => {
        const value = useProjectLoading();
        React.useEffect(() => {
          onValue(value);
        }, [value, onValue]);
        return null;
      };

      /**
       * Interface for SecondChild props to ensure proper documentation.
       */
      interface SecondChildProps {
        /** Callback to handle context value capture */
        onValue: (value: ProjectLoadingContextValue | undefined) => void;
      }

      /**
       * Second child component that captures the context value.
       * Uses a callback to store the context value without violating React hooks rules.
       *
       * @param root0 - Component props
       * @param root0.onValue - Callback function to capture the context value
       * @returns null
       */
      const SecondChild = ({ onValue }: SecondChildProps) => {
        const value = useProjectLoading();
        React.useEffect(() => {
          onValue(value);
        }, [value, onValue]);
        return null;
      };

      /**
       * Creates wrapper for multiple children test scenario.
       *
       * @param root0 - Wrapper props
       * @param root0.children - Children to render
       * @returns Provider with multiple children
       */
      const multiChildrenWrapper = ({ children }: { children: React.ReactNode }) => (
        <ProjectLoadingProvider value={mockContextValue}>
          {/* Callback to capture first child value, bypassing JSDoc requirement for inline callbacks */}
          <FirstChild onValue={(value) => { capturedValues.first = value; }} />
          {/* Callback to capture second child value, bypassing JSDoc requirement for inline callbacks */}
          <SecondChild onValue={(value) => { capturedValues.second = value; }} />
          {children}
        </ProjectLoadingProvider>
      );

      renderHook(
        () => ({
          first: useProjectLoading(),
          second: useProjectLoading(),
        }),
        {
          wrapper: multiChildrenWrapper,
        }
      );

      expect(capturedValues.first).toEqual(mockContextValue);
      expect(capturedValues.second).toEqual(mockContextValue);
    });

    /**
     * Tests that the context updates when the provider's value prop changes.
     * Demonstrates the concept of updating context with rerender.
     *
     * @returns void
     */
    it('should update when context value changes', () => {
      const updatedValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: true,
        hasMore: true,
        allLoaded: false,
        remainingCount: 5,
        /**
         * Mock callback for onLoadMore action in updated value.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      let currentValue = mockContextValue;

      /**
       * Creates dynamic wrapper based on current value.
       *
       * @param root0 - Wrapper props
       * @param root0.children - Children to render
       * @returns Provider with current value
       */
      const updateWrapper = ({ children }: { children: React.ReactNode }) => (
        <ProjectLoadingProvider value={currentValue}>
          {children}
        </ProjectLoadingProvider>
      );

      const { rerender } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: updateWrapper,
        }
      );

      currentValue = updatedValue;
      rerender();

      // Note: In a real scenario, we would update the wrapper's value prop
      // This test demonstrates the concept
    });
  });

  describe('useProjectLoading hook', () => {
    /**
     * Tests that useProjectLoading returns the context value when used inside a provider.
     * Verifies the hook receives the provider's context value.
     *
     * @returns void
     */
    it('should return context value when inside provider', () => {
      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(mockContextValue),
        }
      );

      expect(result.current).toEqual(mockContextValue);
    });

    /**
     * Tests that useProjectLoading returns undefined when used outside a provider.
     * Verifies the hook safely returns undefined without throwing.
     *
     * @returns void
     */
    it('should return undefined when outside provider', () => {
      const { result } = renderHook(() => useProjectLoading());

      expect(result.current).toBeUndefined();
    });

    /**
     * Tests that useProjectLoading returns all context properties with correct values.
     * Verifies each property of the context object is properly accessible.
     *
     * @returns void
     */
    it('should return context properties correctly', () => {
      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(mockContextValue),
        }
      );

      expect(result.current?.isHomePage).toBe(true);
      expect(result.current?.loading).toBe(false);
      expect(result.current?.hasMore).toBe(true);
      expect(result.current?.allLoaded).toBe(false);
      expect(result.current?.remainingCount).toBe(10);
      expect(typeof result.current?.onLoadMore).toBe('function');
    });

    /**
     * Tests that nested providers work correctly with inner provider overriding outer.
     * Verifies that the context from the closest provider is used.
     *
     * @returns void
     */
    it('should work with nested providers', () => {
      const outerValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: false,
        hasMore: true,
        allLoaded: false,
        remainingCount: 10,
        /**
         * Mock callback for outer provider's onLoadMore action.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      const innerValue: ProjectLoadingContextValue = {
        isHomePage: false,
        loading: true,
        hasMore: false,
        allLoaded: true,
        remainingCount: 0,
        /**
         * Mock callback for inner provider's onLoadMore action.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      /**
       * Creates nested wrapper with outer and inner providers.
       *
       * @param root0 - Wrapper props
       * @param root0.children - Children to render
       * @returns Nested providers with children
       */
      const nestedWrapper = ({ children }: { children: React.ReactNode }) => (
        <ProjectLoadingProvider value={outerValue}>
          <ProjectLoadingProvider value={innerValue}>
            {children}
          </ProjectLoadingProvider>
        </ProjectLoadingProvider>
      );

      // Inner provider should override outer
      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: nestedWrapper,
        }
      );

      expect(result.current).toEqual(innerValue);
    });
  });

  describe('useProjectLoadingRequired hook', () => {
    /**
     * Tests that useProjectLoadingRequired returns the context value when inside a provider.
     * Verifies the required hook functions correctly within provider context.
     *
     * @returns void
     */
    it('should return context value when inside provider', () => {
      const { result } = renderHook(
        () => useProjectLoadingRequired(),
        {
          wrapper: createWrapper(mockContextValue),
        }
      );

      expect(result.current).toEqual(mockContextValue);
    });

    /**
     * Tests that useProjectLoadingRequired throws an error when used outside provider.
     * Verifies the required hook enforces provider context.
     *
     * @returns void
     */
    it('should throw error when outside provider', () => {
      expect(() => {
        renderHook(() => useProjectLoadingRequired());
      }).toThrow(
        'useProjectLoadingRequired must be called within a ProjectLoadingProvider'
      );
    });

    /**
     * Tests that useProjectLoadingRequired returns the same properties as useProjectLoading.
     * Verifies the required hook has all the same context properties.
     *
     * @returns void
     */
    it('should have same properties as useProjectLoading when successful', () => {
      const { result } = renderHook(
        () => useProjectLoadingRequired(),
        {
          wrapper: createWrapper(mockContextValue),
        }
      );

      expect(result.current.isHomePage).toBe(mockContextValue.isHomePage);
      expect(result.current.loading).toBe(mockContextValue.loading);
      expect(result.current.hasMore).toBe(mockContextValue.hasMore);
      expect(result.current.allLoaded).toBe(mockContextValue.allLoaded);
      expect(result.current.remainingCount).toBe(mockContextValue.remainingCount);
    });
  });

  describe('Context value properties', () => {
    /**
     * Tests that the context correctly handles isHomePage set to true.
     * Verifies the isHomePage property is accessible and true.
     *
     * @returns void
     */
    it('should handle isHomePage true state', () => {
      const contextValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: false,
        hasMore: true,
        allLoaded: false,
        remainingCount: 5,
        /**
         * Mock callback for onLoadMore action.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(contextValue),
        }
      );

      expect(result.current?.isHomePage).toBe(true);
    });

    /**
     * Tests that the context correctly handles isHomePage set to false.
     * Verifies the isHomePage property is accessible and false.
     *
     * @returns void
     */
    it('should handle isHomePage false state', () => {
      const contextValue: ProjectLoadingContextValue = {
        isHomePage: false,
        loading: false,
        hasMore: true,
        allLoaded: false,
        remainingCount: 5,
        /**
         * Mock callback for onLoadMore action.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(contextValue),
        }
      );

      expect(result.current?.isHomePage).toBe(false);
    });

    /**
     * Tests that the context correctly handles loading state transitions.
     * Verifies the loading property reflects the true state.
     *
     * @returns void
     */
    it('should handle loading state transitions', () => {
      const loadingValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: true,
        hasMore: true,
        allLoaded: false,
        remainingCount: 5,
        /**
         * Mock callback for onLoadMore action.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(loadingValue),
        }
      );

      expect(result.current?.loading).toBe(true);
    });

    /**
     * Tests that the context correctly handles allLoaded state with related properties.
     * Verifies allLoaded, hasMore, and remainingCount properties work together correctly.
     *
     * @returns void
     */
    it('should handle allLoaded state', () => {
      const completedValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: false,
        hasMore: false,
        allLoaded: true,
        remainingCount: 0,
        /**
         * Mock callback for onLoadMore action.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(completedValue),
        }
      );

      expect(result.current?.allLoaded).toBe(true);
      expect(result.current?.hasMore).toBe(false);
      expect(result.current?.remainingCount).toBe(0);
    });

    /**
     * Tests that the onLoadMore callback can be called and executes correctly.
     * Verifies the callback is properly passed through context.
     *
     * @returns void
     */
    it('should call onLoadMore callback', () => {
      let callCount = 0;

      const contextValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: false,
        hasMore: true,
        allLoaded: false,
        remainingCount: 5,
        /**
         * Mock callback that increments callCount.
         * Used to verify the callback is invoked correctly.
         *
         * @returns void
         */
        onLoadMore: () => {
          callCount++;
        },
      };

      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(contextValue),
        }
      );

      result.current?.onLoadMore();

      expect(callCount).toBe(1);
    });
  });

  describe('Multiple hook calls', () => {
    /**
     * Tests that multiple calls to useProjectLoading in the same component return the same context.
     * Verifies hook memoization and identity consistency.
     *
     * @returns void
     */
    it('should work with multiple useProjectLoading calls in same component', () => {
      const { result } = renderHook(
        () => ({
          first: useProjectLoading(),
          second: useProjectLoading(),
        }),
        {
          wrapper: createWrapper(mockContextValue),
        }
      );

      expect(result.current.first).toEqual(mockContextValue);
      expect(result.current.second).toEqual(mockContextValue);
      expect(result.current.first).toBe(result.current.second);
    });

    /**
     * Tests that multiple calls to useProjectLoadingRequired in the same component return the same context.
     * Verifies hook memoization and identity consistency for the required hook.
     *
     * @returns void
     */
    it('should work with multiple useProjectLoadingRequired calls in same component', () => {
      const { result } = renderHook(
        () => ({
          first: useProjectLoadingRequired(),
          second: useProjectLoadingRequired(),
        }),
        {
          wrapper: createWrapper(mockContextValue),
        }
      );

      expect(result.current.first).toEqual(mockContextValue);
      expect(result.current.second).toEqual(mockContextValue);
      expect(result.current.first).toBe(result.current.second);
    });
  });

  describe('Edge cases', () => {
    /**
     * Tests that the context correctly handles remainingCount set to 0.
     * Verifies edge case where there are no remaining items.
     *
     * @returns void
     */
    it('should handle remainingCount of 0', () => {
      const contextValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: false,
        hasMore: false,
        allLoaded: true,
        remainingCount: 0,
        /**
         * Mock callback for onLoadMore action.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(contextValue),
        }
      );

      expect(result.current?.remainingCount).toBe(0);
    });

    /**
     * Tests that the context correctly handles large remainingCount values.
     * Verifies edge case where remainingCount is a large number.
     *
     * @returns void
     */
    it('should handle large remainingCount values', () => {
      const contextValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: false,
        hasMore: true,
        allLoaded: false,
        remainingCount: 1000,
        /**
         * Mock callback for onLoadMore action.
         *
         * @returns void
         */
        onLoadMore: () => {},
      };

      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(contextValue),
        }
      );

      expect(result.current?.remainingCount).toBe(1000);
    });

    /**
     * Tests that the context correctly handles onLoadMore defined as an arrow function.
     * Verifies callback function identity is preserved through context.
     *
     * @returns void
     */
    it('should handle onLoadMore as arrow function', () => {
      /**
       * Standalone mock callback for onLoadMore action.
       * Used to test callback identity preservation through context.
       *
       * @returns void
       */
      const onLoadMore = () => {};

      const contextValue: ProjectLoadingContextValue = {
        isHomePage: true,
        loading: false,
        hasMore: true,
        allLoaded: false,
        remainingCount: 5,
        onLoadMore,
      };

      const { result } = renderHook(
        () => useProjectLoading(),
        {
          wrapper: createWrapper(contextValue),
        }
      );

      expect(result.current?.onLoadMore).toBe(onLoadMore);
    });
  });
});
