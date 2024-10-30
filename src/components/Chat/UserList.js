import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { getAccounts } from '../../api/accountApi';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      // const userCollection = collection(db, 'users');
      // const userSnapshot = await getDocs(userCollection);
      // setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      getAccounts().then((res) => setUsers(res))
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User List</Text>
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
    backgroundColor: '#f7f9fc',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
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
