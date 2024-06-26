import * as React from 'react';
import { Custom } from './custom/Custom';
import { View, StyleSheet } from 'react-native';
import { Button } from './custom/components/Button';
import { Basic } from './basic/Basic';

type Screen = 'Basic' | 'Custom';

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
    </View>
  );
}

export default function App() {
  const [example, setShowExample] = React.useState<Screen>();

  return example === 'Custom' ? (
    <Custom onDone={() => setShowExample(undefined)} />
  ) : example === 'Basic' ? (
    <Basic onDone={() => setShowExample(undefined)} />
  ) : (
    <MainApp setExample={setShowExample} />
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
