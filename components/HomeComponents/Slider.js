import { View, Text, FlatList, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'

const sliders = [
  {
    image: 'https://webcool.vn/files/news/2020/05/27/21-thu-vien-hoan-thien-du-an-react-native-cua-ban-093020.png',
    name: 'React',
  },
  {
    image: 'https://webcool.vn/files/news/2020/05/27/21-thu-vien-hoan-thien-du-an-react-native-cua-ban-093020.png',
    name: 'React',
  },
  {
    image: 'https://webcool.vn/files/news/2020/05/27/21-thu-vien-hoan-thien-du-an-react-native-cua-ban-093020.png',
    name: 'React',
  }
]

export default function Slider() {
  const [slider, setSlider] = useState([]);
  return (
    <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
      <FlatList
        data={sliders}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item.image }}
              style={{ width: Dimensions.get('screen').width * 0.88, height: 150, borderRadius: 15, marginRight: 10 }}
            />
          </View>
        )}
      />
    </View>
  )
}

// import React, { useState } from 'react';
// import { View, Image, Dimensions } from 'react-native';
// import Carousel from 'react-native-reanimated-carousel';

// const sliders = [
//   {
//     image: 'https://webcool.vn/files/news/2020/05/27/21-thu-vien-hoan-thien-du-an-react-native-cua-ban-093020.png',
//     name: 'React',
//   },
//   {
//     image: 'https://blog.geekhunter.com.br/wp-content/uploads/2021/08/ide-javascript.png',
//     name: 'React',
//   },
//   {
//     image: 'https://webcool.vn/files/news/2020/05/27/21-thu-vien-hoan-thien-du-an-react-native-cua-ban-093020.png',
//     name: 'React',
//   }
// ];

// export default function Slider() {
//   const [slider, setSlider] = useState(sliders);

//   return (
//     <View style={{ marginTop: 10 }}>
//       <Carousel
//         // data={slider}
//         data={[...new Array(6).keys()]}
//         width={Dimensions.get('window').width}
//         height={Dimensions.get('window').width / 2}
//         loop={true}
//         autoPlay={true}
//         autoPlayInterval={3000}
//         scrollAnimationDuration={1000}
//         onSnapToItem={(index) => console.log('current index:', index)}
//         renderItem={({ index }) => (
//           <View
//             style={{
//               flex: 1,
//               borderWidth: 1,
//               justifyContent: 'center',
//             }}
//           >
//             <Text style={{ textAlign: 'center', fontSize: 30 }}>
//               {index}
//             </Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }
