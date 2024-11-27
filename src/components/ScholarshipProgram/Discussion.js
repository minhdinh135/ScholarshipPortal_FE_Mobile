import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Replace with your icon library if necessary.
import { COLORS, SIZES, FONTS } from '../../constants'; // Replace with your constants or use custom styles.

const Discussion = () => {
  const [comments, setComments] = useState([
    { id: '1', user: 'John Doe', comment: 'This scholarship sounds amazing!', replies: [] },
    { id: '2', user: 'Jane Smith', comment: 'Does anyone know the application deadline?', replies: [] },
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    if (!newComment) {
      Alert.alert('Error', 'Please enter a comment.');
      return;
    }
    setComments([
      ...comments,
      { id: Date.now().toString(), user: 'You', comment: newComment, replies: [] },
    ]);
    setNewComment('');
  };

  const handleAddReply = (id) => {
    if (!replyText) {
      Alert.alert('Error', 'Please enter a reply.');
      return;
    }
    setComments((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, replies: [...item.replies, { user: 'You', comment: replyText }] }
          : item
      )
    );
    setReplyingTo(null);
    setReplyText('');
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentUser}>{item.user}</Text>
      <Text style={styles.commentText}>{item.comment}</Text>

      {/* Reply Button */}
      <TouchableOpacity
        style={styles.replyButton}
        onPress={() => setReplyingTo(item.id)}
      >
        <Icon name="chatbox-outline" size={20} color={COLORS.primary} />
        <Text style={styles.replyButtonText}>Reply</Text>
      </TouchableOpacity>

      {/* Replies */}
      {item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.replies.map((reply, index) => (
            <View key={index} style={styles.reply}>
              <Text style={styles.replyUser}>{reply.user}</Text>
              <Text style={styles.replyText}>{reply.comment}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Reply Input */}
      {replyingTo === item.id && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write a reply..."
            placeholderTextColor={COLORS.gray60}
            value={replyText}
            onChangeText={(text) => setReplyText(text)}
          />
          <TouchableOpacity
            style={styles.sendReplyButton}
            onPress={() => handleAddReply(item.id)}
          >
            <Icon name="send-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discussion Board</Text>

      {/* Comments List */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* New Comment Input */}
      <View style={styles.newCommentContainer}>
        <TextInput
          style={styles.newCommentInput}
          placeholder="Start a discussion..."
          placeholderTextColor={COLORS.gray60}
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />
        <TouchableOpacity
          style={styles.addCommentButton}
          onPress={handleAddComment}
        >
          <Icon name="send-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  listContent: {
    paddingBottom: SIZES.padding * 2,
  },
  commentContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  commentUser: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  commentText: {
    ...FONTS.body3,
    color: COLORS.gray80,
    marginBottom: SIZES.base,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginLeft: SIZES.base / 2,
  },
  repliesContainer: {
    marginTop: SIZES.base,
    marginLeft: SIZES.padding,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.gray40,
    paddingLeft: SIZES.base,
  },
  reply: {
    marginBottom: SIZES.base,
  },
  replyUser: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  replyText: {
    ...FONTS.body3,
    color: COLORS.gray80,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray40,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 2,
    color: COLORS.black,
    ...FONTS.body3,
  },
  sendReplyButton: {
    marginLeft: SIZES.base,
    backgroundColor: COLORS.primary,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
  },
  newCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.gray20,
    paddingTop: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  newCommentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray40,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    color: COLORS.black,
    ...FONTS.body3,
  },
  addCommentButton: {
    marginLeft: SIZES.base,
    backgroundColor: COLORS.primary,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
  },
});

export default Discussion;
