import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import React from 'react';

type ButtonProps = {
  onPress?: () => void;
  label?: string | React.ReactNode;
  color?: string;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
};

export const Button = (props: ButtonProps) => {
  return typeof props.label === 'string' ? (
    <TouchableOpacity onPress={props.onPress} style={props.buttonStyle}>
      <Text
        style={[
          styles.text,
          {
            color: props.color || 'white',
          },
          props.buttonTextStyle,
        ]}
      >
        {props.label}
      </Text>
    </TouchableOpacity>
  ) : (
    props.label
  );
};

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
