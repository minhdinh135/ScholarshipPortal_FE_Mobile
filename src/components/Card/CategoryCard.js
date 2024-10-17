import { TouchableOpacity, Text, ImageBackground, Image, StyleSheet, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants";
import { SharedElement } from "react-navigation-shared-element";

const CategoryCard = ({ sharedElementPrefix, category, containerStyle, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        height: 150,
        width: 200,
        ...containerStyle
      }}
      onPress={onPress}
    >
      {/* <ImageBackground
        source={category?.thumbnail}
        resizeMode="cover"
        style={{
          height: 150,
          width: 200,
          paddingVertical: SIZES.padding,
          paddingHorizontal: SIZES.radius,
          justifyContent: 'flex-end',
          ...containerStyle
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            // ...FONTS.h2,
            fontSize: 20, fontWeight: 'bold', marginBottom: 4
          }}
        >
          {category?.title}
        </Text>
      </ImageBackground> */}

      <SharedElement
        id={`${sharedElementPrefix}-CategoryCard-Bg-${category?.id}`}
        style={[StyleSheet.absoluteFillObject]}
      >
        <Image
          source={category?.thumbnail}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: SIZES.radius,
          }}
        />
      </SharedElement>

      <View
        style={{
          position: 'absolute',
          bottom: 25,
          left: 5
        }}
      >
        <SharedElement
          id={`${sharedElementPrefix}-CategoryCard-Title-${category?.id}`}
          style={[StyleSheet.absoluteFillObject]}
        >
          <Text
            style={{
              position: 'absolute',
              color: COLORS.white,
              fontSize: 20, fontWeight: 'bold'
              // ...FONTS.h2
            }}
          >
            {category?.title}
          </Text>
        </SharedElement>
      </View>

    </TouchableOpacity>
  )
}

export default CategoryCard;