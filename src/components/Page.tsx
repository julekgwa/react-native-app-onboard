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
  color?: string;
  width?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  swap?: boolean;
};

const { width, height } = Dimensions.get('window');
const potrait = height > width;

export function OnboardingPage(props: Page) {
  return (
    <View
      style={[
        styles.container,
        { width: props.width },
        props.containerStyle,
        props.swap && styles.swapStyle,
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
    paddingBottom: potrait ? 60 : 10,
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    marginHorizontal: 30,
  },
  swapStyle: {
    flexDirection: 'column-reverse',
  },
});
