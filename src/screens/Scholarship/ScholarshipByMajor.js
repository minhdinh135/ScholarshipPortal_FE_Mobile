import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import { IconButton, LineDivider } from '../../components/Card'
import { HorizontalList } from '../../components/List';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import { SharedElement } from 'react-navigation-shared-element';
import { getScholarProgramByMajorId } from '../../api/scholarshipProgramApi';

const HEADER_HEIGHT = 250;

const ScholarshipByMajor = ({ navigation, route }) => {
  const [scholarPrograms, setScholarPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = React.useRef();
  const headerSharedValue = useSharedValue(80);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { category, sharedElementPrefix } = route.params;

  function backHandler() {
    navigation.goBack()
  }

  useEffect(() => {
    setLoading(true);
    getScholarProgramByMajorId(category.id).then((res) => {
      setScholarPrograms(res.data);
      setLoading(false);
    });
  }, [category.id]);

  function renderHeader() {
    const inputRange = [0, HEADER_HEIGHT - 50];
    headerSharedValue.value = withDelay(500,
      withTiming(0, {
        duration: 500
      })
    );

    const headerFadeAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(headerSharedValue.value, [80, 0], [0, 1])
      };
    });

    const headerHeightAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: interpolate(scrollY.value, inputRange, [HEADER_HEIGHT, 120], Extrapolation.CLAMP)
      };
    });

    const headerHideOnScrollAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, [80, 0], [0, 1], Extrapolation.CLAMP),
        transform: [
          {
            translateY: interpolate(scrollY.value, inputRange, [0, 200], Extrapolation.CLAMP)
          }
        ]
      };
    });

    const headerShowOnScrollAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, [80, 0], [1, 0], Extrapolation.CLAMP),
        transform: [
          {
            translateY: interpolate(scrollY.value, inputRange, [50, 130], Extrapolation.CLAMP)
          }
        ]
      };
    });

    return (
      <Animated.View
        style={[{
          top: 0,
          left: 0,
          right: 0,
          height: 250,
          overflow: 'hidden'
        }, headerHeightAnimatedStyle]}
      >
        <SharedElement
          id={`${sharedElementPrefix}-CategoryCard-Bg-${category?.id}`}
          style={[StyleSheet.absoluteFillObject]}
        >
          <Image
            source={category?.thumbnail}
            resizeMode='cover'
            style={{
              height: "100%",
              width: "100%",
              borderBottomLeftRadius: 60
            }}
          />
        </SharedElement>

        <Animated.View
          style={[{
            position: 'absolute',
            top: -80,
            left: 0,
            right: 0
          }, headerShowOnScrollAnimatedStyle]}
        >
          <Text
            style={{
              textAlign: 'center',
              color: COLORS.white,
              fontSize: 26, fontWeight: 700,
              lineHeight: 36
            }}
          >
            {category?.title}
          </Text>
        </Animated.View>

        <Animated.View
          style={[{
            position: 'absolute',
            bottom: 70,
            left: 30
          }, headerHideOnScrollAnimatedStyle]}
        >
          <SharedElement
            id={`${sharedElementPrefix}-CategoryCard-Title-${category?.id}`}
            style={[StyleSheet.absoluteFillObject]}
          >
            <Text
              style={{
                position: 'absolute',
                color: COLORS.white,
                fontSize: 26, fontWeight: 700,
                lineHeight: 36
              }}
            >
              {category?.title}
            </Text>
          </SharedElement>
        </Animated.View>

        <Animated.View style={headerFadeAnimatedStyle}>
          <IconButton
            icon={icons.back}
            iconStyle={{
              tintColor: COLORS.black
            }}
            containerStyle={{
              position: 'absolute',
              top: 40,
              left: 20,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 25,
              backgroundColor: COLORS.white
            }}
            onPress={() => {
              if (scrollY.value > 0 && scrollY.value <= 200) {
                flatListRef.current?.scrollToOffset({
                  offset: 0,
                  animated: true
                });
                setTimeout(() => {
                  headerSharedValue.value = withTiming(80, {
                    duration: 500
                  }, () => {
                    runOnJS(backHandler)();
                  });
                });
              } else {
                backHandler();
              }
            }}
          />
        </Animated.View>
      </Animated.View>
    );
  }

  function renderResult() {
    if (scholarPrograms.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.gray50, textAlign: 'center', ...FONTS.h2 }}>
            No scholarships available yet
          </Text>
        </View>
      );
    }

    return (
      <Animated.FlatList
        ref={flatListRef}
        data={scholarPrograms}
        keyExtractor={(item) => `Result-${item.id}`}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        onScroll={onScroll}
        ListHeaderComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: SIZES.base }}>
            <Text style={{ flex: 1 }}>{scholarPrograms.length} results</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <HorizontalList
            course={item}
            containerStyle={{
              marginVertical: SIZES.padding,
              marginTop: index === 0 ? SIZES.radius : SIZES.padding,
            }}
            onPress={() => navigation.navigate('ScholarshipDetail', { selectedScholarship: item })}
          />
        )}
        ItemSeparatorComponent={() => <LineDivider lineStyle={{ backgroundColor: COLORS.gray20 }} />}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {renderHeader()}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        renderResult()
      )}
    </View>
  );
}

export default ScholarshipByMajor;
