import { View, Text, Image, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'

import { Shadow } from 'react-native-shadow-2'
import { TextButton, CategoryCard } from '../components/Card'
import { COLORS, FONTS, SIZES, icons, dummyData } from "../constants";

import { useNavigation } from '@react-navigation/native'
import { getScholarProgram } from '../api/scholarshipProgramApi'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const SearchScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = React.useRef();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y
  })

  const [scholarPrograms, setScholarPrograms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  useEffect(() => {
    getScholarProgram().then((res) => {
      setScholarPrograms(res.data.items);
      setFilteredPrograms(res.data.items.slice(0, 3));
    })
  }, []);

  const filterScholarPrograms = (query) => {
    setSearchText(query);

    if (query) {
      const filtered = scholarPrograms.filter(program =>
        program.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms(scholarPrograms.slice(0, 3));
    }
  };

  function renderTopSearch() {
    return (
      <View
        style={{
          marginTop: SIZES.padding
        }}
      >
        <Text style={{ marginHorizontal: SIZES.padding, fontSize: 20, fontWeight: 'bold' }}>
          Top Searches
        </Text>

        <FlatList
          horizontal
          data={dummyData.top_searches}
          listKey="TopSearches"
          keyExtractor={item => `TopSearches-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: SIZES.radius,
          }}
          renderItem={({ item, index }) => (
            <TextButton
              label={item.label}
              contentContainerStyle={{
                paddingVertical: SIZES.radius,
                paddingHorizontal: SIZES.padding,
                marginLeft: index == 0 ? SIZES.padding : SIZES.radius,
                marginRight: index == dummyData.top_searches.length - 1 ? SIZES.padding : 0,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.gray10
              }}
              labelStyle={{
                color: COLORS.gray50,
                ...FONTS.h3
              }}
            />
          )}
        />
      </View>
    )
  }

  function renderBrowseCategory() {
    return (
      <View style={{ marginTop: SIZES.padding }}>
        <Text style={{ marginHorizontal: SIZES.padding, fontSize: 20, fontWeight: 'bold' }}>
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
              sharedElementPrefix="Home"
              category={item}
              containerStyle={{
                height: 130,
                width: (SIZES.width - (SIZES.padding * 2) - SIZES.radius) / 2,
                marginTop: SIZES.radius,
                marginLeft: (index + 1) % 2 == 0 ? SIZES.radius : SIZES.padding,
              }}
              onPress={() => navigation.navigate("ScholarshipByMajor", { category: item, sharedElementPrefix: "Home" })}
            />
          )}
        />
      </View>
    )
  }

  function renderSearchBar() {

    const inputRange = [0, 55];
    const searchBarAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: interpolate(scrollY.value, inputRange, [55, 0], Extrapolation.CLAMP),
        opacity: interpolate(scrollY.value, inputRange, [1, 0], Extrapolation.CLAMP)
      }
    })

    return (
      <Animated.View
        style={[{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          paddingHorizontal: SIZES.padding,
          height: 50,
        }, searchBarAnimatedStyle]}
      >
        <Shadow>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              width: SIZES.width - (SIZES.padding * 2),
              paddingHorizontal: SIZES.radius,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.white
            }}
          >
            <Image
              source={icons.search}
              style={{
                width: 25,
                height: 25,
                tintColor: COLORS.gray40
              }}
            />
            <TextInput
              style={{
                flex: 1,
                marginLeft: SIZES.base,
                ...FONTS.h4,
              }}
              value={searchText}
              onChangeText={filterScholarPrograms}
              placeholder='Search...'
              placeholderTextColor={COLORS.gray}
            />
          </View>
        </Shadow>

        {searchText.length > 0 && (
          <FlatList
            data={filteredPrograms}
            keyExtractor={item => `Program-${item.id}`}
            style={{
              position: 'absolute',
              top: 60,
              left: SIZES.padding,
              right: SIZES.padding,
              maxHeight: 200,
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              zIndex: 10,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('ScholarshipDetail', { selectedScholarship: item })}
                style={{
                  paddingVertical: SIZES.radius,
                  paddingHorizontal: SIZES.padding,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.gray10,
                }}
              >
                <Text style={{ ...FONTS.body4 }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </Animated.View>
    )
  }

  return (
    <GestureHandlerRootView>
      <View
        style={{
          backgroundColor: COLORS.white,
        }}
      >
        <Animated.ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            marginTop: 100,
            paddingBottom: 200,
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          keyboardDismissMode="on-drag"
          onScroll={onScroll}
        >
          {renderTopSearch()}
          {renderBrowseCategory()}
        </Animated.ScrollView>

        {renderSearchBar()}
      </View>
    </GestureHandlerRootView>
  )
}

export default SearchScreen;
