import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, KeyboardAvoidingView } from 'react-native';
import { Avatar, Bubble, Day, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '../../components/Card';
import { COLORS, FONTS, icons } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const ChatScreen = ({ route, navigation }) => {
  const { userInfo } = useAuth();
  const { otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const chatCollection = useMemo(() =>
    firestore()
      .collection('chats')
      .doc(userInfo.id < otherUserId.id
        ? `${userInfo.id}_${otherUserId.id}`
        : `${otherUserId.id}_${userInfo.id}`)
      .collection('messages'),
    [userInfo.id, otherUserId.id]
  );

  useEffect(() => {
    const unsubscribe = chatCollection
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const fetchedMessages = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            user: {
              _id: data.user._id,
              name: data.user.name,
              avatar: data.user.avatar,
            },
          };
        });

        setMessages((prev) => {
          const existingIds = new Set(prev.map((msg) => msg._id));
          const newMessages = fetchedMessages.filter((msg) => !existingIds.has(msg._id));
          return GiftedChat.append(prev, newMessages);
        });

        setLoading(false);
      });

    return () => unsubscribe();
  }, [chatCollection]);

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    const messageData = {
      ...message,
      _id: chatCollection.doc().id,
      createdAt: firestore.FieldValue.serverTimestamp(),
      user: {
        _id: userInfo.id,
        name: userInfo.username,
        avatar: userInfo.avatar,
      },
    };
    try {
      await chatCollection.add(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [chatCollection, userInfo]);

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      const { text, senderId, createdAt } = remoteMessage.data;
      if (senderId === otherUserId.id) {
        const incomingMessage = {
          _id: remoteMessage.messageId || `${remoteMessage.messageId}_${Date.now()}`,
          text,
          createdAt: new Date(createdAt),
          user: {
            _id: senderId,
            name: otherUserId.username,
            avatar: otherUserId.avatarUrl,
          },
        };

        setMessages((prev) => {
          const existingIds = new Set(prev.map((msg) => msg._id));
          if (!existingIds.has(incomingMessage._id)) {
            return GiftedChat.append(prev, [incomingMessage]);
          }
          return prev;
        });
      }
    });

    return () => unsubscribeOnMessage();
  }, [otherUserId.id, otherUserId.username, otherUserId.avatarUrl]);

  const renderBubble = (props) => {
    const isCurrentUser = props.currentMessage.user._id === userInfo.id;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: styles.rightBubble,
          left: styles.leftBubble,
        }}
        textStyle={{
          right: styles.rightText,
          left: styles.leftText,
        }}
        position={isCurrentUser ? 'right' : 'left'}
      />
    );
  };

  const renderAvatar = (props) => {
    if (props.currentMessage.user._id !== userInfo.id) {
      return (
        <Avatar
          {...props}
          containerStyle={{ left: { marginRight: 0 } }}
          onPressAvatar={() => console.log('Avatar pressed')}
        />
      );
    }
    return null;
  };

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: COLORS.gray10,
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 10,
      }}
      primaryStyle={{ alignItems: 'center' }}
    />
  );

  const renderDay = (props) => (
    <Day
      {...props}
      textStyle={{
        color: COLORS.gray,
        fontSize: 12,
        fontWeight: 'bold',
      }}
    />
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <IconButton
              icon={icons.back}
              iconStyle={styles.backIcon}
              containerStyle={styles.backButton}
              onPress={() => navigation.goBack()}
            />
            <Text style={{ ...FONTS.h2, marginLeft: 15 }}>{otherUserId.username}</Text>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
          >
            <GiftedChat
              messages={messages}
              onSend={(newMessages) => onSend(newMessages)}
              user={{
                _id: userInfo.id,
                name: userInfo.username,
              }}
              renderBubble={renderBubble}
              renderAvatar={renderAvatar}
              renderInputToolbar={renderInputToolbar}
              renderDay={renderDay}
              messagesContainerStyle={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray20,
  },
  backButton: {
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  backIcon: {
    tintColor: COLORS.black,
    width: 30,
    height: 30,
  },
  messagesContainer: {
    backgroundColor: COLORS.white,
  },
  rightBubble: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 5,
  },
  leftBubble: {
    backgroundColor: COLORS.gray10,
    padding: 8,
    borderRadius: 20,
    marginLeft: 5,
    marginBottom: 3,
  },
  rightText: {
    color: COLORS.primary3,
    ...FONTS.body3,
  },
  leftText: {
    color: COLORS.black,
    ...FONTS.body3,
  },
});