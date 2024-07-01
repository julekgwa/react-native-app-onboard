import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { Page } from '../components/Page';

export type OnboardingProps = {
  children?: React.ReactNode[];
  nextLabel?: string | React.ReactNode;
  skipLabel?: string | React.ReactNode;
  doneLabel?: string | React.ReactNode;
  showSkip?: boolean;
  showNext?: boolean;
  showDone?: boolean;
  onDone?: () => void;
  onSkip?: () => void;
  showPagination?: boolean;
  scrollEnabled?: boolean;
  customFooter?: (props: { nextPage: () => void }) => React.ReactNode;
  paginationContainerStyle?: StyleProp<ViewStyle>;
  buttonRightContainerStyle?: StyleProp<ViewStyle>;
  buttonLeftContainerStyle?: StyleProp<ViewStyle>;
  dotsContainerStyle?: StyleProp<ViewStyle>;
  doneLabelStyle?: StyleProp<TextStyle>;
  skipLabelStyle?: StyleProp<TextStyle>;
  skipButtonContainerStyle?: StyleProp<ViewStyle>;
  nextButtonContainerStyle?: StyleProp<ViewStyle>;
  doneButtonContainerStyle?: StyleProp<ViewStyle>;
  skipButtonPosition?: 'top-left' | 'top-right';
  nextLabelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  paginationPosition?: 'top' | 'bottom';
  scrollAnimationDuration?: number;
  useNativeDriver?: boolean;
  width?: number;
  color?: string;
  pages?: Page[];
  swap?: boolean;
} & (
  | {
      children?: React.ReactNode[];
    }
  | { pages: Page[] }
);
