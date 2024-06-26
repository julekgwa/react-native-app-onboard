import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useOnboarding } from 'react-native-app-onboard';
import { Dots } from './Dots';

const { width } = Dimensions.get('window');

export function Screen2() {
  const { enableScroll, currentPage } = useOnboarding();

  React.useEffect(() => {
    if (currentPage === 1) {
      enableScroll(true);
    }
    return () => {
      enableScroll(false);
    };
  }, [currentPage, enableScroll]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Long Title Goes Here</Text>
      <Text style={styles.subtitle}>
        Id eu aliquip ut enim est ad nostrud nostrud irure laboris proident do.
        Dolor esse in pariatur ipsum excepteur mollit ex sint magna ex mollit.
      </Text>
      <Dots />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 110,
    backgroundColor: '#6464FF',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 20,
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
    height: 200,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: 41,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
});
