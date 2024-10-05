import { View, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import Colors from '../../shared/Colors'
import { StyleSheet } from 'react-native'

export default function SearchBar() {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={styles.container}>
        <Ionicons name='search' size={24} color={Colors.gray} style={{ marginRight: 10 }} />
        <TextInput placeholder='Search' />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    padding: 5,
    borderRadius: 10,
    elevation: 3,
    marginTop: 10,
    alignItems: 'center',
  }
})