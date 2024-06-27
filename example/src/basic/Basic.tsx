import React from 'react';
import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { Onboarding } from 'react-native-app-onboard';

type ScreenProps = {
  onDone: () => void;
};

export function Basic(props: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Onboarding
        showDone={true}
        showSkip={true}
        showNext={true}
        onSkip={props.onDone}
        onDone={props.onDone}
        skipButtonPosition="top-right"
        paginationPosition="bottom"
        pages={[
          {
            backgroundColor: '#140E17',
            image: <Image source={require('./images/image1.png')} />,
            title: 'Find petcare around your location',
            subtitle:
              'Just turn on your location and you will find the nearest pet care you wish.',
          },
          {
            backgroundColor: '#140E17',
            image: <Image source={require('./images/image2.png')} />,
            title: 'Let us give the best treatment',
            subtitle: 'Get the best treatment for your animal with us',
          },
          {
            backgroundColor: '#140E17',
            image: <Image source={require('./images/image3.png')} />,
            title: 'Book appointment with us!',
            subtitle: 'What do you think? book our veterinarians now',
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
