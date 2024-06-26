import React from 'react';
import { Onboarding } from 'react-native-app-onboard';
import { Screen1 } from './components/Screen1';
import { Screen3 } from './components/Screen3';
import { Screen2 } from './components/Screen2';
import { Screen4 } from './components/Screen4';
import { Screen5 } from './components/Screen5';
import { Screen6 } from './screens/Screen6';

type ScreenProps = {
  onDone: () => void;
};

export function Custom(props: ScreenProps) {
  return (
    <Onboarding
      showDone={true}
      onDone={props.onDone}
      scrollEnabled={false}
      showPagination={false}
    >
      <Screen1 />
      <Screen2 />
      <Screen3 />
      <Screen4 />
      <Screen5 />
      <Screen6 onDone={props.onDone} />
    </Onboarding>
  );
}
