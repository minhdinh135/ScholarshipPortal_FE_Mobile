import React, { useCallback, useEffect, useState } from 'react'
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
import { FilterModal, IconButton, LineDivider } from '../../components/Card'
import { HorizontalList } from '../../components/List';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import { SharedElement } from 'react-navigation-shared-element';
import { getScholarProgram } from '../../api/scholarshipProgramApi';

const HEADER_HEIGHT = 250;

const ScholarshipListing = ({ navigation, route }) => {

  const [scholarPrograms, setScholarPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    PageIndex: 1,
    PageSize: 5,
    SortBy: '',
    IsDescending: false,
    IsPaging: true,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const flatListRef = React.useRef();
  const headerSharedValue = useSharedValue(80);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  })

  const filterModalSharedValue1 = useSharedValue(SIZES.height);
  const filterModalSharedValue2 = useSharedValue(SIZES.height);


  const { category, sharedElementPrefix } = route.params;

  function backHandler() {
    navigation.goBack()
  }

  const fetchPrograms = useCallback(() => {
    setLoading(true);
    getScholarProgram({
      PageIndex: pagination?.PageIndex,
      PageSize: pagination?.PageSize,
      SortBy: pagination?.SortBy,
      IsDescending: pagination?.IsDescending,
      IsPaging: pagination?.IsPaging,
    }).then((res) => {
      setScholarPrograms(res.data.items);
      setPagination((prev) => ({
        ...prev,
        hasNextPage: res.data.hasNextPage,
        hasPreviousPage: res.data.hasPreviousPage,
        totalPages: res.data.totalPages,
        PageIndex: res.data.pageIndex,
      }));
      setLoading(false);
    });
  }, [pagination.PageIndex, pagination.PageSize, pagination.SortBy, pagination.IsDescending, pagination.IsPaging]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  function loadNextPage() {
    if (pagination.hasNextPage) {
      setPagination((prev) => ({ ...prev, PageIndex: prev.PageIndex + 1 }));
    }
  }

  function loadPreviousPage() {
    if (pagination.hasPreviousPage) {
      setPagination((prev) => ({ ...prev, PageIndex: prev.PageIndex - 1 }));
    }
  }

  function renderHeader() {
    const inputRange = [0, HEADER_HEIGHT - 50]
    headerSharedValue.value = withDelay(500,
      withTiming(0, {
        duration: 500
      })
    )

    const headerFadeAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(headerSharedValue.value, [80, 0], [0, 1])
      }
    })

    const headerHeightAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: interpolate(scrollY.value, inputRange, [HEADER_HEIGHT, 120], Extrapolation.CLAMP)
      }
    })

    const headerHideOnScrollAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, [80, 0], [0, 1], Extrapolation.CLAMP),
        transform: [
          {
            translateY: interpolate(scrollY.value, inputRange, [0, 200], Extrapolation.CLAMP)
          }
        ]
      }
    })

    const headerShowOnScrollAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, [80, 0], [1, 0], Extrapolation.CLAMP),
        transform: [
          {
            translateY: interpolate(scrollY.value, inputRange, [50, 130], Extrapolation.CLAMP)
          }
        ]
      }
    })

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
                })
                setTimeout(() => {
                  headerSharedValue.value = withTiming(80, {
                    duration: 500
                  }, () => {
                    runOnJS(backHandler)();
                  })
                })
              } else {
                backHandler()
              }
            }}
          />
        </Animated.View>
      </Animated.View>
    )
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
            <IconButton
              icon={icons.filter}
              iconStyle={{ width: 20, height: 20 }}
              containerStyle={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: COLORS.primary,
              }}
              onPress={() => {
                filterModalSharedValue1.value = withTiming(0, {
                  duration: 100
                })
                filterModalSharedValue2.value = withDelay(100, withTiming(0, {
                  duration: 500
                }))
              }}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <HorizontalList
            course={item}
            containerStyle={{
              marginVertical: SIZES.padding,
              marginTop: index === 0 ? SIZES.radius : SIZES.padding,
            }}
            onPress={() => navigation.navigate('ScholarDetail', { selectedScholarship: item })}
          />
        )}
        ItemSeparatorComponent={() => <LineDivider lineStyle={{ backgroundColor: COLORS.gray20 }} />}
        ListFooterComponent={
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            {pagination.hasPreviousPage && (
              <Text onPress={loadPreviousPage} style={{ color: COLORS.primary }}>
                Previous
              </Text>
            )}
            {pagination.hasNextPage && (
              <Text onPress={loadNextPage} style={{ color: COLORS.primary }}>
                Next
              </Text>
            )}
          </View>
        }
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

      <FilterModal
        filterModalSharedValue1={filterModalSharedValue1}
        filterModalSharedValue2={filterModalSharedValue2}
      />

    </View>
  );

}

// ScholarshipListing.sharedElements = (route, otherRoute, showing) => {
//   const { category, sharedElementPrefix } = route.params;
//   return [
//     {
//       id: `${sharedElementPrefix}-CategoryCard-Bg-${category?.id}`
//     },
//     {
//       id: `${sharedElementPrefix}-CategoryCard-Title-${category?.id}`
//     }
//   ]
// }

export default ScholarshipListing;
