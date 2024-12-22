import React, { memo } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

import { SIZES, FONTS, COLORS } from "../../constants";

const ServiceHorizontalList = ({ containerStyle, course, onPress }) => {
  const shortenDescription = (description) => {
    if (description && description.length > 20) {
      return description.substring(0, 20) + "...";
    }
    return description;
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        ...containerStyle
      }}
      onPress={onPress}
    >
      <ImageBackground
        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEbr-UWJc7dtbc8zEKrYUGvi8M0tnaBYxZEw&s" }} // Static image for now
        resizeMode="cover"
        style={{
          width: 120,
          height: 120,
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
          <Icon name="business" size={18} color={COLORS.primary} style={{ marginRight: SIZES.base }} />
          <Text
            style={{
              ...FONTS.h4
            }}
          >
            {course.type}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5
          }}
        >
          <Icon name="reader" size={18} color={COLORS.primary} style={{ marginRight: SIZES.base }} />
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.gray60,
              maxWidth: 200
            }}
          >
            {shortenDescription(course.description)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES.base
          }}
        >
          <Icon name="cash-outline" size={18} color={COLORS.primary} style={{ marginRight: SIZES.base }} />
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.primary
            }}
          >
            ${course.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ServiceHorizontalList);
