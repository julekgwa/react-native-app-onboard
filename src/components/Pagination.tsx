import {
  View,
  Animated,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { Button } from './button';

type FooterProps = {
  animatedValue: Animated.Value;
  numberOfScreens: number;
  backgroundColor: string;
  color: string;
  width: number;
  showDone?: boolean;
  showSkip?: boolean;
  showNext?: boolean;
  nextLabel?: string | React.ReactNode;
  skipLabel?: string | React.ReactNode;
  doneLabel?: string | React.ReactNode;
  paginationContainerStyle?: StyleProp<ViewStyle>;
  buttonRightContainerStyle?: StyleProp<ViewStyle>;
  buttonLeftContainerStyle?: StyleProp<ViewStyle>;
  dotsContainerStyle?: StyleProp<ViewStyle>;
  doneLabelStyle?: StyleProp<TextStyle>;
  hasSkipPosition?: boolean;
  skipLabelStyle?: StyleProp<TextStyle>;
  skipButtonContainerStyle?: StyleProp<ViewStyle>;
  nextButtonContainerStyle?: StyleProp<ViewStyle>;
  doneButtonContainerStyle?: StyleProp<ViewStyle>;
  nextLabelStyle?: StyleProp<TextStyle>;
  paginationPosition?: 'top' | 'bottom';
  onDone?: () => void;
  onSkip?: () => void;
  onNext?: () => void;
};

export function Pagination(props: FooterProps) {
  const { isDone } = useOnboarding();
  const dots = Array.from({ length: props.numberOfScreens }, (_, i) => i);
  const width = props.width;
  return (
    <View
      style={[
        styles.pagination,
        {
          backgroundColor: props.backgroundColor,
        },
        props.paginationContainerStyle,
      ]}
    >
      <View
        style={[
          styles.buttons,
          styles.leftButton,
          props.buttonLeftContainerStyle,
        ]}
      >
        {props.showSkip && !props.hasSkipPosition && (
          <Button
            onPress={props.onSkip}
            buttonTextStyle={props.skipLabelStyle}
            buttonStyle={props.skipButtonContainerStyle}
            label={props.skipLabel || 'Skip'}
          />
        )}
      </View>
      <View style={styles.dotsContainer}>
        {dots.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotOpacity = props.animatedValue.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: props.color,
                  opacity: dotOpacity,
                },
                props.dotsContainerStyle,
              ]}
            />
          );
        })}
      </View>
      <View
        style={[
          styles.buttons,
          styles.rightButton,
          props.buttonRightContainerStyle,
        ]}
      >
        {!isDone && props.showNext && (
          <Button
            onPress={props.onNext}
            label={props.nextLabel || 'Next'}
            buttonTextStyle={props.nextLabelStyle}
            buttonStyle={props.nextButtonContainerStyle}
          />
        )}
        {isDone && props.showDone && (
          <Button
            onPress={props.onDone}
            label={props.doneLabel || 'Done'}
            buttonTextStyle={props.doneLabelStyle}
            buttonStyle={props.doneButtonContainerStyle}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    marginHorizontal: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
  buttons: {
    minWidth: 200,
  },
  rightButton: {
    alignItems: 'flex-end',
    paddingRight: 30,
  },
  leftButton: {
    alignItems: 'flex-start',
    paddingLeft: 30,
  },
});
