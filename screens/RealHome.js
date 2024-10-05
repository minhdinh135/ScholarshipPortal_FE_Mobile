import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import WelcomeHeader from '../components/HomeComponents/WelcomeHeader'
import SearchBar from '../components/HomeComponents/SearchBar'
import Slider from '../components/HomeComponents/Slider'
import CourseList from '../components/HomeComponents/CourseList'
import MajorIcons from '../components/HomeComponents/MajorList'

export default function RealHome() {
  return (
    <View style={{ marginTop: 15 }}>
      <ScrollView>
        <WelcomeHeader />
        <SearchBar />
        <Slider />
        <CourseList />
        <MajorIcons />
      </ScrollView>
    </View>
  )
}