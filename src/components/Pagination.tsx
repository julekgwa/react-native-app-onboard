import {
  View,
  Pressable,
  Animated,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import React from 'react';
import { setAlpha } from '../utils/color';
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
  showPrevious?: boolean;
  nextLabel?: string | React.ReactNode;
  skipLabel?: string | React.ReactNode;
  doneLabel?: string | React.ReactNode;
  previousLabel?: string | React.ReactNode;
  paginationContainerStyle?: StyleProp<ViewStyle>;
  buttonRightContainerStyle?: StyleProp<ViewStyle>;
  buttonLeftContainerStyle?: StyleProp<ViewStyle>;
  dotsContainerStyle?: StyleProp<ViewStyle>;
  doneLabelStyle?: StyleProp<TextStyle>;
  hasSkipPosition?: boolean;
  skipLabelStyle?: StyleProp<TextStyle>;
  previousLabelStyle?: StyleProp<TextStyle>;
  skipButtonContainerStyle?: StyleProp<ViewStyle>;
  nextButtonContainerStyle?: StyleProp<ViewStyle>;
  doneButtonContainerStyle?: StyleProp<ViewStyle>;
  previousButtonContainerStyle?: StyleProp<ViewStyle>;
  nextLabelStyle?: StyleProp<TextStyle>;
  paginationPosition?: 'top' | 'bottom';
  paginationStyle?: 'dots' | 'progress';
  progressBarStyle?: StyleProp<ViewStyle>;
  progressBarFillStyle?: StyleProp<ViewStyle>;
  dotsAreTappable?: boolean;
  mirror?: boolean;
  onDone?: () => void;
  onSkip?: () => void;
  onNext?: () => void;
};

export function Pagination(props: FooterProps) {
  const { isDone, currentPage, progress, scrollTo, previousPage } =
    useOnboarding();
  const dots = Array.from({ length: props.numberOfScreens }, (_, i) => i);
  const width = props.width;
  const showPrevious = props.showPrevious && currentPage > 0;

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
        {showPrevious && (
          <Button
            onPress={() => previousPage()}
            buttonTextStyle={props.previousLabelStyle}
            buttonStyle={props.previousButtonContainerStyle}
            label={props.previousLabel || 'Back'}
          />
        )}
        {!showPrevious && props.showSkip && !props.hasSkipPosition && (
          <Button
            onPress={props.onSkip}
            buttonTextStyle={props.skipLabelStyle}
            buttonStyle={props.skipButtonContainerStyle}
            label={props.skipLabel || 'Skip'}
          />
        )}
      </View>

      {props.paginationStyle === 'progress' ? (
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          style={[
            styles.progressTrack,
            // Derive a faint track from the (background-aware) fill color so it
            // stays visible on both light and dark pages.
            { backgroundColor: setAlpha(props.color, 0.25) },
            // Mirror the fill direction so it grows from the trailing edge.
            props.mirror && styles.mirror,
            props.progressBarStyle,
          ]}
        >
          <View
            style={[
              styles.progressFill,
              { backgroundColor: props.color, width: `${progress}%` },
              props.progressBarFillStyle,
            ]}
          />
        </View>
      ) : (
        <View
          style={[
            styles.dotsContainer,
            props.mirror && styles.mirror,
            props.dotsContainerStyle,
          ]}
        >
          {dots.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotOpacity = props.animatedValue.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const dotProps = {
              accessibilityRole: props.dotsAreTappable
                ? ('button' as const)
                : ('image' as const),
              accessibilityLabel: `Page ${i + 1} of ${props.numberOfScreens}`,
              accessibilityState: { selected: i === currentPage },
            };
            const dot = (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: props.color,
                    opacity: dotOpacity,
                  },
                ]}
              />
            );
            return props.dotsAreTappable ? (
              <Pressable
                key={i}
                onPress={() => scrollTo(i)}
                hitSlop={8}
                {...dotProps}
              >
                {dot}
              </Pressable>
            ) : (
              <View key={i} {...dotProps}>
                {dot}
              </View>
            );
          })}
        </View>
      )}

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
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 2,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  text: {
    fontSize: 16,
  },
  buttons: {
    flex: 1,
  },
  rightButton: {
    alignItems: 'flex-end',
  },
  leftButton: {
    alignItems: 'flex-start',
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
});
