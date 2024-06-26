import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useOnboarding } from 'react-native-app-onboard';

const { width } = Dimensions.get('window');

export function Screen1() {
  const { nextPage } = useOnboarding();
  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require('../images/screen1.png')}
      />
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Screen 1</Text>
        <Text>
          Sit adipisicing consequat aliqua pariatur exercitation occaecat amet
          velit ad voluptate.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => nextPage()}>
            <Octicons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
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
    padding: 20,
    backgroundColor: 'white',
    height: 250,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#42095F',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
});
