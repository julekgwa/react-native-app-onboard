import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Onboarding } from 'react-native-app-onboard';

type ScreenProps = {
  onDone: () => void;
};

// A gradient background built with react-native-svg, demonstrating the `background` prop`
// passed to a page via the `background` prop. The library cross-fades it as the
// user swipes.
function Gradient({ from, to }: { from: string; to: string }) {
  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={from} />
          <Stop offset="1" stopColor={to} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#grad)" />
    </Svg>
  );
}

export function Features(props: ScreenProps) {
  // Demonstrates per-page `canSwipeForward` gating: page 2 cannot be left until
  // the user accepts. Rebuilding the pages array on state change updates the
  // gate (until accepted, swiping is disabled and the Next button is disabled).
  const [accepted, setAccepted] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Onboarding
        showSkip
        showNext
        showDone
        showPrevious
        // Skip jumps to the final slide instead of exiting the flow.
        skipToPage={2}
        onDone={props.onDone}
        previousLabel="Back"
        pages={[
          {
            backgroundColor: '#7B3FF2',
            // Custom gradient background element.
            background: <Gradient from="#7B3FF2" to="#00ACA1" />,
            image: <Text style={styles.emoji}>🚀</Text>,
            title: 'Welcome aboard',
            subtitle: 'A gradient background, cross-faded as you swipe.',
            // Per-page label override.
            nextLabel: "Let's go",
          },
          {
            backgroundColor: '#140E17',
            image: (
              <TouchableOpacity
                style={styles.accept}
                onPress={() => setAccepted((a) => !a)}
              >
                <Text style={styles.acceptText}>
                  {accepted ? '☑  Terms accepted' : '☐  Tap to accept terms'}
                </Text>
              </TouchableOpacity>
            ),
            title: 'Before we start',
            subtitle: 'You must accept the terms to continue.',
            // Gate: cannot advance until accepted (Next disabled + swipe snaps back).
            canSwipeForward: accepted,
            nextLabel: 'Continue',
          },
          {
            backgroundColor: '#0E1E22',
            image: <Text style={styles.emoji}>🎉</Text>,
            title: "You're all set",
            subtitle: 'Press Done to finish onboarding.',
            doneLabel: 'Get Started',
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 96,
  },
  accept: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  acceptText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
