import React from 'react';
import { Swiper } from './components';
import { OnboardingProvider } from './context/OnboardingContext';
import type { OnboardingProps } from './types';

export { useOnboarding } from './hooks/useOnboarding';
export type { Page } from './components/Page';
export type { OnboardingProps } from './types';
export {
  createOnboardingStorage,
  hasCompletedOnboarding,
  markOnboardingComplete,
  resetOnboarding,
} from './utils/persistence';
export type { OnboardingStorageAdapter } from './utils/persistence';

export function Onboarding(props: OnboardingProps) {
  const numberOfScreens = React.Children.count(props.children);
  return (
    <OnboardingProvider
      width={props.width}
      scrollEnabled={props.scrollEnabled}
      onPageChange={props.onPageChange}
      scrollAnimationDuration={props.scrollAnimationDuration}
      autoPlay={props.autoPlay}
      autoPlayInterval={props.autoPlayInterval}
      loop={props.loop}
      numberOfScreens={numberOfScreens || props.pages?.length || 0}
    >
      <Swiper {...props}>{props.children}</Swiper>
    </OnboardingProvider>
  );
}
