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

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match!');
    } else if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields!');
    } else if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters!');
    } else {
      try {
        const response = await changePassword(userInfo.id, userInfo.email, oldPassword, newPassword);
        if (response.status === 200) {
          Alert.alert('Success', 'Your password has been changed successfully!');
        } else if (response.status === 401) {
          Alert.alert('Error', 'Unauthorized. Old password is incorrect.');
        } else {
          Alert.alert('Error', 'Failed to change password. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to change password. Please try again.');
      }
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
              style={styles.input}
              placeholder="Old Password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
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
});

export default ChangePasswordScreen;
