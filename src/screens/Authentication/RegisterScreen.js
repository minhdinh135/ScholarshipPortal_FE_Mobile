import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Pressable, Image, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { COLORS, icons, SIZES } from '../../constants'
import { Entypo } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'

const RegisterSreen = () => {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigation = useNavigation();
  const { signUp } = useAuth();

  const handleRegister = async () => {
    const user = {
      username: name,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      address: "",
      avatarUrl: "",
      loginWithGoogle: false,
      status: "ACTIVE",
      roleId: 5
    }

    try {
      await signUp(user).then(
        Alert.alert("Registration successful", "You have been registered!"));
      // Clear form fields after successful registration
      // setName("");
      // setEmail("");
      // setPassword("");
    } catch (error) {
      Alert.alert("Registration failed", "Something went wrong when registering!");
      console.log("Registration failed", error);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        padding: SIZES.padding,
        // alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{ marginVertical: 22 }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              marginVertical: 12,
              color: COLORS.primary
            }}
          >
            Create Account
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.black
            }}
          >
            Get your scholarship now!
          </Text>
        </View>

        <View
          style={{
            marginBottom: 12
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              marginVertical: 8,
            }}
          >
            Email address
          </Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: SIZES.padding
            }}
          >
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder='Enter your email address'
              placeholderTextColor={COLORS.black}
              keyboardType='default'
              style={{
                width: '100%'
              }} />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              marginVertical: 8,
            }}
          >
            Full name
          </Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: SIZES.padding
            }}
          >
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder='Enter your full name'
              placeholderTextColor={COLORS.black}
              keyboardType='default'
              style={{
                width: '100%'
              }} />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              marginVertical: 8,
            }}
          >
            Mobile number
          </Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: SIZES.padding
            }}
          >
            <TextInput
              value={phoneNumber}
              onChangeText={(number) => setPhoneNumber(number)}
              placeholder='Enter your phone number'
              placeholderTextColor={COLORS.black}
              keyboardType='number-pad'
              style={{
                width: '100%'
              }} />
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              marginVertical: 8,
            }}
          >
            Password
          </Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: SIZES.padding
            }}
          >
            <TextInput
              value={password}
              onChangeText={(pass) => setPassword(pass)}
              placeholder='Enter your password'
              placeholderTextColor={COLORS.black}
              secureTextEntry={isShowPassword}
              style={{
                width: '100%'
              }} />

            <TouchableOpacity
              style={{ position: 'absolute', right: 12 }}
              onPress={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? (
                <Entypo name='eye-with-line' size={24} color={COLORS.black} />
              ) : (
                <Entypo name='eye' size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 6
          }}
        >
          <Checkbox
            style={{ marginRight: 8 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.primary : undefined}
          />
          <Text>I agree to the terms and conditions</Text>
        </View>
        <Pressable
          onPress={handleRegister}
          style={{
            width: '100%',
            backgroundColor: COLORS.primary,
            padding: 15,
            marginTop: 20,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Sign Up
          </Text>
        </Pressable>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.gray50, marginHorizontal: 10 }} />
          <Text style={{ fontSize: 14 }}>Or sign up with</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.gray50, marginHorizontal: 10 }} />

        </View>
        <TouchableOpacity style={styles.button}>
          <Image
            source={icons.google}
            style={{
              width: 24,
              height: 24
            }} />
          <Text style={styles.btnTxt}>Google</Text>
        </TouchableOpacity>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Already have an account?
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{
              fontSize: 16, color: COLORS.primary, fontWeight: 'bold', marginLeft: 6
            }}>Login</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default RegisterSreen;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 10,
    borderColor: COLORS.gray90,
    borderRadius: 25,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 5
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black
  }
})