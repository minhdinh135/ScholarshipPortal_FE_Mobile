import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, icons } from '../../constants';
import { IconButton } from '../../components/Card';
import { changePassword } from '../../api/accountApi';
import { useAuth } from '../../context/AuthContext';

const ChangePasswordScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async () => {
    setErrorMessages({ oldPassword: '', newPassword: '', confirmPassword: '' });
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessages({
        oldPassword: !oldPassword ? 'Old password is required' : '',
        newPassword: !newPassword ? 'New password is required' : '',
        confirmPassword: !confirmPassword ? 'Please confirm your password' : '',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessages({
        ...errorMessages,
        confirmPassword: 'New password and confirm password do not match!',
      });
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessages({
        ...errorMessages,
        newPassword: 'Password must be at least 6 characters!',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(userInfo.id, userInfo.email, oldPassword, newPassword);
      Alert.alert('Success', 'Your password has been changed successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={icons.back}
          iconStyle={{
            tintColor: COLORS.black,
          }}
          containerStyle={styles.iconButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Change Password</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg',
              }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.descriptionText}>
              Your new password must be at least 6 characters long and different
              from your old password.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errorMessages.oldPassword && styles.inputError]}
              placeholder="Old Password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            {errorMessages.oldPassword ? (
              <Text style={styles.errorText}>{errorMessages.oldPassword}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errorMessages.newPassword && styles.inputError]}
              placeholder="New Password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            {errorMessages.newPassword ? (
              <Text style={styles.errorText}>{errorMessages.newPassword}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errorMessages.confirmPassword && styles.inputError]}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {errorMessages.confirmPassword ? (
              <Text style={styles.errorText}>{errorMessages.confirmPassword}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 22,
  },
  header: {
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.white,
  },
  headerText: {
    marginTop: 40,
    ...FONTS.h2,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '80%',
    height: 200,
  },
  descriptionText: {
    textAlign: 'center',
    color: COLORS.gray70,
    ...FONTS.body4,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    color: COLORS.black,
    ...FONTS.body3,
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    ...FONTS.body4,
    marginTop: -15,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
  },
});

export default ChangePasswordScreen;
