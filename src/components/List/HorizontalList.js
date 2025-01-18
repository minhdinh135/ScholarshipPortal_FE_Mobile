import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import moment from "moment";
import { SIZES, FONTS, COLORS } from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";

const HorizontalList = ({ containerStyle, course, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        ...containerStyle,
      }}
      onPress={onPress}
    >
      <ImageBackground
        source={{ uri: course.imageUrl }}
        resizeMode="cover"
        style={{
          width: 160,
          height: 100,
          borderRadius: SIZES.radius,
          marginRight: 10
        }}
        imageStyle={{
          borderRadius: SIZES.radius,
        }}
      />
      <View
        style={{
          flex: 1,
          marginLeft: SIZES.base,
        }}
      >
        <Text
          style={{
            ...FONTS.h3,
            fontSize: 18,
            flexWrap: "wrap",
          }}
        >
          {course.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: SIZES.base / 2,
          }}
        >
          <Icon name="time-outline" size={18} color={COLORS.gray60} />
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.gray60,
              marginLeft: SIZES.base / 2,
            }}
          >
            {moment(course.deadline).format("MMM DD, YYYY")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: SIZES.base / 2,
          }}
        >
          <Icon name="cash-outline" size={18} color={COLORS.primary} />
          <Text
            style={{
              ...FONTS.h4,
              color: COLORS.primary,
              marginLeft: SIZES.base / 2,
            }}
          >
            ${course.scholarshipAmount.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HorizontalList;
