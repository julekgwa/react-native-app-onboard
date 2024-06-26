import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { useOnboarding } from 'react-native-app-onboard';
import { Dots } from './Dots';
import { Button } from './Button';

const { width } = Dimensions.get('window');

export function Screen5() {
  const { nextPage } = useOnboarding();
  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require('../images/screen5.png')}
      />
      <View style={styles.bottomContainer}>
        <Button
          backgroundColor="#fff"
          color="#000"
          onPress={() => nextPage()}
        />
        <Dots
          activeDotColor="#fff"
          showCircle
          inActiveDotStyle={styles.inActiveDot}
          innerCircleColor="#fff"
          activeBackgroundColor="#ffd5a9"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover', // or 'stretch'
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    padding: 20,
    gap: 10,
  },
  inActiveDot: {
    backgroundColor: '#fff',
  },
});
