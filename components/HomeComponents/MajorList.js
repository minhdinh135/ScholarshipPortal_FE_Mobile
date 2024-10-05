import { View, Text, Animated } from 'react-native'
import React, { useRef } from 'react'
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { COLORS, SIZES, icons, dummyData } from "../../constants"
import { CategoryCard } from '../Card/index';

export default function MajorList() {
  const scrollViewRef = useRef();

  function renderBrowseCategory() {
    return (
      <View style={{ marginTop: SIZES.padding }}>
        <Text style={{ marginHorizontal: SIZES.padding, fontSize: 20, fontWeight: 'bold'}}>
          Browse Categories
        </Text>

        <FlatList
          data={dummyData.categories}
          numColumns={2}
          scrollEnabled={false}
          listKey="BrowseCategories"
          keyExtractor={item => `BrowseCategories-${item.id}`}
          contentContainerStyle={{
            marginTop: SIZES.radius
          }}
          renderItem={({ item, index }) => (
            <CategoryCard
              category={item}
              containerStyle={{
                height: 130,
                width: (SIZES.width - (SIZES.padding * 2) - SIZES.radius) / 2,
                marginTop: SIZES.radius,
                marginLeft: (index + 1) % 2 == 0 ? SIZES.radius : SIZES.padding,
              }}
            />
          )}
        />
      </View>
    )
  }

  return (
    <GestureHandlerRootView>
      <View>
        {renderBrowseCategory()}
      </View>
      {/* <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          marginTop: 300,
          paddingBottom: 300,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        >
          {renderBrowseCategory()}
        </Animated.ScrollView>
      </View> */}
    </GestureHandlerRootView>
  )
}