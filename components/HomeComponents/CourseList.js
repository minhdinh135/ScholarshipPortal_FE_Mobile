import { View, Text } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'
import { Image } from 'react-native'

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

export default function CourseList() {
  return (
    <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>Course</Text>
      <FlatList
        data={sliders}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item.image }}
              style={{ width: 180, height: 100, borderRadius: 10, marginRight: 10 }}
            />
          </View>
        )}
      />
    </View>
  )
}