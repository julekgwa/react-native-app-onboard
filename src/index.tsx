import React from 'react';
import { Swiper } from './components/Swiper';
import { OnboardingProvider } from './context/OnboardingContext';
import type { OnboardingProps } from './types';

export { useOnboarding } from './hooks/useOnboarding';

export function Onboarding(props: OnboardingProps) {
  const numberOfScreens = React.Children.count(props.children);
  return (
    <OnboardingProvider
      scrollEnabled={props.scrollEnabled}
      numberOfScreens={numberOfScreens || props.pages?.length || 0}
    >
      <Swiper {...props}>{props.children}</Swiper>
    </OnboardingProvider>
  );
}
