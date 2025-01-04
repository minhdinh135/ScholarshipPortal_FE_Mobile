import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import moment from "moment";
import { SIZES, FONTS, COLORS } from "../../constants";
import Icon from "react-native-vector-icons/Ionicons";

const HorizontalList = ({ containerStyle, course, onPress }) => {
  const shortenDescription = (description) => {
    if (description && description.length > 30) {
      return description.substring(0, 30) + "...";
    }
    return description;
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        ...containerStyle,
      }}
      onPress={onPress}
    >
      <ImageBackground
        // source={{ uri: course.imageUrl }}
        source={{ uri: "https://t3.ftcdn.net/jpg/04/91/76/62/360_F_491766294_h4j7LbW2YgfbNHhq7F8GboIc1XyBSEY5.jpg" }}
        resizeMode="cover"
        style={{
          width: 150,
          height: 150,
          marginBottom: SIZES.radius,
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
          }}
        >
          {course.name}
        </Text>
        <Text
          style={{
            ...FONTS.body4,
            color: COLORS.gray60,
            marginTop: SIZES.base,
          }}
        >
          {shortenDescription(course.description)}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: SIZES.base,
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
            marginTop: SIZES.base,
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
