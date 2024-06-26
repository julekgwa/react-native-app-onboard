import React from 'react';
import { View, StyleSheet, Image, Dimensions, Text } from 'react-native';
import { Button } from '../components/Button';

const { width } = Dimensions.get('window');

type Screen6Props = {
  onDone: () => void;
};

export function Screen6(props: Screen6Props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require('../images/screen6.png')}
      />
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Your Title Goes Here</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          porta ipsumLorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vestibulum
        </Text>
        <Button
          backgroundColor="#00ACA1"
          color="#fff"
          label="Get Started"
          onPress={props.onDone}
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
    bottom: 100,
    right: 20,
    left: 20,
    padding: 20,
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  inActiveDot: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6871BC',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#756F6F',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
});
