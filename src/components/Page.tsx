import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import React from 'react';

export type Page = {
  title: string;
  subtitle: string;
  image: React.ReactNode;
  backgroundColor: string;
  /**
   * Optional custom background element (e.g. a `LinearGradient`) rendered behind
   * the page content and cross-faded as the user swipes. Falls back to
   * `backgroundColor` when omitted.
   */
  background?: React.ReactNode;
  /**
   * Overrides automatic light/dark detection for this page's footer/button
   * contrast. When omitted, brightness of `backgroundColor` is used.
   */
  isLight?: boolean;
  color?: string;
  width?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  swap?: boolean;
  /** Per-page override for the "Next" button label. */
  nextLabel?: string | React.ReactNode;
  /** Per-page override for the "Skip" button label. */
  skipLabel?: string | React.ReactNode;
  /** Per-page override for the "Done" button label. */
  doneLabel?: string | React.ReactNode;
  /** When `false`, blocks advancing past this page (swipe snaps back, Next disabled). */
  canSwipeForward?: boolean;
  /** When `false`, blocks returning from this page (swipe snaps back). */
  canSwipeBackward?: boolean;
  /** Internal: counter-flips page content when the slider is mirrored for RTL. */
  mirror?: boolean;
};

const { width, height } = Dimensions.get('window');
const portrait = height > width;

export function OnboardingPage(props: Page) {
  return (
    <View
      style={[
        styles.container,
        { width: props.width },
        props.containerStyle,
        props.swap && styles.swapStyle,
        props.mirror && styles.mirror,
      ]}
    >
      <View style={[styles.imageContainer, props.imageContainerStyle]}>
        {props.image}
      </View>
      <View style={[styles.titleContainer, props.titleContainerStyle]}>
        <Text
          style={[
            styles.title,
            {
              color: props.color,
            },
            props.titleStyle,
          ]}
        >
          {props.title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: props.color,
            },
            props.subtitleStyle,
          ]}
        >
          {props.subtitle}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 0,
    paddingBottom: portrait ? 60 : 10,
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    marginHorizontal: 30,
  },
  swapStyle: {
    flexDirection: 'column-reverse',
  },
  mirror: {
    transform: [{ scaleX: -1 }],
  },
});
