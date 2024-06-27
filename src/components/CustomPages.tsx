import { View, Dimensions, Animated, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { Pagination } from './Pagination';
import type { OnboardingProps } from '../types';
import { SkipButton } from './button';

const { width } = Dimensions.get('window');

type CustomPagesProps = OnboardingProps & {
  children?: React.ReactNode[];
  currentPage: number;
  setPage: (newPageIndex: number) => void;
  flatListRef: React.RefObject<FlatList>;
  scrollX: Animated.Value;
  nextPage: () => void;
  numberOfScreens: number;
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
  return (
    <View style={[styles.container]}>
      {props.skipButtonPosition && props.showSkip && (
        <SkipButton
          buttonTextStyle={props.skipLabelStyle}
          buttonStyle={props.skipButtonContainerStyle}
          position={props.skipButtonPosition}
          onPress={props.onSkip}
        />
      )}
      {showPagination && props.paginationPosition === 'top' && (
        <>
          {showPagination &&
            props.customFooter &&
            props.customFooter({ nextPage: props.nextPage })}
          {!props.customFooter && (
            <Pagination
              color={'#fff'}
              backgroundColor={'#333'}
              width={width}
              onNext={props.nextPage}
              onSkip={props.onSkip}
              onDone={props.onDone}
              showDone={props.showDone}
              animatedValue={props.scrollX}
              showSkip={props.showSkip}
              numberOfScreens={props.numberOfScreens}
              skipLabel={props.skipLabel}
              showNext={showNext}
              nextLabel={props.nextLabel}
              doneLabel={props.doneLabel}
              hasSkipPosition={!!props.skipButtonPosition}
              paginationContainerStyle={props.paginationContainerStyle}
              buttonRightContainerStyle={props.buttonRightContainerStyle}
              buttonLeftContainerStyle={props.buttonLeftContainerStyle}
              dotsContainerStyle={props.dotsContainerStyle}
              doneLabelStyle={props.doneLabelStyle}
              skipButtonContainerStyle={props.skipButtonContainerStyle}
              nextButtonContainerStyle={props.nextButtonContainerStyle}
              doneButtonContainerStyle={props.doneButtonContainerStyle}
              skipLabelStyle={props.skipLabelStyle}
              nextLabelStyle={props.nextLabelStyle}
            />
          )}
        </>
      )}
      <Animated.FlatList
        ref={props.flatListRef}
        data={React.Children.toArray(props.children)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={props.scrollEnabled}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: props.scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={1}
        onMomentumScrollEnd={(event) => {
          const pageIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
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
          {showPagination &&
            props.customFooter &&
            props.customFooter({ nextPage: props.nextPage })}
          {!props.customFooter && (
            <Pagination
              color={'#fff'}
              backgroundColor={'#333'}
              width={width}
              onNext={props.nextPage}
              onSkip={props.onSkip}
              onDone={props.onDone}
              showDone={props.showDone}
              animatedValue={props.scrollX}
              showSkip={props.showSkip}
              numberOfScreens={props.numberOfScreens}
              skipLabel={props.skipLabel}
              nextLabel={props.nextLabel}
              showNext={showNext}
              doneLabel={props.doneLabel}
              paginationContainerStyle={props.paginationContainerStyle}
              buttonRightContainerStyle={props.buttonRightContainerStyle}
              buttonLeftContainerStyle={props.buttonLeftContainerStyle}
              dotsContainerStyle={props.dotsContainerStyle}
              doneLabelStyle={props.doneLabelStyle}
              skipButtonContainerStyle={props.skipButtonContainerStyle}
              nextButtonContainerStyle={props.nextButtonContainerStyle}
              doneButtonContainerStyle={props.doneButtonContainerStyle}
              skipLabelStyle={props.skipLabelStyle}
              hasSkipPosition={!!props.skipButtonPosition}
              nextLabelStyle={props.nextLabelStyle}
            />
          )}
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
