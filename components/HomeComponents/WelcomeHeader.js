import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function WelcomeHeader() {

  return (
    <View style={styles.container}>
      <View>
        <Text>Hello,</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Nguyen Dang</Text>
      </View>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png' }}
        style={{ width: 40, height: 40, borderRadius: 100 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  }
})