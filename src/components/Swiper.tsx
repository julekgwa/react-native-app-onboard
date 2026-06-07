import React from 'react';
import { OnboardingPages } from './OnboardingPages';
import { CustomPages } from './CustomPages';
import {
  Animated,
  I18nManager,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useOnboarding } from '../hooks/useOnboarding';
import type { OnboardingProps } from '../types';

export const Swiper: React.FC<OnboardingProps> = (props) => {
  // `scrollX` is always JS-driven because the background-color interpolation
  // cannot run on the native thread. When `useNativeDriver` is enabled we also
  // keep `nativeScrollX`, driven natively, for transform/opacity animations
  // (the pagination dots), and mirror its offset onto `scrollX` via a JS
  // listener so the color interpolation keeps working.
  const scrollX = React.useMemo(() => new Animated.Value(0), []);
  const nativeScrollX = React.useMemo(() => new Animated.Value(0), []);
  const nativeDriverEnabled = props.useNativeDriver ?? false;
  const dotsAnimatedValue = nativeDriverEnabled ? nativeScrollX : scrollX;

  // Direction handling: default to the device direction. We only mirror
  // manually (via scaleX) when the requested direction differs from the
  // device's — when they match, React Native already lays the row out
  // correctly and an extra flip would double-invert it.
  const rtl = props.rtl ?? I18nManager.isRTL;
  const mirror = rtl !== I18nManager.isRTL;

  const {
    setFlatListRef,
    setCurrentPage,
    currentPage,
    numberOfScreens,
    nextPage,
    scrollTo,
    scrollEnabled,
    pauseAutoPlay,
  } = useOnboarding();

  // When `skipToPage` is set, "Skip" navigates within the flow instead of
  // exiting it (so `onSkip` is not called in that case).
  const { skipToPage, onSkip } = props;
  const handleSkip = React.useCallback(() => {
    if (skipToPage != null) {
      scrollTo(skipToPage);
    } else {
      onSkip?.();
    }
  }, [skipToPage, scrollTo, onSkip]);

  const onScroll = React.useMemo(
    () =>
      nativeDriverEnabled
        ? Animated.event(
            [{ nativeEvent: { contentOffset: { x: nativeScrollX } } }],
            {
              useNativeDriver: true,
              listener: (event: NativeSyntheticEvent<NativeScrollEvent>) =>
                scrollX.setValue(event.nativeEvent.contentOffset.x),
            }
          )
        : Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          }),
    [nativeDriverEnabled, nativeScrollX, scrollX]
  );

  // Stop autoplay as soon as the user takes manual control of the slider.
  const onScrollBeginDrag = React.useCallback(
    () => pauseAutoPlay(),
    [pauseAutoPlay]
  );

  const shared = {
    setFlatListRef,
    scrollX,
    dotsAnimatedValue,
    onScroll,
    onScrollBeginDrag,
    setPage: setCurrentPage,
    currentPage,
    numberOfScreens,
    nextPage,
    scrollTo,
    scrollEnabled,
    mirror,
    onSkip: handleSkip,
  };

  if (props.children) {
    return (
      <CustomPages {...props} {...shared}>
        {props.children}
      </CustomPages>
    );
  }

  return <OnboardingPages {...props} {...shared} pages={props.pages || []} />;
};
