import { View, SafeAreaView, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React from 'react'
import { COLORS, FONTS, icons } from '../../constants';
import { IconButton, IconLabel } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import * as DocumentPicker from "expo-document-picker";
import { changeAvatar } from '../../api/accountApi';

const EditProfileScreen = ({ navigation }) => {

  const { userInfo } = useAuth();

  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result) {
        const { uri, name, mimeType, size } = result.assets[0];
        const files = new FormData();
        files.append("files", {
          uri: uri,
          name: name,
          type: mimeType,
          size: size,
        });

        const responseText = await changeAvatar(userInfo.id, files).text();
        console.log("Raw Response:", responseText);

        try {
          const responseJson = JSON.parse(responseText);

          if (response.ok) {
            Alert.alert("Upload Success", "File uploaded successfully.");
          } else {
            console.error("Upload error:", responseJson);
            Alert.alert("Upload Error", "Failed to upload file.");
          }
        } catch (error) {
          console.error("Failed to parse response:", error);
          Alert.alert("Response Error", "The response is not valid JSON.");
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      Alert.alert("Error", "There was a problem selecting or uploading the file.");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 22
      }}
    >
      <View
        style={{
          marginHorizontal: 12,
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <IconButton
          icon={icons.back}
          iconStyle={{
            tintColor: COLORS.black
          }}
          containerStyle={{
            position: 'absolute',
            top: 40,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
            backgroundColor: COLORS.white
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
              source={{ uri: "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" }}
              style={{
                height: 120,
                width: 120,
                borderRadius: 85,
                borderWidth: 2,
                borderColor: COLORS.primary
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                zIndex: 9999
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
                value={userInfo.username}
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
                value={userInfo.email}
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
                value={userInfo.phoneNumber}
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
                value={userInfo.address}
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
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              ...FONTS.body3,
              color: COLORS.white
            }}
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfileScreen