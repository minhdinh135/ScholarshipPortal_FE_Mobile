import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotification } from '../../api/notificationApi';
import { COLORS, SIZES, FONTS } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';

const NotificationScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotification(userInfo?.id)
      .then((res) => {
        setNotifications(res.data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent().setOptions({ tabBarStyle: { display: 'none' } });
      return () =>
        navigation.getParent().setOptions({
          tabBarStyle: { display: 'flex' },
        });
    }, [navigation])
  );

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Notifications</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/webdevcody/thumbnail-critique/22e8204eab91855ea5069e876b294ba5d2706200/public/void.png' }}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: SIZES.padding,
  },
  screenTitle: {
    ...FONTS.h2,
    color: COLORS.black,
    textAlign: 'center',
    paddingVertical: SIZES.padding * 0.5
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
  },
  emptyImage: {
    width: SIZES.width * 0.7,
    height: SIZES.height * 0.7,
    marginVertical: -120,
  },
  emptyText: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: 'center',
    padding: SIZES.padding,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
  },
  notificationItem: {
    backgroundColor: COLORS.gray10,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginVertical: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  notificationTitle: {
    ...FONTS.h3,
    color: COLORS.primary3,
    marginBottom: 5,
  },
  notificationBody: {
    ...FONTS.body4,
    color: COLORS.gray70,
  },
});
