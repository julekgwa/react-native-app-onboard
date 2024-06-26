import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

type ButtonProps = {
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  label?: string;
};

export function Button(props: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.button,
        { backgroundColor: props.backgroundColor || '#0E1E22' },
      ]}
    >
      <Text style={[styles.buttonText, { color: props.color || '#fff' }]}>
        {props.label || 'Next'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0E1E22',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 23,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
