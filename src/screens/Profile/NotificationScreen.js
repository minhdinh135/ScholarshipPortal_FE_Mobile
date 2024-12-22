import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotification, markAsRead } from '../../api/notificationApi';
import { COLORS, SIZES, FONTS, images } from '../../constants';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const { userInfo } = useAuth();
  const navigation = useNavigation();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    getNotification(userInfo?.id)
      .then((res) => {
        const groupedNotifications = groupNotificationsByDate(res.data || []);
        setSections(groupedNotifications);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
    setRefreshing(false);
  };

  const groupNotificationsByDate = (notifications) => {
    const grouped = notifications.reduce((acc, notification) => {
      const dateKey = moment(notification.createdAt).format('MMMM DD, YYYY');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(notification);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => moment(b, 'MMMM DD, YYYY') - moment(a, 'MMMM DD, YYYY'))
      .map((date) => ({
        title: date,
        data: grouped[date],
      }));
  };

  const clearAllNotifications = () => {
    const allNotificationIds = sections
      .flatMap((section) => section.data)
      .map((notification) => notification.id);

    markAsRead(allNotificationIds)
      .then(() => {
        const updatedSections = sections.map((section) => ({
          ...section,
          data: section.data.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        }));
        setSections(updatedSections);
      })
      .catch((err) => {
        console.error('Failed to clear notifications:', err);
      });
  };

  const handleNotificationPress = (notification) => {
    markAsRead([notification.id])
      .then(() => {
        const updatedSections = sections.map((section) => ({
          ...section,
          data: section.data.map((notif) =>
            notif.id === notification.id ? { ...notif, isRead: true } : notif
          ),
        }));
        setSections(updatedSections);
      })
      .catch((err) => console.error('Failed to mark notification as read:', err));
    navigation.navigate('HomeTab');
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <View style={styles.notificationItem}>
        {!item.isRead && <View style={styles.unreadDot} />}
        <Text style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}>
          {item.message}
        </Text>
        <Text style={styles.notificationBody}>
          {moment(item.createdAt).format('h:mm A')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.screenTitle}>Notifications</Text>
        <TouchableOpacity onPress={clearAllNotifications}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={images.nothing_here}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
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
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  screenTitle: {
    ...FONTS.h1,
    color: COLORS.black,
    textAlign: 'center',
    paddingVertical: SIZES.padding * 0.5,
  },
  clearButtonText: {
    ...FONTS.body3,
    color: COLORS.gray30,
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
  sectionHeader: {
    ...FONTS.h2,
    color: COLORS.black,
    marginVertical: SIZES.base,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
  },
  notificationItem: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    marginVertical: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  notificationTitle: {
    ...FONTS.h3,
    color: COLORS.primary3,
    marginBottom: 5,
    paddingRight: 20,
  },
  notificationBody: {
    ...FONTS.body4,
    color: COLORS.gray70,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    right: 10,
    top: '80%',
    transform: [{ translateY: -5 }],
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
});
