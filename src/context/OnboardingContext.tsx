import React from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  type FlatList,
} from 'react-native';

export type SliderProps = {
  currentPage: number;
  numberOfScreens: number;
  nextPage: (animated?: boolean) => void;
  previousPage: (animated?: boolean) => void;
  scrollTo: (index: number, animated?: boolean) => void;
};

type OnboardingContextType = SliderProps & {
  setCurrentPage: (index: number) => void;
  flatListRef: React.RefObject<FlatList>;
  // Callback ref forwarded to the underlying FlatList. Exposing a setter (vs.
  // the ref object itself) keeps consumers React-Compiler-safe: assigning a
  // foreign ref object to a `ref` prop is flagged as "ref access during
  // render", whereas a callback ref is not.
  setFlatListRef: (node: FlatList | null) => void;
  width?: number;
  numberOfScreens: number;
  progress: number;
  scrollEnabled?: boolean;
  enableScroll: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isDone: boolean;
  pauseAutoPlay: () => void;
  resumeAutoPlay: () => void;
};

type OnboardingProviderProps = {
  children: React.ReactNode;
  width?: number;
  numberOfScreens: number;
  scrollEnabled?: boolean;
  onPageChange?: (index: number) => void;
  scrollAnimationDuration?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
};

export const OnboardingContext = React.createContext<
  OnboardingContextType | undefined
>(undefined);

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
  width: widthProp,
  numberOfScreens,
  scrollEnabled,
  onPageChange,
  scrollAnimationDuration,
  autoPlay = false,
  autoPlayInterval = 3000,
  loop = false,
}) => {
  const width = widthProp ?? Dimensions.get('window').width;
  const getProgress = (page: number) => {
    return Math.round(((page + 1) / numberOfScreens) * 100);
  };

  const [currentPage, setPage] = React.useState(0);
  const [progress, setProgress] = React.useState(getProgress(0));
  const [isDone, setIsDone] = React.useState(false);
  const [enableScroll, setEnableScroll] = React.useState<boolean | undefined>(
    scrollEnabled
  );
  const flatListRef = React.useRef<FlatList | null>(null);
  const setFlatListRef = React.useCallback((node: FlatList | null) => {
    flatListRef.current = node;
  }, []);
  // Tracks the latest page so timers/animations read a fresh value without
  // needing to be recreated on every page change.
  const currentPageRef = React.useRef(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(autoPlay);

  // Dedicated value used to honor a custom scrollAnimationDuration. FlatList's
  // own animated scroll has a fixed, platform-controlled duration, so when a
  // duration is requested we drive the offset manually via this value.
  const scrollAnim = React.useMemo(() => new Animated.Value(0), []);
  React.useEffect(() => {
    const id = scrollAnim.addListener(({ value }) => {
      flatListRef.current?.scrollToOffset({ offset: value, animated: false });
    });
    return () => scrollAnim.removeListener(id);
  }, [scrollAnim]);

  const animateToOffset = React.useCallback(
    (offset: number, animated: boolean) => {
      if (!flatListRef.current) return;
      if (animated && scrollAnimationDuration) {
        scrollAnim.stopAnimation();
        scrollAnim.setValue(width * currentPageRef.current);
        Animated.timing(scrollAnim, {
          toValue: offset,
          duration: scrollAnimationDuration,
          useNativeDriver: false,
        }).start();
      } else {
        flatListRef.current.scrollToOffset({ offset, animated });
      }
    },
    [scrollAnim, scrollAnimationDuration, width]
  );

  const setCurrentPage = React.useCallback(
    (index: number) => {
      setPage(index);
      currentPageRef.current = index;
      setProgress(Math.round(((index + 1) / numberOfScreens) * 100));
      setIsDone(index === numberOfScreens - 1);
      onPageChange?.(index);
      // No-op when no screen reader is active; announces the page otherwise.
      AccessibilityInfo.announceForAccessibility(
        `Page ${index + 1} of ${numberOfScreens}`
      );
    },
    [numberOfScreens, onPageChange]
  );

  const nextPage = React.useCallback(
    (animated: boolean = true) => {
      const current = currentPageRef.current;
      if (current < numberOfScreens - 1) {
        animateToOffset(width * (current + 1), animated);
        setCurrentPage(current + 1);
      } else if (loop) {
        animateToOffset(0, animated);
        setCurrentPage(0);
      }
    },
    [numberOfScreens, loop, width, animateToOffset, setCurrentPage]
  );

  const previousPage = React.useCallback(
    (animated: boolean = true) => {
      const current = currentPageRef.current;
      if (current > 0) {
        animateToOffset(width * (current - 1), animated);
        setCurrentPage(current - 1);
      } else if (loop) {
        animateToOffset(width * (numberOfScreens - 1), animated);
        setCurrentPage(numberOfScreens - 1);
      }
    },
    [numberOfScreens, loop, width, animateToOffset, setCurrentPage]
  );

  const scrollTo = React.useCallback(
    (index: number, animated: boolean = true) => {
      if (index >= 0 && index < numberOfScreens) {
        animateToOffset(index * width, animated);
        setCurrentPage(index);
      }
    },
    [numberOfScreens, width, animateToOffset, setCurrentPage]
  );

  const pauseAutoPlay = React.useCallback(() => setIsAutoPlaying(false), []);
  const resumeAutoPlay = React.useCallback(
    () => setIsAutoPlaying(autoPlay),
    [autoPlay]
  );

  // Autoplay timer. Recreated whenever the page changes so it always advances
  // from the current position; pauses when the user interacts with the slider.
  React.useEffect(() => {
    if (!isAutoPlaying || numberOfScreens <= 1) return;
    if (!loop && currentPage >= numberOfScreens - 1) return;
    const timer = setTimeout(() => nextPage(true), autoPlayInterval);
    return () => clearTimeout(timer);
  }, [
    isAutoPlaying,
    currentPage,
    numberOfScreens,
    autoPlayInterval,
    loop,
    nextPage,
  ]);

  const contextValue: OnboardingContextType = {
    scrollEnabled: enableScroll,
    enableScroll: setEnableScroll,
    currentPage,
    numberOfScreens,
    nextPage,
    previousPage,
    setCurrentPage,
    flatListRef,
    setFlatListRef,
    scrollTo,
    progress,
    isDone,
    pauseAutoPlay,
    resumeAutoPlay,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};
