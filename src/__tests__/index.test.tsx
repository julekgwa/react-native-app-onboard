import React from 'react';
import { Text } from 'react-native';
import { act, create } from 'react-test-renderer';
import {
  Onboarding,
  useOnboarding,
  createOnboardingStorage,
  hasCompletedOnboarding,
  markOnboardingComplete,
  resetOnboarding,
  type OnboardingStorageAdapter,
} from 'react-native-app-onboard';
import type { Page } from 'react-native-app-onboard';
import { OnboardingProvider } from '../context/OnboardingContext';

const minimalPages: Page[] = [
  {
    title: 'Welcome',
    subtitle: 'Get started',
    image: <Text>Image</Text>,
    backgroundColor: '#ffffff',
  },
];

const threePages: Page[] = [
  { title: 'A', subtitle: 'a', image: <Text>A</Text>, backgroundColor: '#fff' },
  { title: 'B', subtitle: 'b', image: <Text>B</Text>, backgroundColor: '#333' },
  { title: 'C', subtitle: 'c', image: <Text>C</Text>, backgroundColor: '#09f' },
];

// Captures the latest context value so tests can drive navigation directly.
function captureContext() {
  const ref: { current: ReturnType<typeof useOnboarding> | null } = {
    current: null,
  };
  function Capture() {
    ref.current = useOnboarding();
    return null;
  }
  return { ref, Capture };
}

describe('react-native-app-onboard', () => {
  describe('exports', () => {
    it('exports Onboarding component and useOnboarding hook', () => {
      expect(typeof Onboarding).toBe('function');
      expect(typeof useOnboarding).toBe('function');
    });
  });

  describe('Onboarding', () => {
    it('renders without crashing for a single page', () => {
      const tree = create(
        <Onboarding pages={minimalPages} onDone={() => {}} />
      );
      expect(tree.toJSON()).toBeDefined();
    });

    it('renders the progress pagination variant', () => {
      const tree = create(
        <Onboarding pages={threePages} paginationStyle="progress" />
      );
      expect(tree.toJSON()).toBeDefined();
    });

    it('renders with useNativeDriver enabled', () => {
      const tree = create(<Onboarding pages={threePages} useNativeDriver />);
      expect(tree.toJSON()).toBeDefined();
    });

    it('mirrors the slider when rtl differs from the device direction', () => {
      // Device defaults to LTR in the test env, so rtl forces a manual mirror.
      let tree: any;
      act(() => {
        tree = create(<Onboarding pages={threePages} rtl />);
      });
      const mirrored = tree.root.findAll((n: any) => {
        const s = n.props?.style;
        const flat = Array.isArray(s)
          ? Object.assign({}, ...s.filter(Boolean))
          : s;
        return !!flat?.transform?.some?.((t: any) => t.scaleX === -1);
      });
      expect(mirrored.length).toBeGreaterThan(0);
    });

    it('forwards scrollEnabled to the pages FlatList', () => {
      let tree: any;
      act(() => {
        tree = create(<Onboarding pages={threePages} scrollEnabled={false} />);
      });
      const lists = tree.root.findAll(
        (n: any) => n.props?.pagingEnabled === true
      );
      expect(lists.length).toBeGreaterThan(0);
      expect(lists.some((n: any) => n.props.scrollEnabled === false)).toBe(
        true
      );
    });

    it('does not mirror by default (matches device direction)', () => {
      let tree: any;
      act(() => {
        tree = create(<Onboarding pages={threePages} />);
      });
      const mirrored = tree.root.findAll((n: any) => {
        const s = n.props?.style;
        const flat = Array.isArray(s)
          ? Object.assign({}, ...s.filter(Boolean))
          : s;
        return !!flat?.transform?.some?.((t: any) => t.scaleX === -1);
      });
      expect(mirrored.length).toBe(0);
    });
  });

  describe('useOnboarding', () => {
    it('throws when used outside OnboardingProvider', () => {
      function ComponentUsingHook() {
        useOnboarding();
        return null;
      }
      expect(() => create(<ComponentUsingHook />)).toThrow(
        'useOnboarding must be used within an OnboardingProvider'
      );
    });
  });

  describe('navigation (#6, #7)', () => {
    it('advances, retreats, and fires onPageChange', () => {
      const onPageChange = jest.fn();
      const { ref, Capture } = captureContext();
      act(() => {
        create(
          <OnboardingProvider numberOfScreens={3} onPageChange={onPageChange}>
            <Capture />
          </OnboardingProvider>
        );
      });

      expect(ref.current?.currentPage).toBe(0);

      act(() => ref.current?.nextPage(false));
      expect(ref.current?.currentPage).toBe(1);
      expect(onPageChange).toHaveBeenLastCalledWith(1);

      act(() => ref.current?.previousPage(false));
      expect(ref.current?.currentPage).toBe(0);
      expect(onPageChange).toHaveBeenLastCalledWith(0);
    });

    it('does not advance past the last page without loop', () => {
      const { ref, Capture } = captureContext();
      act(() => {
        create(
          <OnboardingProvider numberOfScreens={2}>
            <Capture />
          </OnboardingProvider>
        );
      });
      act(() => ref.current?.nextPage(false));
      act(() => ref.current?.nextPage(false));
      expect(ref.current?.currentPage).toBe(1);
      expect(ref.current?.isDone).toBe(true);
    });

    it('wraps around when loop is enabled', () => {
      const { ref, Capture } = captureContext();
      act(() => {
        create(
          <OnboardingProvider numberOfScreens={2} loop>
            <Capture />
          </OnboardingProvider>
        );
      });
      act(() => ref.current?.previousPage(false));
      expect(ref.current?.currentPage).toBe(1);
    });
  });

  describe('autoplay (#9)', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('advances automatically and stops when paused', () => {
      const onPageChange = jest.fn();
      const { ref, Capture } = captureContext();
      act(() => {
        create(
          <OnboardingProvider
            numberOfScreens={3}
            autoPlay
            autoPlayInterval={1000}
            onPageChange={onPageChange}
          >
            <Capture />
          </OnboardingProvider>
        );
      });

      act(() => jest.advanceTimersByTime(1000));
      expect(ref.current?.currentPage).toBe(1);

      act(() => ref.current?.pauseAutoPlay());
      act(() => jest.advanceTimersByTime(5000));
      expect(ref.current?.currentPage).toBe(1);
    });
  });
});

