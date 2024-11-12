import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAccounts } from '../../api/accountApi';
import { COLORS, FONTS, SIZES } from '../../constants';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      getAccounts().then((res) => setUsers(res))
    };
    fetchUsers();
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

  function renderHeader() {
    return (
      <View
        style={{
          marginTop: 40,
          marginBottom: 10,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flex: 1
          }}
        >
          Chat
        </View>
      </View>
    )
  }

  function renderList() {
    return (
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigation.navigate('ChatScreen', { otherUserId: item.id })}>
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    )
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>User List</Text> */}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigation.navigate('ChatScreen', { otherUserId: item.id })}>
            <Text style={styles.username}>{item.username}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.white
  },
  title: {
    marginVertical: 16,
    textAlign: 'center',
    ...FONTS.h2
  },
  listContainer: {
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  username: {
    fontSize: 18,
    color: '#555',
  },
});

export default UserListScreen;
