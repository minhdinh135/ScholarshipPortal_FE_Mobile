import React from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity } from "react-native";

import { IconLabel } from "../Card";
import { SIZES, FONTS, COLORS, icons } from "../../constants";

const HorizontalList = ({ containerStyle, course, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        ...containerStyle
      }}
      onPress={onPress}
    >
      <ImageBackground
        src={course.imageUrl}
        resizeMode="cover"
        style={{
          width: 130,
          height: 130,
          marginBottom: SIZES.radius
        }}
        imageStyle={{
          borderRadius: SIZES.radius
        }}
      />
      <View
        style={{
          flex: 1,
          marginLeft: SIZES.base
        }}
      >
        <Text
          style={{
            ...FONTS.h3,
            fontSize: 18
          }}
        >
          {course.name}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES.base
          }}
        >
          <Text
            style={{
              ...FONTS.h4
            }}
          >
            By {course.name}
          </Text>

          <IconLabel
            icon={icons.time}
            label={course.scholarshipAmount}
            containerStyle={{
              marginLeft: SIZES.base
            }}
            iconStyle={{
              width: 15,
              height: 15
            }}
            labelStyle={{
              ...FONTS.body4
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES.base
          }}
        >
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.primary
            }}
          >
            {course.numberOfScholarships}
          </Text>

          <IconLabel
            icon={icons.star}
            containerStyle={{
              marginLeft: SIZES.base
            }}
            iconStyle={{
              width: 15,
              height: 15,
              tintColor: COLORS.primary2
            }}
            labelStyle={{
              marginLeft: 5,
              color: COLORS.black,
              ...FONTS.h3
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default HorizontalList;