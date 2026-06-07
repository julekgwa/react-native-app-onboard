import React from 'react';
import { Image, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Onboarding } from 'react-native-app-onboard';

type ScreenProps = {
  onDone: () => void;
};

export function Basic(props: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={false}
        barStyle="light-content"
        backgroundColor="#140E17"
      />
      <Onboarding
        showDone={true}
        showSkip={true}
        showNext={true}
        showPrevious={true}
        onSkip={props.onDone}
        onDone={props.onDone}
        onPageChange={(index) => console.log('Page changed to', index)}
        skipButtonPosition="top-right"
        paginationPosition="bottom"
        paginationStyle="progress"
        dotsAreTappable={true}
        autoPlay={true}
        autoPlayInterval={4000}
        loop={true}
        useNativeDriver={true}
        nextLabel="Volgende"
        skipLabel="Overslaan"
        previousLabel="Terug"
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
