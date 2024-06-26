import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
import { Dots } from './Dots';
import { Button } from './Button';
import { useOnboarding } from 'react-native-app-onboard';

const { width } = Dimensions.get('window');

export function Screen4() {
  const { nextPage } = useOnboarding();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.backgroundImage}
          source={require('../images/Screen4.png')}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Title Goes Here</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            porta ipsum
          </Text>

          <Button onPress={() => nextPage()} />
        </View>
        <Dots inActiveDotStyle={styles.inActiveDot} showCircle={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
  imageContainer: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#F6F6F7',
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover', // or 'stretch'
  },
  inActiveDot: {
    backgroundColor: '#666666',
  },
  titleContainer: {
    backgroundColor: 'white',
    marginTop: -20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 34,
  },
  subtitle: {
    color: '#756F6F',
    fontSize: 14,
    lineHeight: 20,
  },
});
