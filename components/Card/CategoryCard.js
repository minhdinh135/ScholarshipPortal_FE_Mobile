import { TouchableOpacity, Text, ImageBackground } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants";

const CategoryCard = ({ category, containerStyle }) => {
  return (
    <TouchableOpacity>
      <ImageBackground
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
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default CategoryCard;