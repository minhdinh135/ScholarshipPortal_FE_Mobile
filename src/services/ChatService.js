// import { db } from '../config/firebase';
// import { collection, addDoc, doc, setDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

// export const createChatRoom = async (chatId) => {
//   const chatRef = doc(db, 'chats', chatId);
//   await setDoc(chatRef, { createdAt: serverTimestamp() });
// };

// export const sendMessage = async (chatId, message) => {
//   const messagesRef = collection(db, 'chats', chatId, 'messages');
//   await addDoc(messagesRef, {
//     ...message,
//     createdAt: serverTimestamp()
//   });
// };

// export const subscribeToMessages = (chatId, callback) => {
//   const messagesRef = collection(db, 'chats', chatId, 'messages');
//   const q = query(messagesRef, orderBy('createdAt', 'desc'));

//   return onSnapshot(q, (snapshot) => {
//     const messages = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         _id: doc.id,
//         ...data,
//         createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
//       };
//     });
//     callback(messages);
//   });
// };
