import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import React from 'react';
import { useOnboarding } from 'react-native-app-onboard';

type DotsProps = {
  activeDotStyle?: StyleProp<ViewStyle>;
  inActiveDotStyle?: StyleProp<ViewStyle>;
  showCircle?: boolean;
  activeDotColor?: string;
  innerCircleColor?: string;
  activeBackgroundColor?: string;
};

export function Dots(props: DotsProps) {
  const { currentPage, numberOfScreens } = useOnboarding();
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: numberOfScreens }, (_, i) => i).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === currentPage
              ? [
                  props.activeDotStyle || {
                    ...styles.activeDot,
                    backgroundColor: props.activeDotColor || '#fff',
                  },
                  props.showCircle
                    ? {
                        ...styles.activeDotBorder,
                        borderColor: props.activeDotColor || '#000',
                        backgroundColor: props.activeBackgroundColor || '#000',
                      }
                    : null,
                ]
              : props.inActiveDotStyle || styles.inActiveDot,
          ]}
        >
          {i === currentPage && props.showCircle && (
            <View
              style={[
                styles.innerCircle,
                {
                  backgroundColor: props.innerCircleColor || '#000',
                },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    margin: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  activeDot: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
  },
  inActiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDotBorder: {
    borderWidth: 2,
    borderColor: '#000', // Adjust color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    height: 6, // Adjust size as needed
    width: 6, // Adjust size as needed
    borderRadius: 3, // Half of height/width to make it a circle
    backgroundColor: '#000',
  },
});
