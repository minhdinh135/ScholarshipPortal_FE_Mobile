import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { getAccounts } from '../../api/accountApi';
import { COLORS, FONTS, icons, SIZES } from '../../constants';
import { IconButton } from '../../components/Card';

const ChatBoxScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      await getAccounts().then((res) => setUsers(res));
    } catch (error) {
      console.log('Error fetching users: ', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate("ChatScreen", { otherUserId: item })}
    >
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userStatus}>{item.status || 'Available'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={icons.back}
          iconStyle={{
            tintColor: COLORS.black,
          }}
          containerStyle={styles.iconButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Chat Service</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.base,
    backgroundColor: COLORS.white,
  },
  header: {
    marginHorizontal: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 40,
    ...FONTS.h2,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    ...FONTS.body3,
    color: COLORS.gray,
  },
  list: {
    paddingVertical: SIZES.base,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...FONTS.h4,
    color: COLORS.black,
  },
  userStatus: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
});

export default ChatBoxScreen;
