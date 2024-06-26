import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useOnboarding } from 'react-native-app-onboard';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import { Octicons } from '@expo/vector-icons';
import { Dots } from './Dots';
const { width } = Dimensions.get('window');

export function Screen3() {
  const { progress, nextPage } = useOnboarding();

  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require('../images/screen3.png')}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Title Goes Here</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            porta ipsum
          </Text>
        </View>
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => nextPage()}>
            <CircularProgressBase
              inActiveStrokeColor="#666666"
              activeStrokeColor="#fff"
              activeStrokeWidth={3}
              inActiveStrokeWidth={3}
              radius={30}
              value={progress}
            >
              <Octicons name="chevron-right" size={24} color="black" />
            </CircularProgressBase>
          </TouchableOpacity>
          <Dots />
        </View>
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
    padding: 30,
    height: 220,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 50,
  },
  button: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonContainer: {
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
  },
  titleContainer: {
    flex: 1,
    gap: 10,
  },
});
