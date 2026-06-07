import React, { useMemo } from 'react';
import { getBrightness, lighten, darken } from '../utils/color';
import {
  Animated,
  View,
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
  scrollTo: (index: number, animated?: boolean) => void;
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
  const isLight = getBrightness(currentBackgroundColor) > 180;
  const footerBackgroundColor = isLight
    ? darken(currentBackgroundColor, 30)
    : lighten(currentBackgroundColor, 30);
  const color =
    getBrightness(footerBackgroundColor) > 180
      ? darken(footerBackgroundColor, 60)
      : lighten(footerBackgroundColor, 60);

  // Per-page label overrides fall back to the top-level labels.
  const nextLabel = currentPage_?.nextLabel ?? props.nextLabel;
  const skipLabel = currentPage_?.skipLabel ?? props.skipLabel;
  const doneLabel = currentPage_?.doneLabel ?? props.doneLabel;

  // Per-page navigation gating (default allowed).
  const canGoForward = currentPage_?.canSwipeForward !== false;
  const canGoBackward = currentPage_?.canSwipeBackward !== false;
  // Disable the gesture entirely when the current page gates either direction
  // (FlatList can't block a single direction), so there's no swipe-then-snap
  // bounce. The Next/Back buttons still navigate programmatically. Also honors
  // a consumer-level `scrollEnabled={false}`.
  const swipeEnabled =
    props.scrollEnabled !== false && canGoForward && canGoBackward;
  const hasCustomBackground = props.pages.some((p) => p.background != null);

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
    skipLabel,
    nextLabel,
    previousLabel: props.previousLabel,
    hasSkipPosition: !!props.skipButtonPosition,
    doneLabel,
    nextDisabled: !canGoForward,
    previousDisabled: !canGoBackward,
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
      {hasCustomBackground && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {props.pages.map((page, index) =>
            page.background == null ? null : (
              <Animated.View
                key={index}
                style={[
                  StyleSheet.absoluteFill,
                  {
                    opacity: props.scrollX.interpolate({
                      inputRange: [
                        (index - 1) * pageWidth,
                        index * pageWidth,
                        (index + 1) * pageWidth,
                      ],
                      outputRange: [0, 1, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              >
                {page.background}
              </Animated.View>
            )
          )}
        </View>
      )}
      {props.skipButtonPosition && props.showSkip && (
        <SkipButton
          buttonTextStyle={props.skipLabelStyle}
          buttonStyle={props.skipButtonContainerStyle}
          position={props.skipButtonPosition}
          label={skipLabel}
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
        scrollEnabled={swipeEnabled}
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
          const current = props.currentPage;
          // Honor per-page swipe gating by snapping back to the current page.
          if (
            (pageIndex > current && !canGoForward) ||
            (pageIndex < current && !canGoBackward)
          ) {
            props.scrollTo(current);
            return;
          }
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
