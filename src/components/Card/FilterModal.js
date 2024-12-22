import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import TextButton from './TextButton';
import { COLORS, FONTS, SIZES, constants } from '../../constants';
import TwoPointSlider from './TwoPointSlider';

const FilterModal = ({
  filterModalSharedValue1,
  filterModalSharedValue2,
  onApplyFilters,
}) => {
  const [selectedCreatedWithin, setSelectedCreatedWithin] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [isReset, setIsReset] = useState(false);

  const filterModalContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(filterModalSharedValue1.value, [SIZES.height, 0], [0, 1]),
      transform: [
        {
          translateY: filterModalSharedValue1.value,
        },
      ],
    };
  });

  const filterModalBgAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(filterModalSharedValue2.value, [SIZES.height, 0], [0, 1]),
    };
  });

  const filterModalContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(filterModalSharedValue2.value, [SIZES.height, 1], [0, 1]),
      transform: [
        {
          translateY: filterModalSharedValue2.value,
        },
      ],
    };
  });

  function handleApplyFilters() {
    if (isReset) {
      onApplyFilters([]);
      setIsReset(false);
    } else {
      onApplyFilters({
        createdWithin: selectedCreatedWithin,
        priceRange: priceRange,
      });
    }

    filterModalSharedValue2.value = withTiming(SIZES.height, { duration: 500 });
    filterModalSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }));
  }

  function renderFooter() {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          marginVertical: 20,
          paddingHorizontal: SIZES.padding,
        }}
      >
        <TextButton
          label="Reset"
          contentContainerStyle={{
            flex: 1,
            borderRadius: SIZES.radius,
            borderWidth: 1,
            backgroundColor: null,
          }}
          labelStyle={{
            color: COLORS.black,
            ...FONTS.h3,
          }}
          onPress={() => {
            setIsReset(true);
            setSelectedCreatedWithin(0);
            setPriceRange([0, 50000]);
          }}
        />
        <TextButton
          label="Apply"
          contentContainerStyle={{
            flex: 1,
            marginLeft: SIZES.radius,
            borderRadius: SIZES.radius,
            borderWidth: 2,
            borderColor: COLORS.primary,
            backgroundColor: COLORS.primary,
          }}
          labelStyle={{
            color: COLORS.white,
            ...FONTS.h3,
          }}
          onPress={handleApplyFilters}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          height: SIZES.height,
          width: SIZES.width,
        },
        filterModalContainerAnimatedStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            height: SIZES.height,
            width: SIZES.width,
            backgroundColor: COLORS.transparentBlack7,
          },
          filterModalBgAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              height: SIZES.height * 0.9,
              width: SIZES.width,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: COLORS.white,
            },
            filterModalContentAnimatedStyle,
          ]}
        >
          <View
            style={{
              marginVertical: SIZES.padding,
              flexDirection: 'row',
              paddingHorizontal: SIZES.padding,
            }}
          >
            <View style={{ width: 60 }} />
            <Text style={{ flex: 1, textAlign: 'center', ...FONTS.h1 }}>Filter</Text>
            <TextButton
              label="Cancel"
              contentContainerStyle={{
                width: 60,
                backgroundColor: null,
              }}
              labelStyle={{
                color: COLORS.black,
                ...FONTS.body3,
              }}
              onPress={() => {
                filterModalSharedValue2.value = withTiming(SIZES.height, { duration: 500 });
                filterModalSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }));
              }}
            />
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: SIZES.padding,
              paddingBottom: 50,
            }}
          >
            <View style={{ marginTop: SIZES.padding }}>
              <Text style={{ ...FONTS.h3 }}>Deadline</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {constants.created_within.map((item, index) => (
                  <TextButton
                    key={`CreatedWithin-${index}`}
                    label={item?.label}
                    contentContainerStyle={{
                      height: 45,
                      paddingHorizontal: SIZES.radius,
                      marginLeft: index % 3 == 0 ? 0 : SIZES.radius,
                      marginTop: SIZES.radius,
                      borderWidth: 1,
                      borderRadius: SIZES.radius,
                      borderColor: COLORS.gray20,
                      backgroundColor: item?.dateRange === selectedCreatedWithin ? COLORS.primary3 : null,
                    }}
                    labelStyle={{
                      color: item?.dateRange === selectedCreatedWithin ? COLORS.white : COLORS.black,
                      ...FONTS.body3,
                    }}
                    onPress={() => setSelectedCreatedWithin(item.dateRange)}
                  />
                ))}
              </View>
            </View>

            <View style={{ marginTop: SIZES.padding }}>
              <Text style={{ ...FONTS.h3 }}>Price Range</Text>
              <View style={{ alignItems: 'center' }}>
                <TwoPointSlider
                  values={priceRange}
                  min={0}
                  max={50000}
                  postfix="$"
                  onValuesChange={setPriceRange}
                />
              </View>
            </View>
          </ScrollView>
          {renderFooter()}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default FilterModal;