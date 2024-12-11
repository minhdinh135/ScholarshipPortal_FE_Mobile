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

// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { GiftedChat } from 'react-native-gifted-chat';
// import { requestUserPermission, onMessageListener } from '../../config/firebase';
// import { useAuth } from '../../context/AuthContext';

// const ChatScreen = ({ route }) => {
//   const { userInfo } = useAuth();
//   const userId = userInfo.id;
//   const { otherUserId } = route.params;

//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true); // State to handle loading indicator

//   // Fetch chat history
//   const loadChatHistory = async () => {
//     try {
//       const response = await fetch(`${process.env.BASE_URL}/api/chats/history`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, otherUserId }),
//       });
//       const data = await response.json();

//       // Check if there are messages and format them
//       const formattedMessages = data.messages && data.messages.length > 0
//         ? data.messages.map((msg) => ({
//           _id: msg.id,
//           text: msg.content,
//           createdAt: new Date(msg.timestamp),
//           user: {
//             _id: msg.senderId,
//             name: msg.senderName,
//           },
//         }))
//         : [];

//       setMessages(formattedMessages);
//       setLoading(false); // Data loaded, stop loading state
//     } catch (error) {
//       console.error('Error loading chat history:', error);
//       setLoading(false); // Stop loading in case of error
//     }
//   };

//   // Send message
//   const onSend = async (newMessages = []) => {
//     setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
//     const message = newMessages[0];

//     try {
//       await fetch(`${process.env.BASE_URL}/api/chats/send-message`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           senderId: userId,
//           receiverId: otherUserId,
//           message: message.text,
//         }),
//       });
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   // Fetch new messages periodically
//   const fetchNewMessages = async () => {
//     try {
//       const response = await fetch(`${process.env.BASE_URL}/api/chats/all-messages/${otherUserId}`);
//       const data = await response.json();

//       const formattedMessages = data.messages && data.messages.length > 0
//         ? data.messages.map((msg) => ({
//           _id: msg.id,
//           text: msg.content,
//           createdAt: new Date(msg.timestamp),
//           user: {
//             _id: msg.senderId,
//             name: msg.senderName,
//           },
//         }))
//         : [];

//       // Append only new messages that aren't already in the chat
//       setMessages((prevMessages) =>
//         GiftedChat.append(
//           prevMessages,
//           formattedMessages.filter(
//             (newMsg) => !prevMessages.some((prevMsg) => prevMsg._id === newMsg._id)
//           )
//         )
//       );
//     } catch (error) {
//       console.error('Error fetching new messages:', error);
//     }
//   };

//   // Initial setup
//   useEffect(() => {
//     requestUserPermission();
//     loadChatHistory();

//     const interval = setInterval(fetchNewMessages, 5000);

//     const unsubscribe = onMessageListener(() => {
//       fetchNewMessages();
//     });

//     return () => {
//       clearInterval(interval);
//       unsubscribe();
//     };
//   }, []);

//   // If loading, display a loading indicator
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         {/* You can replace this with a loading spinner or indicator */}
//         <GiftedChat messages={[]} user={{ _id: userId }} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <GiftedChat
//         messages={messages}
//         onSend={(newMessages) => onSend(newMessages)}
//         user={{ _id: userId }}
//         renderEmpty={() => (
//           <View style={styles.emptyMessageContainer}>
//             <Text style={styles.emptyMessageText}>Start your conversation</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   emptyMessageContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//   },
//   emptyMessageText: {
//     fontSize: 16,
//     color: '#999',
//   },
// });

// export default ChatScreen;
