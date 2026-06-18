import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { Page } from '../components/Page';

export type OnboardingProps = {
  children?: React.ReactNode[];
  nextLabel?: string | React.ReactNode;
  skipLabel?: string | React.ReactNode;
  doneLabel?: string | React.ReactNode;
  previousLabel?: string | React.ReactNode;
  showSkip?: boolean;
  showNext?: boolean;
  showDone?: boolean;
  showPrevious?: boolean;
  onDone?: () => void;
  onSkip?: () => void;
  onPageChange?: (index: number) => void;
  /**
   * When set, pressing "Skip" navigates to this page index instead of firing
   * `onSkip` (e.g. skip intro slides but land on a sign-up slide in the flow).
   */
  skipToPage?: number;
  showPagination?: boolean;
  scrollEnabled?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  customFooter?: (props: { nextPage: () => void }) => React.ReactNode;
  paginationContainerStyle?: StyleProp<ViewStyle>;
  buttonRightContainerStyle?: StyleProp<ViewStyle>;
  buttonLeftContainerStyle?: StyleProp<ViewStyle>;
  dotsContainerStyle?: StyleProp<ViewStyle>;
  doneLabelStyle?: StyleProp<TextStyle>;
  skipLabelStyle?: StyleProp<TextStyle>;
  previousLabelStyle?: StyleProp<TextStyle>;
  skipButtonContainerStyle?: StyleProp<ViewStyle>;
  nextButtonContainerStyle?: StyleProp<ViewStyle>;
  doneButtonContainerStyle?: StyleProp<ViewStyle>;
  previousButtonContainerStyle?: StyleProp<ViewStyle>;
  skipButtonPosition?: 'top-left' | 'top-right';
  nextLabelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  paginationPosition?: 'top' | 'bottom';
  /**
   * Controlled page index. When this prop changes, the slider navigates to that
   * page. Pair with `onPageChange` to keep the parent in sync.
   */
  currentPage?: number;
  paginationStyle?: 'dots' | 'progress';
  progressBarStyle?: StyleProp<ViewStyle>;
  progressBarFillStyle?: StyleProp<ViewStyle>;
  tappableDots?: boolean;
  scrollAnimationDuration?: number;
  useNativeDriver?: boolean;
  /**
   * When `true`, the image, title, and subtitle of the active page animate in
   * with a staggered fade + slide-up. Applies to the declarative `pages` API.
   */
  animatePages?: boolean;
  /** Tuning for `animatePages` (ms between elements, ms per element, slide-up px). */
  entranceConfig?: { stagger?: number; duration?: number; distance?: number };
  rtl?: boolean;
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
