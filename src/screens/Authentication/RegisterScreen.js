import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONTS, icons, SIZES } from '../../constants';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const navigation = useNavigation();
  const { signUp } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return phone.length >= 9 && phone.length <= 10 && /^\d+$/.test(phone);
  };

  const handleRegister = async () => {
    setEmailError('');
    setPasswordError('');
    setPhoneError('');

    let isValid = true;

    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setPhoneError('Phone number must be 9 to 10 digits long.');
      isValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (!isValid) return;

    const user = {
      username: name,
      email,
      phoneNumber,
      password,
      address: '',
      avatarUrl: '',
      loginWithGoogle: false,
      status: 'ACTIVE',
      roleId: 5,
    };

    setIsLoading(true);
    try {
      await signUp(user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('Registration failed:', error);
    }
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
        <View style={{ marginVertical: 22 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              marginVertical: 12,
              color: COLORS.primary,
            }}
          >
            Create Account
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: COLORS.black,
            }}
          >
            Get your scholarship now!
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>Email address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Text style={styles.inputLabel}>Full name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.black}
              keyboardType="default"
              style={styles.input}
            />
          </View>

          <Text style={styles.inputLabel}>Mobile number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={phoneNumber}
              onChangeText={(number) => setPhoneNumber(number)}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.black}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={(pass) => setPassword(pass)}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isShowPassword}
              style={styles.input}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 12 }}
              onPress={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? (
                <Entypo name="eye-with-line" size={24} color={COLORS.black} />
              ) : (
                <Entypo name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        <Pressable
          onPress={handleRegister}
          style={{
            width: '100%',
            backgroundColor: COLORS.primary,
            padding: 15,
            marginTop: 20,
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 6,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Sign Up
            </Text>
          )}
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.gray50,
              marginHorizontal: 10,
            }}
          />
          <Text style={{ fontSize: 14 }}>Or sign up with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.gray50,
              marginHorizontal: 10,
            }}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Image
            source={icons.google}
            style={{
              width: 24,
              height: 24,
            }}
          />
          <Text style={styles.btnTxt}>Google</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
            Already have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: 'bold',
                marginLeft: 6,
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  inputLabel: {
    ...FONTS.body4,
    marginVertical: 8,
  },
  inputContainer: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: SIZES.padding,
  },
  input: {
    width: '100%',
  },
  errorText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
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
    ...FONTS.body3,
    color: COLORS.black,
  },
});
