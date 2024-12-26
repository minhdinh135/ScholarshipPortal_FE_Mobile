// import React, { useState, useEffect, useCallback } from 'react';
// import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
// import { Avatar, Bubble, GiftedChat } from 'react-native-gifted-chat';
// import { chatHistory, sendMessage } from '../../api/chatApi';
// import { COLORS, FONTS, icons } from '../../constants';
// import { useAuth } from '../../context/AuthContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { IconButton } from '../../components/Card';
// import messaging from '@react-native-firebase/messaging';

// const ChatScreen = ({ route, navigation }) => {
//   const { userInfo } = useAuth();
//   const { otherUserId } = route.params;
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchMessages = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await chatHistory(userInfo.id, otherUserId.id);
//       const formattedMessages = response.data.map((msg) => ({
//         _id: msg.id,
//         text: msg.message,
//         createdAt: new Date(msg.createdAt),
//         user: {
//           _id: msg.senderId,
//           name: msg.senderId == userInfo.id ? userInfo.username : otherUserId.username,
//           avatar: msg.senderId == userInfo.id ? userInfo.avatar : otherUserId.avatarUrl,
//         },
//       }));
//       setMessages(formattedMessages.reverse());
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [userInfo.id, otherUserId.id]);

//   useEffect(() => {
//     fetchMessages();
//   }, [fetchMessages]);

//   const onSend = useCallback(
//     async (newMessages = []) => {
//       const message = newMessages[0];
//       setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, [
//           {
//             ...message,
//             user: {
//               _id: userInfo.id,
//               name: userInfo.username,
//               avatar: userInfo.avatar,
//             },
//           },
//         ])
//       );

//       const messageData = {
//         senderId: userInfo.id,
//         receiverId: otherUserId.id,
//         message: message.text,
//         isRead: false,
//       };

//       try {
//         await sendMessage(messageData);
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     },
//     [userInfo, otherUserId]
//   );

//   // Listen for FCM notifications
//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
//       if (
//         remoteMessage.data.senderId == otherUserId.id &&
//         remoteMessage.data.receiverId == userInfo.id
//       ) {
//         const incomingMessage = {
//           _id: remoteMessage.messageId,
//           text: remoteMessage.data.message,
//           createdAt: new Date(),
//           user: {
//             _id: remoteMessage.data.senderId,
//             name: remoteMessage.data.senderId == userInfo.id ? userInfo.username : otherUserId.username,
//             avatar: remoteMessage.data.senderId == userInfo.id ? userInfo.avatar : otherUserId.avatar,
//           },
//         };
//         setMessages((previousMessages) =>
//           GiftedChat.append(previousMessages, [incomingMessage])
//         );
//       }
//     });

//     return unsubscribe;
//   }, [userInfo, otherUserId]);

//   const renderBubble = (props) => {
//     const isCurrentUser = String(props.currentMessage.user._id) === String(props.user._id);
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: styles.rightBubble,
//           left: styles.leftBubble,
//         }}
//         textStyle={{
//           right: styles.rightText,
//           left: styles.leftText,
//         }}
//         position={isCurrentUser ? "right" : "left"}
//       />
//     );
//   };

//   const renderAvatar = (props) => {
//     if (props.currentMessage.user._id !== Number(userInfo.id)) {
//       return <Avatar {...props} />;
//     }
//     return null;
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       ) : (
//         <SafeAreaView style={styles.container}>
//           <View style={styles.header}>
//             <IconButton
//               icon={icons.back}
//               iconStyle={styles.backIcon}
//               containerStyle={styles.backButton}
//               onPress={() => navigation.goBack()}
//             />
//             <Text style={{ ...FONTS.h2, marginLeft: 15 }}>{otherUserId.username}</Text>
//           </View>
//           <GiftedChat
//             messages={messages}
//             onSend={(newMessages) => onSend(newMessages)}
//             user={{
//               _id: userInfo.id,
//               name: userInfo.username,
//             }}
//             messagesContainerStyle={styles.messagesContainer}
//             renderBubble={renderBubble}
//             renderAvatar={renderAvatar}
//           />
//         </SafeAreaView>
//       )}
//     </View>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   header: {
//     backgroundColor: COLORS.white,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.gray20,
//   },
//   backButton: {
//     borderRadius: 25,
//     backgroundColor: COLORS.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 40,
//     height: 40,
//   },
//   backIcon: {
//     tintColor: COLORS.black,
//     width: 30,
//     height: 30,
//   },
//   messagesContainer: {
//     backgroundColor: COLORS.white,
//   },
//   rightBubble: {
//     backgroundColor: COLORS.primary,
//     padding: 10,
//     borderRadius: 20,
//     marginRight: 5,
//     marginBottom: 5,
//   },
//   leftBubble: {
//     backgroundColor: COLORS.gray10,
//     padding: 10,
//     borderRadius: 20,
//     marginLeft: 5,
//     marginBottom: 5,
//   },
//   rightText: {
//     color: COLORS.primary3,
//     fontSize: 14,
//   },
//   leftText: {
//     color: COLORS.black,
//     fontSize: 14,
//   },
// });

// import React, { useState, useEffect, useCallback } from 'react';
// import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
// import { Avatar, Bubble, Day, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
// import { chatHistory, sendMessage } from '../../api/chatApi';
// import { COLORS, FONTS, icons } from '../../constants';
// import { useAuth } from '../../context/AuthContext';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { IconButton } from '../../components/Card';
// import messaging from '@react-native-firebase/messaging';
// import { collection, addDoc, query, onSnapshot, orderBy } from "@react-native-firebase/firestore";

// const ChatScreen = ({ route, navigation }) => {
//   const { userInfo } = useAuth();
//   const { otherUserId } = route.params;
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isTyping, setIsTyping] = useState(false);

