import React, { useState, useEffect, useCallback } from 'react';
import { Bubble, GiftedChat, Avatar } from 'react-native-gifted-chat';
import { sendMessage, subscribeToMessages, createChatRoom } from '../../services/ChatService';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants';
import { View } from 'react-native';

const ChatScreen = ({ route }) => {
  const { userInfo } = useAuth();
  const { otherUserId } = route.params;
  const [messages, setMessages] = useState([]);

  const chatId = [userInfo.id, otherUserId].sort().join('_');

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
        right: {
          backgroundColor: COLORS.primary,
          padding: 5,
          borderRadius: 15,
        },
        left: {
          backgroundColor: COLORS.gray10,
          padding: 5,
          borderRadius: 15,
        },
      }}
      textStyle={{
        right: {
          color: COLORS.primary3,
        },
        left: {
          color: COLORS.black,
        },
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
