import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import TextButton from './TextButton';
import LineDivider from './LineDivider';
import { COLORS, FONTS, SIZES, icons, constants } from '../../constants';
import TwoPointSlider from './TwoPointSlider';

const ScholarshipTypeOption = ({ containerStyle, scholarshipType, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
        backgroundColor: isSelected ? COLORS.primary3 : COLORS.additionalColor9,
        ...containerStyle
      }}
      onPress={onPress}
    >
      <Image
        source={scholarshipType.icon}
        resizeMode='contain'
        style={{
          width: 40,
          height: 40,
          tintColor: isSelected ? COLORS.white : COLORS.gray80
        }}
      />

      <Text
        style={{
          marginTop: SIZES.base,
          color: isSelected ? COLORS.white : COLORS.gray80,
          ...FONTS.h3
        }}
      >
        {scholarshipType.label}
      </Text>
    </TouchableOpacity>
  )
}

const ScholarshipLevelOption = ({ containerStyle, scholarshipLevel, isLastItem, isSelected, onPress }) => {
  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          ...containerStyle
        }}
        onPress={onPress}
      >
        <Text
          style={{
            flex: 1,
            ...FONTS.body3
          }}
        >
          {scholarshipLevel.label}
        </Text>

        <Image
          source={isSelected ? icons.checkbox_on : icons.checkbox_off}
          resizeMode='contain'
          style={{
            width: 20,
            height: 20
          }}
        />
      </TouchableOpacity>

      {!isLastItem &&
        <LineDivider
          lineStyle={{ height: 1 }}
        />
      }
    </>
  )
}

const FilterModal = ({ filterModalSharedValue1, filterModalSharedValue2 }) => {

  const [selectedScholarshipType, setSelectedScholarshipType] = useState("");
  const [selectedScholarshipLevel, setSelectedScholarshipLevel] = useState("");
  const [selectedCreatedWithin, setSelectedCreatedWithin] = useState(0);

  const filterModalContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(filterModalSharedValue1.value, [SIZES.height, 0], [0, 1]),
      transform: [
        {
          translateY: filterModalSharedValue1.value
        }
      ]
    }
  })

  const filterModalBgAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(filterModalSharedValue2.value, [SIZES.height, 0], [0, 1])
    }
  })

  const filterModalContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(filterModalSharedValue2.value, [SIZES.height, 1], [0, 1]),
      transform: [
        {
          translateY: filterModalSharedValue2.value
        }
      ]
    }
  })

  function renderFooter() {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          marginVertical: 20,
          paddingHorizontal: SIZES.padding
        }}
      >
        <TextButton
          label="Reset"
          contentContainerStyle={{
            flex: 1,
            borderRadius: SIZES.radius,
            borderWidth: 1,
            backgroundColor: null
          }}
          labelStyle={{
            color: COLORS.black,
            ...FONTS.h3
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
            backgroundColor: COLORS.primary
          }}
          labelStyle={{
            color: COLORS.white,
            ...FONTS.h3
          }}
        />
      </View>
    )
  }

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        bottom: 0,
        height: SIZES.height,
        width: SIZES.width
      }, filterModalContainerAnimatedStyle]}
    >
      <Animated.View
        style={[{
          flex: 1,
          height: SIZES.height,
          width: SIZES.width,
          backgroundColor: COLORS.transparentBlack7
        }, filterModalBgAnimatedStyle]}
      >
        <Animated.View
          style={[{
            position: 'absolute',
            bottom: 0,
            height: SIZES.height * 0.9,
            width: SIZES.width,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: COLORS.white
          }, filterModalContentAnimatedStyle]}
        >
          <View
            style={{
              marginVertical: SIZES.padding,
              flexDirection: 'row',
              paddingHorizontal: SIZES.padding
            }}
          >

            <View style={{ width: 60 }} />

            <Text style={{ flex: 1, textAlign: 'center', ...FONTS.h1 }}>
              Filter
            </Text>

            <TextButton
              label="Cancel"
              contentContainerStyle={{
                width: 60,
                backgroundColor: null
              }}
              labelStyle={{
                color: COLORS.black,
                ...FONTS.body3
              }}
              onPress={() => {
                filterModalSharedValue2.value = withTiming(SIZES.height, { duration: 500 })
                filterModalSharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }))
              }}
            />
          </View>

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: SIZES.padding,
              paddingBottom: 50
            }}
          >
            <View style={{ marginTop: SIZES.radius }}>
              <Text style={{ ...FONTS.h3 }}>Scholarship Type</Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: SIZES.radius
                }}
              >
                {constants.class_types.map((item, index) => {
                  return (
                    <ScholarshipTypeOption
                      key={`ClassType-${index}`}
                      scholarshipType={item}
                      isSelected={selectedScholarshipType == item?.id}
                      containerStyle={{
                        marginLeft: index == 0 ? 0 : SIZES.base
                      }}
                      onPress={() => {
                        setSelectedScholarshipType(item.id)
                      }}
                    />
                  )
                })}
              </View>
            </View>

            <View style={{ marginTop: SIZES.padding }}>
              <Text style={{ ...FONTS.h3 }}>Scholarship Level</Text>
              <View>
                {constants.class_levels.map((item, index) => {
                  return (
                    <ScholarshipLevelOption
                      key={`ClassType-${index}`}
                      scholarshipLevel={item}
                      isLastItem={index == constants.class_levels.length - 1}
                      isSelected={selectedScholarshipLevel == item?.id}
                      onPress={() => {
                        setSelectedScholarshipLevel(item.id)
                      }}
                    />
                  )
                })}
              </View>
            </View>

            <View style={{ marginTop: SIZES.padding }}>
              <Text style={{ ...FONTS.h3 }}>Created Within</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                {constants.created_within.map((item, index) => {
                  return (
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
                        backgroundColor: item?.id == selectedCreatedWithin ? COLORS.primary3 : null
                      }}
                      labelStyle={{
                        color: item?.id == selectedCreatedWithin ? COLORS.white : COLORS.black,
                        ...FONTS.body3
                      }}
                      onPress={() => {
                        setSelectedCreatedWithin(item.id)
                      }}
                    />
                  )
                })}
              </View>
            </View>

            <View style={{ marginTop: SIZES.padding }}>
              <Text style={{ ...FONTS.h3 }}>Price Range</Text>
              <View
                style={{
                  alignItems: 'center'
                }}
              >
                <TwoPointSlider
                  values={[2000, 5000]}
                  min={1500}
                  max={6000}
                  postfix='$'
                  onValuesChange={(values) => console.log(values)}
                />
              </View>
            </View>
          </ScrollView>

          {renderFooter()}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}

export default FilterModal;