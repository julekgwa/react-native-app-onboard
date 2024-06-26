import React, { useRef } from 'react';
import tinycolor from 'tinycolor2';
import { Animated, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Pagination } from './Pagination';
import { OnboardingPage, type Page } from './Page';
import type { OnboardingProps } from '../types';

const { width } = Dimensions.get('window');

type Props = OnboardingProps & {
  pages: Page[];
  currentPage: number;
  setPage: (newPageIndex: number) => void;
  flatListRef: React.RefObject<FlatList>;
  scrollX: Animated.Value;
  nextPage: () => void;
};

export const OnboardingPages = ({ showPagination = true, ...props }: Props) => {
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const [previousPage, setPreviousPage] = React.useState(0);
  const currentPage_ = props.pages[props.currentPage];
  const currentBackgroundColor = currentPage_?.backgroundColor || '';
  const isLight = tinycolor(currentBackgroundColor).getBrightness() > 180;
  const footerBackgroundColor = isLight
    ? tinycolor(currentBackgroundColor).darken(30).toString()
    : tinycolor(currentBackgroundColor).lighten(30).toString();
  const color =
    tinycolor(footerBackgroundColor).getBrightness() > 180
      ? tinycolor(footerBackgroundColor).darken(60).toString()
      : tinycolor(footerBackgroundColor).lighten(60).toString();

  const previousBackgroundColor =
    props.pages[previousPage]?.backgroundColor || 'white';
  // Interpolating background color based on backgroundColorAnim value
  const interpolatedBackgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentBackgroundColor, previousBackgroundColor],
    extrapolate: 'clamp',
  });

  const setPage_ = (newPageIndex: number) => {
    setPreviousPage(props.currentPage);
    props.setPage(newPageIndex);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: interpolatedBackgroundColor,
        },
      ]}
    >
      {props.paginationPosition === 'top' && (
        <>
          {showPagination &&
            props.customFooter &&
            props.customFooter({ nextPage: props.nextPage })}
          {!props.customFooter && (
            <Pagination
              width={width}
              onNext={props.nextPage}
              onSkip={props.onSkip}
              color={color}
              onDone={props.onDone}
              showDone={props.showDone}
              backgroundColor={footerBackgroundColor}
              animatedValue={props.scrollX}
              showSkip={props.showSkip}
              numberOfScreens={props.pages.length}
              skipLabel={props.skipLabel}
              nextLabel={props.nextLabel}
              doneLabel={props.doneLabel}
              paginationContainerStyle={props.paginationContainerStyle}
              buttonRightContainerStyle={props.buttonRightContainerStyle}
              buttonLeftContainerStyle={props.buttonLeftContainerStyle}
              dotsContainerStyle={props.dotsContainerStyle}
              doneLabelStyle={props.doneLabelStyle}
              skipLabelStyle={props.skipLabelStyle}
              nextLabelStyle={props.nextLabelStyle}
            />
          )}
        </>
      )}
      <Animated.FlatList
        ref={props.flatListRef}
        data={props.pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <OnboardingPage color={color} width={width} key={index} {...item} />
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: props.scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16} // Adjusted for better performance
        onMomentumScrollEnd={(event) => {
          const pageIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setPage_(pageIndex || 0);
        }}
      />
      {props.paginationPosition !== 'top' && (
        <>
          {showPagination &&
            props.customFooter &&
            props.customFooter({ nextPage: props.nextPage })}
          <Pagination
            width={width}
            onNext={props.nextPage}
            onSkip={props.onSkip}
            color={color}
            onDone={props.onDone}
            showDone={props.showDone}
            backgroundColor={footerBackgroundColor}
            animatedValue={props.scrollX}
            showSkip={props.showSkip}
            numberOfScreens={props.pages.length}
            skipLabel={props.skipLabel}
            nextLabel={props.nextLabel}
            doneLabel={props.doneLabel}
            paginationContainerStyle={props.paginationContainerStyle}
            buttonRightContainerStyle={props.buttonRightContainerStyle}
            buttonLeftContainerStyle={props.buttonLeftContainerStyle}
            dotsContainerStyle={props.dotsContainerStyle}
            doneLabelStyle={props.doneLabelStyle}
            skipLabelStyle={props.skipLabelStyle}
            nextLabelStyle={props.nextLabelStyle}
          />
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
});
