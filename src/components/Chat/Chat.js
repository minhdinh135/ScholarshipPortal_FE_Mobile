import React, { useState, useEffect, useCallback } from 'react';
import { Bubble, GiftedChat, Avatar } from 'react-native-gifted-chat';
import { sendMessage, subscribeToMessages, createChatRoom } from '../../services/ChatService';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants';
import { Text, View } from 'react-native';

const ChatScreen = ({ route }) => {
  const { userInfo } = useAuth();
  const { otherUserId } = route.params; // Passed from user selection screen
  const [messages, setMessages] = useState([]);

  const chatId = [userInfo.id, otherUserId].sort().join('_'); // Unique chat room ID

  useEffect(() => {
    createChatRoom(chatId); // Ensure chat room exists
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
        right: {
          backgroundColor: COLORS.primary, // Customize right bubble color
          padding: 5,
          borderRadius: 15,
        },
        left: {
          backgroundColor: COLORS.gray10, // Customize left bubble color
          padding: 5,
          borderRadius: 15,
        },
      }}
      textStyle={{
        right: {
          color: COLORS.primary3, // Customize text color for right bubbles
        },
        left: {
          color: COLORS.black, // Customize text color for left bubbles
        },
      }}
    />
  );

  const renderAvatar = (props) => {
    // Show avatar only for messages from the other user (left side)
    if (props.currentMessage.user._id !== userInfo.id) {
      return <Avatar {...props} />;
    }
    return null; // Hide avatar for messages from the current user
  };

  return (
    <View style={{ flex: 1, marginBottom: 50 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userInfo.id,
          name: userInfo.username,
        }}
        messagesContainerStyle={{
          backgroundColor: COLORS.white
        }}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
      />
    </View>
  );
};

export default ChatScreen;
