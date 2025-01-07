import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS, icons } from '../../constants';
import { IconButton, IconLabel } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import * as DocumentPicker from "expo-document-picker";
import { changeAvatar, getAccountById } from '../../api/accountApi';

const EditProfileScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [userProfile, setUserProfile] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAccountById(userInfo.id)
      .then((res) => {
        setUserProfile(res || []);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const uploadFile = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });
      if (result) {
        const { uri, name, mimeType, size } = result.assets[0];
        const files = new FormData();
        files.append("File", {
          uri: uri,
          name: name,
          type: mimeType,
          size: size,
        });
        await changeAvatar(userInfo.id, files);
      }
    } catch (error) {
      Alert.alert("Error", "There was a problem selecting or uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={icons.back}
          iconStyle={styles.iconStyle}
          containerStyle={styles.iconContainer}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <ScrollView>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={uploadFile}>
            <Image
              src={userInfo.avatar}
              style={styles.avatar}
            />
            <View style={styles.cameraIconContainer}>
              <IconLabel
                icon={icons.camera}
                iconStyle={styles.cameraIconStyle}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {['Username', 'Email', 'Phone number', 'Address'].map((field, index) => (
            <View style={styles.inputGroup} key={index}>
              <Text style={styles.label}>{field}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={userProfile[field.toLowerCase().replace(' ', '')]}
                  onChangeText={(value) => setUserProfile({
                    ...userProfile,
                    [field.toLowerCase().replace(' ', '')]: value,
                  })}
                  editable={true}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
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
  iconStyle: {
    tintColor: COLORS.black,
  },
  iconContainer: {
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
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 22,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 9999,
  },
  cameraIconStyle: {
    tintColor: COLORS.primary3,
    width: 24,
    height: 24,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...FONTS.h3,
  },
  inputContainer: {
    height: 44,
    width: '100%',
    borderColor: COLORS.gray80,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 6,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
});

export default EditProfileScreen;
