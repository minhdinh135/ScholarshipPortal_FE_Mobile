import { View, SafeAreaView, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
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
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 22,
      }}
    >
      <View
        style={{
          marginHorizontal: 12,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <IconButton
          icon={icons.back}
          iconStyle={{
            tintColor: COLORS.black,
          }}
          containerStyle={{
            position: 'absolute',
            top: 40,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
            backgroundColor: COLORS.white,
          }}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ marginTop: 40, ...FONTS.h2 }}>Edit Profile</Text>
      </View>

      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            marginVertical: 22,
          }}
        >
          <TouchableOpacity onPress={uploadFile}>
            <Image
              src={userInfo.avatar}
              style={{
                height: 130,
                width: 130,
                borderRadius: 85,
                borderWidth: 2,
                borderColor: COLORS.primary,
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                zIndex: 9999,
              }}
            >
              <IconLabel
                icon={icons.camera}
                iconStyle={{ tintColor: COLORS.primary3, width: 24, height: 24 }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{ marginBottom: 20 }}
        >
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>Username</Text>
            <View
              style={{
                height: 44,
                width: '100%',
                borderColor: COLORS.gray80,
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={userProfile.username}
                onChangeText={(value) => setName(value)}
                editable={true}
              />
            </View>
          </View>

          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>Email</Text>
            <View
              style={{
                height: 44,
                width: '100%',
                borderColor: COLORS.gray80,
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={userProfile.email}
                onChangeText={(value) => setName(value)}
                editable={true}
              />
            </View>
          </View>

          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>Phone number</Text>
            <View
              style={{
                height: 44,
                width: '100%',
                borderColor: COLORS.gray80,
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={userProfile.phoneNumber}
                onChangeText={(value) => setName(value)}
                editable={true}
              />
            </View>
          </View>

          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>Address</Text>
            <View
              style={{
                height: 44,
                width: '100%',
                borderColor: COLORS.gray80,
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 6,
                justifyContent: 'center',
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={userProfile.address}
                onChangeText={(value) => setName(value)}
                editable={true}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            height: 44,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              ...FONTS.body3,
              color: COLORS.white,
            }}
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
