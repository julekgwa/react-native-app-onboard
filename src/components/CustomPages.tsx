import {
  View,
  Dimensions,
  Animated,
  StyleSheet,
  FlatList,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import React from 'react';
import { Pagination } from './Pagination';
import type { OnboardingProps } from '../types';
import { SkipButton } from './button';

const { width } = Dimensions.get('window');

type CustomPagesProps = OnboardingProps & {
  children?: React.ReactNode[];
  currentPage: number;
  setPage: (newPageIndex: number) => void;
  setFlatListRef: (node: FlatList | null) => void;
  scrollX: Animated.Value;
  dotsAnimatedValue: Animated.Value;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollBeginDrag: () => void;
  nextPage: () => void;
  scrollTo: (index: number, animated?: boolean) => void;
  numberOfScreens: number;
  // Accepted for prop-spread compatibility. Forced-`rtl` mirroring applies to
  // the declarative `pages` API; custom children follow the device direction.
  mirror?: boolean;
};

export type SliderProps = {
  index?: number;
  currentPage: number;
  numberOfScreens: number;
  nextPage: () => void;
};

export const CustomPages = ({
  showPagination = true,
  showNext = true,
  ...props
}: CustomPagesProps) => {
  const pageWidth = props.width || width;

  const paginationProps = {
    color: '#fff',
    backgroundColor: '#333',
    width: pageWidth,
    onNext: props.nextPage,
    onSkip: props.onSkip,
    onDone: props.onDone,
    showDone: props.showDone,
    showPrevious: props.showPrevious,
    animatedValue: props.dotsAnimatedValue,
    showSkip: props.showSkip,
    numberOfScreens: props.numberOfScreens,
    skipLabel: props.skipLabel,
    showNext,
    nextLabel: props.nextLabel,
    previousLabel: props.previousLabel,
    doneLabel: props.doneLabel,
    hasSkipPosition: !!props.skipButtonPosition,
    paginationStyle: props.paginationStyle,
    progressBarStyle: props.progressBarStyle,
    progressBarFillStyle: props.progressBarFillStyle,
    tappableDots: props.tappableDots,
    paginationContainerStyle: props.paginationContainerStyle,
    buttonRightContainerStyle: props.buttonRightContainerStyle,
    buttonLeftContainerStyle: props.buttonLeftContainerStyle,
    dotsContainerStyle: props.dotsContainerStyle,
    doneLabelStyle: props.doneLabelStyle,
    skipButtonContainerStyle: props.skipButtonContainerStyle,
    nextButtonContainerStyle: props.nextButtonContainerStyle,
    doneButtonContainerStyle: props.doneButtonContainerStyle,
    previousButtonContainerStyle: props.previousButtonContainerStyle,
    skipLabelStyle: props.skipLabelStyle,
    previousLabelStyle: props.previousLabelStyle,
    nextLabelStyle: props.nextLabelStyle,
    paginationPosition: props.paginationPosition,
  };

  return (
    <View style={[styles.container]}>
      {props.skipButtonPosition && props.showSkip && (
        <SkipButton
          buttonTextStyle={props.skipLabelStyle}
          buttonStyle={props.skipButtonContainerStyle}
          position={props.skipButtonPosition}
          onPress={props.onSkip}
          label={props.skipLabel}
        />
      )}
      {showPagination && props.paginationPosition === 'top' && (
        <>
          {props.customFooter &&
            props.customFooter({ nextPage: props.nextPage })}
          {!props.customFooter && <Pagination {...paginationProps} />}
        </>
      )}
      <Animated.FlatList
        ref={(node) => props.setFlatListRef(node as FlatList | null)}
        data={React.Children.toArray(props.children)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={props.scrollEnabled}
        onScroll={props.onScroll}
        onScrollBeginDrag={props.onScrollBeginDrag}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const pageIndex = Math.round(
            event.nativeEvent.contentOffset.x / pageWidth
          );
          props.setPage(pageIndex || 0);
        }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          return React.cloneElement(
            item as React.ReactElement<SliderProps>,
            {
              currentPage: props.currentPage,
              numberOfScreens: props.numberOfScreens,
              nextPage: props.nextPage,
              index,
            } as SliderProps
          );
        }}
      />

      {showPagination && props.paginationPosition !== 'top' && (
        <>
          {props.customFooter &&
            props.customFooter({ nextPage: props.nextPage })}
          {!props.customFooter && <Pagination {...paginationProps} />}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    margin: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
});
