import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import React from 'react';

export type EntranceConfig = {
  stagger?: number;
  duration?: number;
  distance?: number;
};

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

type OnboardingPageProps = Page & {
  /** Internal: this page is the active (current) one. */
  active?: boolean;
  /** Internal: run the staggered entrance animation. */
  animate?: boolean;
  /** Internal: entrance animation tuning. */
  entrance?: EntranceConfig;
};

export function OnboardingPage(props: OnboardingPageProps) {
  const { active, animate } = props;
  const stagger = props.entrance?.stagger ?? 120;
  const duration = props.entrance?.duration ?? 400;
  const distance = props.entrance?.distance ?? 24;

  // One driver per element so they cascade. Created once; only consumed when
  // `animate` is on, so the default (no-animation) path renders fully visible.
  const imageA = React.useMemo(() => new Animated.Value(0), []);
  const titleA = React.useMemo(() => new Animated.Value(0), []);
  const subtitleA = React.useMemo(() => new Animated.Value(0), []);
  const hasAnimated = React.useRef(false);

  React.useEffect(() => {
    if (!animate || !active || hasAnimated.current) return;
    // Animate in once, the first time the page becomes active, then stay put.
    hasAnimated.current = true;
    Animated.stagger(stagger, [
      Animated.timing(imageA, { toValue: 1, duration, useNativeDriver: true }),
      Animated.timing(titleA, { toValue: 1, duration, useNativeDriver: true }),
      Animated.timing(subtitleA, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [active, animate, stagger, duration, imageA, titleA, subtitleA]);

  const entranceStyle = (value: Animated.Value) =>
    animate
      ? {
          opacity: value,
          transform: [
            {
              translateY: value.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        }
      : undefined;

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
      <Animated.View
        style={[
          styles.imageContainer,
          props.imageContainerStyle,
          entranceStyle(imageA),
        ]}
      >
        {props.image}
      </Animated.View>
      <View style={[styles.titleContainer, props.titleContainerStyle]}>
        <Animated.Text
          style={[
            styles.title,
            { color: props.color },
            props.titleStyle,
            entranceStyle(titleA),
          ]}
        >
          {props.title}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            { color: props.color },
            props.subtitleStyle,
            entranceStyle(subtitleA),
          ]}
        >
          {props.subtitle}
        </Animated.Text>
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
    // No `flex` here: on react-native-web `flex: 0` compiles to CSS
    // `flex: 0 0 0%`, collapsing the container to zero height so the image
    // overflows across the title. Omitting it leaves the box content-sized
    // (flexShrink defaults to 0 in React Native) on both web and native.
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
