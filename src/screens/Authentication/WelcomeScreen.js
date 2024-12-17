import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, FONTS, icons, images } from '../../constants'
import { Entypo } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <>
      <ImageBackground
        source={images.welcome}
        style={{ flex: 1 }}
        resizeMode='cover'
      >
        <View style={styles.container}>
          <LinearGradient
            style={styles.background}
            colors={["transparent", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.8)"]}
          >
            <View style={styles.wrapper}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../../public/icon.jpg')}
                  style={styles.logo}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Welcome to Scholarship</Text>
                <Text style={styles.description}>
                  A platform to connect students with scholarship opportunities.
                </Text>
              </View>

              <View style={styles.socialLogin}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
                  <Entypo name='mail' size={20} />
                  <Text style={styles.btnTxt}>Login with Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Image
                    source={icons.google}
                    style={{
                      width: 18,
                      height: 18
                    }} />
                  <Text style={styles.btnTxt}>Login with Google</Text>
                </TouchableOpacity>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
                <Text style={{ textAlign: "center", color: COLORS.gray60, ...FONTS.body3 }}>
                  Don't have an account?
                </Text>
                <Pressable
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={{
                    fontSize: 16, color: COLORS.primary, fontWeight: 'bold', marginLeft: 6
                  }}>Sign Up</Text>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
    </>
  )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  background: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end'
  },
  wrapper: {
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 100
  },
  titleContainer: {
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 200
  },
  title: {
    ...FONTS.h1,
    color: COLORS.black,
  },
  description: {
    ...FONTS.body3,
    color: COLORS.gray80,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  socialLogin: {
    alignSelf: 'stretch'
  },
  button: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray90,
    borderRadius: 25,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 5
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black
  }
})
