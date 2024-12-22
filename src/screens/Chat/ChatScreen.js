import React, { useState, useEffect, useCallback } from 'react';
import { Bubble, GiftedChat, Avatar } from 'react-native-gifted-chat';
import { sendMessage, subscribeToMessages, createChatRoom } from '../../services/ChatService';
import { useAuth } from '../../context/AuthContext';
import { COLORS, FONTS, icons } from '../../constants';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '../../components/Card';

const ChatScreen = ({ route, navigation }) => {
  const { userInfo } = useAuth();
  const { otherUserId } = route.params;
  const [messages, setMessages] = useState([]);

  const chatId = [userInfo.id, otherUserId.id].sort().join('_');

  useEffect(() => {
    createChatRoom(chatId);
    const unsubscribe = subscribeToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback((messages = []) => {
    const [message] = messages;
    sendMessage(chatId, {
      ...message,
      user: {
        _id: userInfo.id,
        name: userInfo.username,
        avatar: 'https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj', // Placeholder avatar
      },
    });
  }, [chatId]);

  const renderBubble = (props) => (
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
    />
  );

  const renderAvatar = (props) => {
    if (props.currentMessage.user._id !== userInfo.id) {
      return <Avatar {...props} />;
    }
    return null;
  };

  return (
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
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userInfo.id,
          name: userInfo.username,
        }}
        messagesContainerStyle={styles.messagesContainer}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
      />

    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
    marginBottom: 5,
  },
  rightText: {
    color: COLORS.primary3,
    fontSize: 14,
  },
  leftText: {
    color: COLORS.black,
    fontSize: 14,
  },
});
