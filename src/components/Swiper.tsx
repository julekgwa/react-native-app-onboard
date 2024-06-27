import React from 'react';
import { OnboardingPages } from './OnboardingPages';
import { CustomPages } from './CustomPages';
import { Animated } from 'react-native';
import { useOnboarding } from '../hooks/useOnboarding';
import type { OnboardingProps } from '../types';

export const Swiper: React.FC<OnboardingProps> = (props) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const {
    flatListRef,
    setCurrentPage,
    currentPage,
    numberOfScreens,
    nextPage,
    scrollEnabled,
  } = useOnboarding();
  if (props.children) {
    return (
      <CustomPages
        customFooter={props.customFooter}
        showPagination={props.showPagination}
        flatListRef={flatListRef}
        scrollX={scrollX}
        setPage={setCurrentPage}
        scrollEnabled={scrollEnabled}
        currentPage={currentPage}
        numberOfScreens={numberOfScreens}
        nextPage={nextPage}
        showDone={props.showDone}
        showNext={props.showNext}
        onDone={props.onDone}
        skipButtonContainerStyle={props.skipButtonContainerStyle}
        nextButtonContainerStyle={props.nextButtonContainerStyle}
        doneButtonContainerStyle={props.doneButtonContainerStyle}
        skipButtonPosition={props.skipButtonPosition}
      >
        {props.children}
      </CustomPages>
    );
  }

  return (
    <OnboardingPages
      showDone={props.showDone}
      customFooter={props.customFooter}
      flatListRef={flatListRef}
      scrollX={scrollX}
      setPage={setCurrentPage}
      currentPage={currentPage}
      paginationPosition={props.paginationPosition}
      nextPage={nextPage}
      showSkip={props.showSkip}
      onDone={props.onDone}
      pages={props.pages || []}
      width={props.width}
      showNext={props.showNext}
      skipButtonContainerStyle={props.skipButtonContainerStyle}
      nextButtonContainerStyle={props.nextButtonContainerStyle}
      doneButtonContainerStyle={props.doneButtonContainerStyle}
      skipLabelStyle={props.skipLabelStyle}
      skipButtonPosition={props.skipButtonPosition}
      showPagination={props.showPagination}
      color={props.color}
      onSkip={props.onSkip}
    />
  );
};
