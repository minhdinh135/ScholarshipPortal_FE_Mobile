import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { SIZES, FONTS, COLORS } from "../../constants";
import Icon from 'react-native-vector-icons/Ionicons';

const UniversityList = ({ containerStyle, university, onPress }) => {
  const shortenDescription = (description) => {
    if (description && description.length > 20) {
      return description.substring(0, 50) + "...";
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
        source={{ uri: "https://t3.ftcdn.net/jpg/04/91/76/62/360_F_491766294_h4j7LbW2YgfbNHhq7F8GboIc1XyBSEY5.jpg" }}
        resizeMode="cover"
        style={{
          width: 150,
          height: 150,
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
          {university.name}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES.base
          }}
        >
          <Icon name="location-outline" size={24} color={COLORS.primary} />
          <Text
            style={{
              ...FONTS.h4,
              color: COLORS.primary
            }}
          >
            {university.country.name}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5
          }}
        >
          <Text
            style={{
              ...FONTS.body4,
              color: COLORS.gray60,
              marginTop: SIZES.base,
              flexWrap: 'wrap',
              maxWidth: 200
            }}
          >
            {shortenDescription(university.description)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UniversityList;
