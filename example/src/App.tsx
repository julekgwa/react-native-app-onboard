import * as React from 'react';
import { Custom } from './custom/Custom';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button } from './custom/components/Button';
import { Basic } from './basic/Basic';
import { Rtl } from './rtl/Rtl';
import { Features } from './features/Features';
import { Gradient } from './gradient/Gradient';

type Screen = 'Basic' | 'Custom' | 'Rtl' | 'Features' | 'Gradient';

type MainAppProps = {
  setExample: React.Dispatch<React.SetStateAction<Screen | undefined>>;
};

function MainApp(props: MainAppProps) {
  return (
    <View style={styles.container}>
      <Button onPress={() => props.setExample('Basic')} label="Show Basic" />
      <Button
        onPress={() => props.setExample('Custom')}
        backgroundColor="#00ACA1"
        label="Show Custom"
      />
      <Button
        onPress={() => props.setExample('Rtl')}
        backgroundColor="#7B3FF2"
        label="Show RTL (Arabic)"
      />
      <Button
        onPress={() => props.setExample('Features')}
        backgroundColor="#00ACA1"
        label="Show Features Demo"
      />
      <Button
        onPress={() => props.setExample('Gradient')}
        backgroundColor="#C04CC0"
        label="Show Gradient Demo"
      />
    </View>
  );
}

export default function App() {
  const [example, setShowExample] = React.useState<Screen>();

  return (
    <SafeAreaProvider>
      {example === 'Custom' ? (
        <Custom onDone={() => setShowExample(undefined)} />
      ) : example === 'Basic' ? (
        <Basic onDone={() => setShowExample(undefined)} />
      ) : example === 'Rtl' ? (
        <Rtl onDone={() => setShowExample(undefined)} />
      ) : example === 'Features' ? (
        <Features onDone={() => setShowExample(undefined)} />
      ) : example === 'Gradient' ? (
        <Gradient onDone={() => setShowExample(undefined)} />
      ) : (
        <MainApp setExample={setShowExample} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    gap: 20,
  },
});
