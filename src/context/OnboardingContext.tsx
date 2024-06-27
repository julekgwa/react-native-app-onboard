import React from 'react';
import { Dimensions, type FlatList } from 'react-native';

export type SliderProps = {
  currentPage: number;
  numberOfScreens: number;
  nextPage: (animated?: boolean) => void;
  scrollTo: (index: number, animated?: boolean) => void;
};

type OnboardingContextType = SliderProps & {
  setCurrentPage: (index: number) => void;
  flatListRef: React.RefObject<FlatList>;
  width?: number;
  numberOfScreens: number;
  progress: number;
  scrollEnabled?: boolean;
  enableScroll: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isDone: boolean;
};

type OnboardingProviderProps = {
  children: React.ReactNode;
  width?: number;
  numberOfScreens: number;
  scrollEnabled?: boolean;
};

export const OnboardingContext = React.createContext<
  OnboardingContextType | undefined
>(undefined);

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
  width = Dimensions.get('window').width,
  numberOfScreens,
  scrollEnabled,
}) => {
  const getProgress = (page: number) => {
    return Math.round(((page + 1) / numberOfScreens) * 100);
  };

  const [currentPage, setPage] = React.useState(0);
  const [progress, setProgress] = React.useState(getProgress(0));
  const [isDone, setIsDone] = React.useState(false);
  const [enableScroll, setEnableScroll] = React.useState<boolean | undefined>(
    scrollEnabled
  );
  const flatListRef = React.useRef<FlatList>(null);

  const setCurrentPage = (index: number) => {
    setPage(index);
    setProgress(getProgress(index));
    setIsDone(index === numberOfScreens - 1);
  };

  const nextPage = (animated: boolean = true) => {
    if (flatListRef.current && currentPage < numberOfScreens - 1) {
      flatListRef.current.scrollToOffset({
        offset: width * (currentPage + 1),
        animated: animated,
      });
      setCurrentPage(currentPage + 1);
    }
  };

  const scrollTo = (index: number, animated: boolean = true) => {
    if (flatListRef.current && index >= 0) {
      flatListRef.current.scrollToOffset({
        offset: index * width,
        animated: animated,
      });
      setCurrentPage(index);
    }
  };

  const contextValue: OnboardingContextType = {
    scrollEnabled: enableScroll,
    enableScroll: setEnableScroll,
    currentPage,
    numberOfScreens,
    nextPage,
    setCurrentPage,
    flatListRef,
    scrollTo,
    progress,
    isDone,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};
