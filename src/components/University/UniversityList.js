import React from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity } from "react-native";

import { IconLabel } from "../Card";
import { SIZES, FONTS, COLORS, icons } from "../../constants";

const UniversityList = ({ containerStyle, university, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        ...containerStyle
      }}
      onPress={onPress}
    >
      <ImageBackground
        // source={university.imageUrl}
        // src={university.imageUrl}
        resizeMode="cover"
        style={{
          width: 130,
          height: 130,
          marginBottom: SIZES.radius
        }}
        imageStyle={{
          borderRadius: SIZES.radius
        }}
      >
        {/* <View
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            backgroundColor: COLORS.white
          }}
        >
          <Image
            source={icons.favourite}
            resizeMode="contain"
            style={{
              width: 20,
              height: 20,
              tintColor: university.is_favourite ? COLORS.secondary : COLORS.additionalColor4
            }}
          />
        </View> */}
      </ImageBackground>

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
          {university.name}
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
            By {university.name}
          </Text>

          <IconLabel
            icon={icons.time}
            label={university.scholarshipAmount}
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
            {/* {university.numberOfScholarships} */}
            Hello
          </Text>

          {/* <IconLabel
            icon={icons.star}
            // label={university.ratings}
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
          /> */}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default UniversityList;