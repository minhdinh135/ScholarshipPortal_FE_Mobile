import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Pressable,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { UserType } from '../UserContext';
import { jwtDecode } from "jwt-decode";
// import "core-js/stable/atob";
import axios from 'axios';
import { useUser } from '../UserContext';

export default function Example() {
  const { setIsLoggedIn } = useUser();
  const [users, setUsers] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const token = await AsyncStorage.getItem("authToken");
  //     const decodedToken = jwtDecode(token);
  //     setUserId(decodedToken.userId);

  //     await axios
  //       .get(`http://10.0.2.2:8000/user/${userId}`)
  //       .then((response) => {
  //         console.log("DATA: ", response);
  //         setUsers(response.data);
  //       })
  //       .catch((error) => {
  //         console.log("error retrieving users", error);
  //       });
  //   };

  //   fetchUsers();
  // }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          setUserId(userId);

          // Fetch user details dynamically based on userId
          const response = await axios.get(`http://10.0.2.2:8000/user/${userId}`);
          console.log("DATA: ", response.data);
          setUsers(response.data);
        } else {
          console.log("No token found.");
        }
      } catch (error) {
        console.log("Error retrieving user data", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
            <Pressable
              onPress={() => {
                // handle onPress
              }}>
              <FeatherIcon
                color="#000"
                name="more-vertical"
                size={24} />
            </Pressable>
          </View>
        </View> */}

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.section, { paddingTop: 4 }]}>
            <Text style={styles.sectionTitle}>Account</Text>

            <View style={styles.sectionBody}>
              <Pressable
                onPress={() => {
                  // handle onPress
                }}
                style={styles.profile}>
                <Image
                  alt=""
                  source={{
                    uri: users.image
                  }}
                  style={styles.profileAvatar} />

                <View style={styles.profileBody}>
                  <Text style={styles.profileName}>{users.name}</Text>

                  <Text style={styles.profileHandle}>
                    {users.email}
                  </Text>
                </View>

                <FeatherIcon
                  color="#bcbcbc"
                  name="chevron-right"
                  size={22} />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Section 1</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <Pressable
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <AntDesign style={{ marginRight: "8px", color: "#243666" }} name="profile" size={20} color="black" />
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
                    // handle onPress
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px", color: "#243666" }} name="notifications-outline" size={20} color="black" />
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
                  <Ionicons style={{ marginRight: "8px", color: "#243666" }} name="language" size={20} color="black" />
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
            <Text style={styles.sectionTitle}>Section 2</Text>
            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <View style={styles.row}>
                  <Entypo style={{ marginRight: "8px", color: "#243666" }} name="block" size={20} color="black" />
                  <Text style={styles.rowLabel}>Block Ads</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={emailNotifications =>
                      setForm({ ...form, emailNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.emailNotifications}
                  />
                </View>
              </View>

              <View style={[styles.rowWrapper, styles.rowLast]}>
                <View style={styles.row}>
                  <Feather style={{ marginRight: "8px", color: "#243666" }} name="moon" size={20} color="black" />
                  <Text style={styles.rowLabel}>Dark Mode</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={pushNotifications =>
                      setForm({ ...form, pushNotifications })
                    }
                    style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                    value={form.pushNotifications} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Section 3</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <Pressable
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <Ionicons style={{ marginRight: "8px", color: "#243666" }} name="help-circle-outline" size={24} color="black" />
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
                  <AntDesign style={{ marginRight: "8px", color: "#243666" }} name="contacts" size={22} color="black" />
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
                  <Ionicons style={{ marginRight: "8px", color: "#243666" }} name="shield-checkmark-outline" size={20} color="black" />
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
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <Text onPress={handleLogout} style={[styles.rowLabel, styles.rowLabelLogout]}>
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

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
  },
  /** Content */
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
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Profile */
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
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: 'auto',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292929',
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '400',
    color: '#858585',
  },
  /** Row */
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
    fontSize: 16,
    letterSpacing: 0.24,
    color: '#243666',
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
    fontWeight: '600',
    color: '#dc2626',
  },
});