//   const fetchMessages = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await chatHistory(userInfo.id, otherUserId.id);
//       const formattedMessages = response.data.map((msg) => ({
//         _id: msg.id,
//         text: msg.message,
//         createdAt: new Date(msg.createdAt),
//         user: {
//           _id: msg.senderId,
//           name: msg.senderId === userInfo.id ? userInfo.username : otherUserId.username,
//           avatar: msg.senderId === userInfo.id ? userInfo.avatar : otherUserId.avatarUrl,
//         },
//       }));
//       setMessages(formattedMessages.reverse());
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [userInfo.id, otherUserId.id]);

//   useEffect(() => {
//     fetchMessages();
//   }, [fetchMessages]);

//   const onSend = useCallback(
//     async (newMessages = []) => {
//       const message = newMessages[0];
//       setMessages((previousMessages) =>
//         GiftedChat.append(previousMessages, [
//           {
//             ...message,
//             user: {
//               _id: userInfo.id,
//               name: userInfo.username,
//               avatar: userInfo.avatar,
//             },
//           },
//         ])
//       );

//       const messageData = {
//         senderId: userInfo.id,
//         receiverId: otherUserId.id,
//         message: message.text,
//         isRead: false,
//       };

//       try {
//         await sendMessage(messageData);
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     },
//     [userInfo, otherUserId]
//   );

//   useEffect(() => {
//     const handleIncomingMessage = (remoteMessage) => {
//       if (
//         remoteMessage.data.senderId === otherUserId.id &&
//         remoteMessage.data.receiverId === userInfo.id
//       ) {
//         const incomingMessage = {
//           _id: remoteMessage.messageId,
//           text: remoteMessage.data.message,
//           createdAt: new Date(),
//           user: {
//             _id: remoteMessage.data.senderId,
//             name: remoteMessage.data.senderId === userInfo.id ? userInfo.username : otherUserId.username,
//             avatar: remoteMessage.data.senderId === userInfo.id ? userInfo.avatar : otherUserId.avatar,
//           },
//         };
//         setMessages((previousMessages) =>
//           GiftedChat.append(previousMessages, [incomingMessage])
//         );
//       }
//     };

//     // Subscribe to onMessage
//     const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
//       handleIncomingMessage(remoteMessage);
//     });

//     // Set global background handler (no need to unsubscribe)
//     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//       handleIncomingMessage(remoteMessage);
//     });

//     // Cleanup only onMessage subscription
//     return () => {
//       unsubscribeOnMessage();
//     };
//   }, [userInfo, otherUserId]);

//   const renderBubble = (props) => {
//     const isCurrentUser = props.currentMessage.user._id == Number(userInfo.id);
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: [styles.rightBubble],
//           left: [styles.leftBubble],
//         }}
//         textStyle={{
//           right: [styles.rightText],
//           left: [styles.leftText],
//         }}
//         position={isCurrentUser ? 'right' : 'left'}
//       />
//     );
//   };

//   const renderAvatar = (props) => {
//     if (props.currentMessage.user._id !== Number(userInfo.id)) {
//       return (
//         <Avatar
//           {...props}
//           containerStyle={{ left: { marginRight: 0 } }}
//           onPressAvatar={() => console.log('Avatar pressed')}
//         />
//       );
//     }
//     return null;
//   };