describe('per-page features & skipToPage', () => {
  const byLabel = (tree: any, label: string) =>
    tree.root.findAll(
      (n: any) =>
        n.props?.accessibilityRole === 'button' &&
        n.props?.accessibilityLabel === label
    );

  it('renders a custom per-page background element', () => {
    let tree: any;
    act(() => {
      tree = create(
        <Onboarding
          pages={[
            { ...threePages[0]!, background: <Text>BG-MARKER</Text> },
            threePages[1]!,
          ]}
        />
      );
    });
    const markers = tree.root.findAll(
      (n: any) => n.props?.children === 'BG-MARKER'
    );
    expect(markers.length).toBeGreaterThan(0);
  });

  it('applies per-page button label overrides', () => {
    let tree: any;
    act(() => {
      tree = create(
        <Onboarding
          showNext
          pages={[
            { ...threePages[0]!, nextLabel: 'ALPHA-NEXT' },
            threePages[1]!,
          ]}
        />
      );
    });
    expect(byLabel(tree, 'ALPHA-NEXT').length).toBeGreaterThan(0);
  });

  it('disables Next when canSwipeForward is false', () => {
    let tree: any;
    act(() => {
      tree = create(
        <Onboarding
          showNext
          pages={[
            { ...threePages[0]!, canSwipeForward: false },
            threePages[1]!,
          ]}
        />
      );
    });
    const disabled = tree.root.findAll(
      (n: any) =>
        n.props?.accessibilityRole === 'button' &&
        n.props?.accessibilityState?.disabled === true
    );
    expect(disabled.length).toBeGreaterThan(0);
  });

  it('disables swiping when the current page is gated', () => {
    let tree: any;
    act(() => {
      tree = create(
        <Onboarding
          pages={[
            { ...threePages[0]!, canSwipeForward: false },
            threePages[1]!,
          ]}
        />
      );
    });
    const lists = tree.root.findAll(
      (n: any) => n.props?.pagingEnabled === true
    );
    expect(lists.some((n: any) => n.props.scrollEnabled === false)).toBe(true);
  });

  it('skipToPage navigates instead of firing onSkip', () => {
    const onSkip = jest.fn();
    let tree: any;
    act(() => {
      tree = create(
        <Onboarding
          showSkip
          skipToPage={2}
          onSkip={onSkip}
          pages={threePages}
        />
      );
    });
    act(() => byLabel(tree, 'Skip')[0]?.props.onPress());
    expect(onSkip).not.toHaveBeenCalled();
  });

  it('Skip fires onSkip when skipToPage is not set', () => {
    const onSkip = jest.fn();
    let tree: any;
    act(() => {
      tree = create(<Onboarding showSkip onSkip={onSkip} pages={threePages} />);
    });
    act(() => byLabel(tree, 'Skip')[0]?.props.onPress());
    expect(onSkip).toHaveBeenCalled();
  });

  it('navigates when the controlled currentPage prop changes', () => {
    const onPageChange = jest.fn();
    let tree: any;
    act(() => {
      tree = create(
        <Onboarding
          pages={threePages}
          currentPage={0}
          onPageChange={onPageChange}
        />
      );
    });
    act(() => {
      tree.update(
        <Onboarding
          pages={threePages}
          currentPage={2}
          onPageChange={onPageChange}
        />
      );
    });
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it('renders with a per-page isLight override', () => {
    let tree: any;
    act(() => {
      // A dark page forced light — should still render without crashing.
      tree = create(
        <Onboarding
          pages={[{ ...threePages[1]!, isLight: true }, threePages[2]!]}
        />
      );
    });
    expect(tree.toJSON()).toBeDefined();
  });

  const titleHasOpacity = (tree: any) =>
    tree.root
      .findAll((n: any) => n.props?.children === 'A')
      .some((n: any) => {
        const arr = Array.isArray(n.props.style)
          ? n.props.style
          : [n.props.style];
        return arr.some(
          (x: any) => x && typeof x === 'object' && 'opacity' in x
        );
      });

  it('applies a staggered entrance when animatePages is set', () => {
    // Fake timers so the entrance animation's JS-driven frames can be drained
    // here; otherwise a timer outlives the test and fires after Jest teardown.
    jest.useFakeTimers();
    let tree: any;
    try {
      act(() => {
        tree = create(<Onboarding pages={threePages} animatePages />);
      });
      act(() => {
        jest.runAllTimers();
      });
      expect(titleHasOpacity(tree)).toBe(true);
    } finally {
      jest.useRealTimers();
    }
  });

  it('has no entrance animation by default', () => {
    let tree: any;
    act(() => {
      tree = create(<Onboarding pages={threePages} />);
    });
    expect(titleHasOpacity(tree)).toBe(false);
  });
});

describe('persistence helpers (#8)', () => {
  const makeStorage = (): OnboardingStorageAdapter & {
    store: Map<string, string>;
  } => {
    const store = new Map<string, string>();
    return {
      store,
      getItem: (k) => Promise.resolve(store.get(k) ?? null),
      setItem: (k, v) => {
        store.set(k, v);
        return Promise.resolve();
      },
      removeItem: (k) => {
        store.delete(k);
        return Promise.resolve();
      },
    };
  };

  it('marks, reads, and resets completion', async () => {
    const storage = makeStorage();
    expect(await hasCompletedOnboarding(storage)).toBe(false);
    await markOnboardingComplete(storage);
    expect(await hasCompletedOnboarding(storage)).toBe(true);
    await resetOnboarding(storage);
    expect(await hasCompletedOnboarding(storage)).toBe(false);
  });

  it('createOnboardingStorage binds storage and a custom key', async () => {
    const storage = makeStorage();
    const onboarding = createOnboardingStorage(storage, 'custom-key');
    expect(await onboarding.hasCompleted()).toBe(false);
    await onboarding.markComplete();
    expect(storage.store.get('custom-key')).toBe('true');
    expect(await onboarding.hasCompleted()).toBe(true);
    await onboarding.reset();
    expect(await onboarding.hasCompleted()).toBe(false);
  });
});
