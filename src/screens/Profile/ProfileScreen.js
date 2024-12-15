import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Pressable,
  Image,
  ImageBackground,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, SIZES, images } from '../../constants';

const SettingsScreen = ({ navigation }) => {
  const { signOut, userInfo } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ImageBackground
            source={images.bg_1}
            style={styles.headerBackground}
            imageStyle={styles.headerImage}
          >
            <View style={styles.profileSection}>
              <Image
                src={userInfo.avatar}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userInfo.username}</Text>
                <Text style={styles.profileHandle}>{userInfo.email}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <Pressable
                  onPress={() => {
                    navigation.navigate("EditProfileScreen")
                  }}
                  style={styles.row}
                >
                  <Ionicons style={{ marginRight: "8px" }} name="person-circle-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Edit Profile</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>

              <View style={styles.rowWrapper}>
                <Pressable
                  onPress={() => {
                    navigation.navigate("ChangePasswordScreen")
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="shield-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Change Password</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>

              <View style={styles.rowWrapper}>
                <Pressable
                  onPress={() => {
                    //
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="notifications-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Notifications</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>ON</Text>
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>

              <View style={[styles.rowWrapper, styles.rowLast]}>
                <Pressable
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="language" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Language</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>English</Text>
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extensions</Text>
            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <Pressable
                  onPress={() => {
                    navigation.navigate("ApplicationHistoryScreen")
                  }}
                  style={styles.row}
                >
                  <Ionicons style={{ marginRight: "8px" }} name="document-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Application History</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>

              <View style={styles.rowWrapper}>
                <Pressable
                  onPress={() => {
                    navigation.navigate("ServiceHistoryScreen")
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="people-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Service History</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>

              <View style={styles.rowWrapper}>
                <Pressable
                  onPress={() => {
                    navigation.navigate("WalletScreen")
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="wallet-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>My Wallet</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>

              <View style={[styles.rowWrapper, styles.rowLast]}>
                <Pressable
                  onPress={() => {
                    navigation.navigate("BankScreen")
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="card-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Bank Information</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <Pressable
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="help-buoy-outline" size={24} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Help & Support</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>

              <View style={styles.rowWrapper}>
                <Pressable
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="call-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Contact Us</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>

              <View style={[styles.rowWrapper, styles.rowLast]}>
                <Pressable
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px" }} name="shield-checkmark-outline" size={20} color={COLORS.primary3} />
                  <Text style={styles.rowLabel}>Privacy Policy</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#bcbcbc"
                    name="chevron-right"
                    size={19} />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionBody}>
              <View
                style={[
                  styles.rowWrapper,
                  styles.rowFirst,
                  styles.rowLast,
                  { alignItems: 'center' },
                ]}>
                <Pressable
                  onPress={signOut}
                  style={styles.row}>
                  <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                    Log Out
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
          <Text style={styles.contentFooter}>App Version 2.24 #50491</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  headerBackground: {
    width: '100%',
    height: 130,
    justifyContent: 'center',
  },
  headerImage: {
    resizeMode: 'cover',
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding,
    marginTop: 10
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderColor: COLORS.white,
    borderWidth: 3
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  profileHandle: {
    ...FONTS.body3,
    color: COLORS.gray70,
    marginTop: 4,
  },
  verifiedBadge: {
    marginTop: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  verifiedText: {
    ...FONTS.body5,
    color: COLORS.white,
  },
  changeBackgroundButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: COLORS.additionalColor11,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  changeBackgroundText: {
    ...FONTS.body4,
    color: COLORS.primary3,
  },
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#a69f9f',
  },
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    ...FONTS.h3,
    letterSpacing: 0.33,
    color: COLORS.gray40,
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 3,
  },
  profile: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 12,
  },
  profileBody: {
    marginRight: 'auto',
  },
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    letterSpacing: 0.24,
    marginLeft: 8,
    color: COLORS.primary3,
    ...FONTS.body3
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00c0c1',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: '100%',
    textAlign: 'center',
    ...FONTS.h3,
    color: 'red',
  },
});
