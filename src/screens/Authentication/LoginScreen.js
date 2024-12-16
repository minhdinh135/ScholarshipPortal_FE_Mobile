import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Pressable, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTS, icons, SIZES } from '../../constants'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { signIn, signInWithGoogle, userToken, setIsLoggedIn } = useAuth();
  const [isShowPassword, setIsShowPassword] = useState(false);

  useEffect(() => {
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, [userToken]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    await signIn(email, password);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        padding: SIZES.padding,
      }}
    >
      <KeyboardAvoidingView>
        <View style={{ marginVertical: 30 }}>
          <Text
            style={{
              marginVertical: 12,
              color: COLORS.primary,
              ...FONTS.largeTitle
            }}
          >
            Welcome back
          </Text>
          <Text
            style={{
              color: COLORS.gray60,
              ...FONTS.body3
            }}
          >
            Please log in to your account
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginVertical: 8, ...FONTS.body3 }}>
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
              style={{ width: '100%' }}
            />
          </View>

          <Text style={{ marginVertical: 8, ...FONTS.body3 }}>
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
              onChangeText={(text) => setPassword(text)}
              placeholder='Enter your password'
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isShowPassword}
              style={{ width: '100%' }}
            />
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
        {error ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 6,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }} />
          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{ alignSelf: 'flex-end' }}
          >
            <Text style={{ color: COLORS.primary }}>Forgot password?</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogin}
          style={{
            width: '100%',
            backgroundColor: COLORS.primary,
            padding: 15,
            marginTop: 20,
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
            Login
          </Text>
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.gray50, marginHorizontal: 10 }} />
          <Text style={{ fontSize: 14 }}>Or login with</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.gray50, marginHorizontal: 10 }} />
        </View>

        <TouchableOpacity style={styles.button} onPress={signInWithGoogle}>
          <Image
            source={icons.google}
            style={{ width: 24, height: 24 }}
          />
          <Text style={styles.btnTxt}>Google</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Don't have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={{
              fontSize: 16, color: COLORS.primary, fontWeight: 'bold', marginLeft: 6
            }}>Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default LoginScreen;

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
    gap: 5,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
});
