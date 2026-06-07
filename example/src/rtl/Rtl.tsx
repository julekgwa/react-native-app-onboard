import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Onboarding } from 'react-native-app-onboard';

type ScreenProps = {
  onDone: () => void;
};

// Arabic onboarding content. The `rtl` prop forces a right-to-left layout
// regardless of the device direction, so the demo mirrors correctly even on an
// LTR simulator. On a device localized for Arabic/Hebrew/Farsi/Urdu you can
// omit `rtl` and it follows `I18nManager.isRTL` automatically.
export function Rtl(props: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Onboarding
        rtl
        showDone
        showSkip
        showNext
        showPrevious
        onSkip={props.onDone}
        onDone={props.onDone}
        paginationPosition="bottom"
        skipButtonPosition="top-left"
        nextLabel="التالي"
        skipLabel="تخطّي"
        doneLabel="تم"
        previousLabel="رجوع"
        pages={[
          {
            backgroundColor: '#140E17',
            image: <Image source={require('../basic/images/image1.png')} />,
            title: 'اعثر على رعاية الحيوانات الأليفة بالقرب منك',
            subtitle:
              'فعّل موقعك وستجد أقرب مركز لرعاية الحيوانات الأليفة الذي ترغب به.',
          },
          {
            backgroundColor: '#140E17',
            image: <Image source={require('../basic/images/image2.png')} />,
            title: 'دعنا نقدّم أفضل علاج',
            subtitle: 'احصل على أفضل علاج لحيوانك الأليف معنا.',
          },
          {
            backgroundColor: '#140E17',
            image: <Image source={require('../basic/images/image3.png')} />,
            title: 'احجز موعدًا معنا!',
            subtitle: 'ما رأيك؟ احجز مع أطبائنا البيطريين الآن.',
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
