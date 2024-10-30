import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { sendMessage, subscribeToMessages, createChatRoom } from '../../services/ChatService';
import { useAuth } from '../../context/AuthContext';

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
        avatar: 'https://placeimg.com/140/140/any', // Placeholder avatar
      },
    });
  }, [chatId]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: userInfo.id,
        name: userInfo.username,
      }}
    />
  );
};

export default ChatScreen;
