import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Keyboard, Alert } from 'react-native';
import { forgotPassword, resetPassword, verifyOTP } from '../../api/accountApi';
import { COLORS, FONTS, icons } from '../../constants';
import { IconButton } from '../../components/Card';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const response = await forgotPassword(email);
      if (!response) {
        throw new Error("Error sending OTP", response);
      }
      setIsLoading(false);
      navigation.navigate('OTPScreen', { email: email });
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error sending OTP", "Email not found")
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <IconButton
          icon={icons.back}
          iconStyle={{
            width: 25,
            height: 25,
            tintColor: COLORS.black
          }}
          containerStyle={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: COLORS.white
          }}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text
            style={{
              color: COLORS.white,
              ...FONTS.h3,
              textAlign: "center",
            }}
          >
            Send OTP
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputs = useRef([]);
  const { email } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      if (!enteredOtp.length === 6) {
        Alert.alert('Please enter a 6-digit OTP.');
      }
      const response = await verifyOTP(email, enteredOtp);
      if (!response) {
        throw new Error("Error sending OTP", response);
      }
      setIsLoading(false);
      navigation.navigate('ResetPassword', { email: email });
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error verifying OTP", "Wrong OTP code")
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <IconButton
          icon={icons.back}
          iconStyle={{
            width: 25,
            height: 25,
            tintColor: COLORS.black,
          }}
          containerStyle={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: COLORS.white,
          }}
          onPress={() => navigation.goBack()}
        />
      </View>

      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace('', index);
              }
            }}
            ref={(ref) => (inputs.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text
            style={{
              color: COLORS.white,
              ...FONTS.h3,
              textAlign: "center",
            }}
          >
            Verify OTP
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const ResetPasswordScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Password mismatch", "New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(email, newPassword);
      if (!response) {
        throw new Error("Error resetting password");
      }
      setIsLoading(false);
      Alert.alert("Success", "Password reset successfully", [
        { text: "OK", onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to reset password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <IconButton
          icon={icons.back}
          iconStyle={{
            width: 25,
            height: 25,
            tintColor: COLORS.black
          }}
          containerStyle={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: COLORS.white
          }}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.black,
    ...FONTS.h2,
  },
});

export { ForgotPasswordScreen, OTPScreen, ResetPasswordScreen };
