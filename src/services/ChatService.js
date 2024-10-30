import { db } from '../config/firebase';
import { collection, addDoc, doc, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export const createChatRoom = async (chatId) => {
  const chatRef = doc(db, 'chats', chatId); // Correctly references a document in Firestore
  await setDoc(chatRef, { createdAt: new Date() });
};

export const sendMessage = async (chatId, message) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages'); // Correctly references sub-collection
  await addDoc(messagesRef, {
    ...message,
    createdAt: new Date()
  });
};

export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};
