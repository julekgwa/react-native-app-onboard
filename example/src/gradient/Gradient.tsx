import React from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Onboarding } from 'react-native-app-onboard';

type ScreenProps = {
  onDone: () => void;
};

// Full-screen diagonal gradient built with react-native-svg. Passed to each
// page via the `background` prop; the library cross-fades between them as the
// user swipes, so the whole screen shifts color smoothly.
function GradientFill({ id, colors }: { id: string; colors: string[] }) {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          {colors.map((c, i) => (
            <Stop key={i} offset={`${i / (colors.length - 1)}`} stopColor={c} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

export function Gradient(props: ScreenProps) {
  // Full-bleed gradient: the background reaches the screen edges, but we feed
  // safe-area insets into the Skip button and footer through the library's
  // style props so the controls clear the status bar and home indicator.
  const insets = useSafeAreaInsets();

  return (
    <Onboarding
      showSkip
      showNext
      showDone
      showPrevious
      onSkip={props.onDone}
      onDone={props.onDone}
      previousLabel="Back"
      skipButtonPosition="top-right"
      skipButtonContainerStyle={{ top: insets.top + 12 }}
      paginationContainerStyle={{
        height: 72 + insets.bottom,
        paddingBottom: insets.bottom,
      }}
      dotsContainerStyle={styles.dots}
      nextButtonContainerStyle={styles.pill}
      doneButtonContainerStyle={styles.pill}
      nextLabelStyle={styles.pillText}
      doneLabelStyle={styles.pillText}
      previousButtonContainerStyle={styles.ghostPill}
      previousLabelStyle={styles.ghostText}
      skipLabelStyle={styles.skipText}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
      pages={[
        {
          backgroundColor: '#F7A98C',
          background: (
            <GradientFill id="g0" colors={['#F8C9A0', '#F178A8', '#C04CC0']} />
          ),
          // A page can force the light/dark contrast when needed.
          isLight: false,
          image: <Text style={styles.logo}>Filo</Text>,
          title: 'Your pregnancy companion',
          subtitle: 'Your cycle, understood — with predictions that learn you.',
        },
        {
          backgroundColor: '#F178A8',
          background: (
            <GradientFill id="g1" colors={['#FBB7A6', '#EF6FA0', '#A84FD0']} />
          ),
          image: (
            <Image
              source={require('./images/image1.webp')}
              style={styles.character}
            />
          ),
          title: 'Welcome to Filo',
          subtitle:
            'Are you pregnant? Knowing helps us make better predictions.',
        },
        {
          backgroundColor: '#C04CC0',
          background: (
            <GradientFill id="g2" colors={['#F08AB0', '#C95CC8', '#9B4DD6']} />
          ),
          image: (
            <Image
              source={require('./images/image2.webp')}
              style={styles.character}
            />
          ),
          title: 'When were you born?',
          subtitle:
            'We tailor predictions to your age. You can change this later.',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 64,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 1,
  },
  character: {
    width: 260,
    height: 380,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
  },
  dots: {
    flex: 1,
  },
  pill: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  pillText: {
    color: '#C04CC0',
    fontWeight: '700',
  },
  ghostPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  ghostText: {
    color: '#fff',
    fontWeight: '700',
  },
  skipText: {
    color: '#fff',
    fontWeight: '600',
  },
});
