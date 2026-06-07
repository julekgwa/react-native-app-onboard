import React, { useMemo } from 'react';
import tinycolor from 'tinycolor2';
import {
  Animated,
  StyleSheet,
  Dimensions,
  FlatList,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { Pagination } from './Pagination';
import { OnboardingPage, type Page } from './Page';
import type { OnboardingProps } from '../types';
import { SkipButton } from './button';

const { width } = Dimensions.get('window');

type Props = OnboardingProps & {
  pages: Page[];
  currentPage: number;
  setPage: (newPageIndex: number) => void;
  setFlatListRef: (node: FlatList | null) => void;
  scrollX: Animated.Value;
  dotsAnimatedValue: Animated.Value;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollBeginDrag: () => void;
  nextPage: () => void;
  mirror?: boolean;
};

export const OnboardingPages = ({
  showPagination = true,
  showNext = true,
  ...props
}: Props) => {
  const pageWidth = props.width || width;
  const currentPage_ = props.pages[props.currentPage];
  const currentBackgroundColor = currentPage_?.backgroundColor ?? 'white';
  const isLight = tinycolor(currentBackgroundColor).getBrightness() > 180;
  const footerBackgroundColor = isLight
    ? tinycolor(currentBackgroundColor).darken(30).toString()
    : tinycolor(currentBackgroundColor).lighten(30).toString();
  const color =
    tinycolor(footerBackgroundColor).getBrightness() > 180
      ? tinycolor(footerBackgroundColor).darken(60).toString()
      : tinycolor(footerBackgroundColor).lighten(60).toString();

  const interpolatedBackgroundColor = useMemo(() => {
    const pages = props.pages;
    // interpolate() requires at least 2 stops; for 0 or 1 pages there is
    // nothing to animate between, so use the solid current color.
    if (pages.length < 2) return currentBackgroundColor;
    const inputRange = pages.map((_, i) => i * pageWidth);
    const outputRange = pages.map((p) => p.backgroundColor ?? 'white');
    return props.scrollX.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });
  }, [props.pages, props.scrollX, pageWidth, currentBackgroundColor]);

  const paginationProps = {
    width: pageWidth,
    onNext: props.nextPage,
    onSkip: props.onSkip,
    color,
    showNext,
    onDone: props.onDone,
    showDone: props.showDone,
    showPrevious: props.showPrevious,
    backgroundColor: footerBackgroundColor,
    animatedValue: props.dotsAnimatedValue,
    showSkip: props.showSkip,
    numberOfScreens: props.pages.length,
    skipLabel: props.skipLabel,
    nextLabel: props.nextLabel,
    previousLabel: props.previousLabel,
    hasSkipPosition: !!props.skipButtonPosition,
    doneLabel: props.doneLabel,
    paginationStyle: props.paginationStyle,
    progressBarStyle: props.progressBarStyle,
    progressBarFillStyle: props.progressBarFillStyle,
    dotsAreTappable: props.dotsAreTappable,
    mirror: props.mirror,
    paginationContainerStyle: props.paginationContainerStyle,
    buttonRightContainerStyle: props.buttonRightContainerStyle,
    buttonLeftContainerStyle: props.buttonLeftContainerStyle,
    dotsContainerStyle: props.dotsContainerStyle,
    doneLabelStyle: props.doneLabelStyle,
    skipLabelStyle: props.skipLabelStyle,
    previousLabelStyle: props.previousLabelStyle,
    nextLabelStyle: props.nextLabelStyle,
    skipButtonContainerStyle: props.skipButtonContainerStyle,
    nextButtonContainerStyle: props.nextButtonContainerStyle,
    doneButtonContainerStyle: props.doneButtonContainerStyle,
    previousButtonContainerStyle: props.previousButtonContainerStyle,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: interpolatedBackgroundColor },
      ]}
    >
      {props.skipButtonPosition && props.showSkip && (
        <SkipButton
          buttonTextStyle={props.skipLabelStyle}
          buttonStyle={props.skipButtonContainerStyle}
          position={props.skipButtonPosition}
          label={props.skipLabel}
          onPress={props.onSkip}
        />
      )}
      {props.paginationPosition === 'top' && (
        <>
          {showPagination &&
            props.customFooter &&
            props.customFooter({ nextPage: props.nextPage })}
          {!props.customFooter && showPagination && (
            <Pagination {...paginationProps} />
          )}
        </>
      )}
      <Animated.FlatList
        ref={(node) => props.setFlatListRef(node as FlatList | null)}
        data={props.pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={props.mirror ? styles.mirror : undefined}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <OnboardingPage
            color={color}
            width={pageWidth}
            swap={props.swap}
            mirror={props.mirror}
            key={index}
            {...item}
          />
        )}
        onScroll={props.onScroll}
        onScrollBeginDrag={props.onScrollBeginDrag}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const pageIndex = Math.round(
            event.nativeEvent.contentOffset.x / pageWidth
          );
          props.setPage(pageIndex || 0);
        }}
      />
      {props.paginationPosition !== 'top' && (
        <>
          {showPagination &&
            props.customFooter &&
            props.customFooter({ nextPage: props.nextPage })}
          {!props.customFooter && showPagination && (
            <Pagination {...paginationProps} />
          )}
        </>
      )}
    </Animated.View>
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
  mirror: {
    transform: [{ scaleX: -1 }],
  },
});