//   const renderFooter = () => {
//     if (isTyping) {
//       return (
//         <View style={{ padding: 10 }}>
//           <Text style={{ fontStyle: 'italic', color: COLORS.gray }}>Typing...</Text>
//         </View>
//       );
//     }
//     return null;
//   };

//   const renderInputToolbar = (props) => (
//     <InputToolbar
//       {...props}
//       containerStyle={{
//         backgroundColor: COLORS.gray10,
//         borderRadius: 25,
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         margin: 10,
//       }}
//       primaryStyle={{ alignItems: 'center' }}
//     />
//   );

//   const renderDay = (props) => (
//     <Day
//       {...props}
//       textStyle={{
//         color: COLORS.gray,
//         fontSize: 12,
//         fontWeight: 'bold',
//       }}
//     />
//   );

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       ) : (
//         <SafeAreaView style={styles.container}>
//           <View style={styles.header}>
//             <IconButton
//               icon={icons.back}
//               iconStyle={styles.backIcon}
//               containerStyle={styles.backButton}
//               onPress={() => navigation.goBack()}
//             />
//             <Text style={{ ...FONTS.h2, marginLeft: 15 }}>{otherUserId.username}</Text>
//           </View>
//           <GiftedChat
//             messages={messages}
//             onSend={(newMessages) => onSend(newMessages)}
//             user={{
//               _id: userInfo.id,
//               name: userInfo.username,
//             }}
//             renderBubble={renderBubble}
//             renderAvatar={renderAvatar}
//             renderFooter={renderFooter}
//             renderInputToolbar={renderInputToolbar}
//             renderDay={renderDay}
//             messagesContainerStyle={styles.messagesContainer}
//           />
//         </SafeAreaView>
//       )}
//     </View>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   header: {
//     backgroundColor: COLORS.white,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.gray20,
//   },
//   backButton: {
//     borderRadius: 25,
//     backgroundColor: COLORS.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 40,
//     height: 40,
//   },
//   backIcon: {
//     tintColor: COLORS.black,
//     width: 30,
//     height: 30,
//   },
//   messagesContainer: {
//     backgroundColor: COLORS.white,
//   },
//   rightBubble: {
//     backgroundColor: COLORS.primary,
//     padding: 10,
//     borderRadius: 20,
//     marginRight: 5,
//     marginBottom: 5,
//   },
//   leftBubble: {
//     backgroundColor: COLORS.gray10,
//     padding: 8,
//     borderRadius: 20,
//     marginLeft: 5,
//     marginBottom: 3,
//   },
//   rightText: {
//     color: COLORS.primary3,
//     ...FONTS.body3,
//   },
//   leftText: {
//     color: COLORS.black,
//     ...FONTS.body3,
//   },
// });

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
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
  const [isTyping, setIsTyping] = useState(false);

  const chatCollection = firestore()
    .collection('chats')
    .doc(userInfo.id < otherUserId.id
      ? `${userInfo.id}_${otherUserId.id}`
      : `${otherUserId.id}_${userInfo.id}`)
    .collection('messages');

  const fetchMessages = useCallback(() => {
    setLoading(true);
    try {
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
          setMessages(fetchedMessages);
        });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chatCollection]);

  useEffect(() => {
    const unsubscribe = fetchMessages();
    return () => unsubscribe();
  }, [fetchMessages]);

  const onSend = useCallback(
    async (newMessages = []) => {
      const message = newMessages[0];
      const messageData = {
        ...message,
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
    },
    [chatCollection, userInfo]
  );

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      const { text, senderId, createdAt } = remoteMessage.data;
      if (senderId === otherUserId.id) {
        const incomingMessage = {
          _id: remoteMessage.messageId,
          text,
          createdAt: new Date(createdAt),
          user: {
            _id: senderId,
            name: otherUserId.username,
            avatar: otherUserId.avatarUrl,
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [incomingMessage])
        );
      }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      // Optional: handle background messages
    });

    return () => unsubscribeOnMessage();
  }, [otherUserId, userInfo]);

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

  const renderFooter = () => {
    if (isTyping) {
      return (
        <View style={{ padding: 10 }}>
          <Text style={{ fontStyle: 'italic', color: COLORS.gray }}>Typing...</Text>
        </View>
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
        <ActivityIndicator size="large" color={COLORS.primary} />
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
          <GiftedChat
            messages={messages}
            onSend={(newMessages) => onSend(newMessages)}
            user={{
              _id: userInfo.id,
              name: userInfo.username,
            }}
            renderBubble={renderBubble}
            renderAvatar={renderAvatar}
            renderFooter={renderFooter}
            renderInputToolbar={renderInputToolbar}
            renderDay={renderDay}
            messagesContainerStyle={styles.messagesContainer}
          />
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
