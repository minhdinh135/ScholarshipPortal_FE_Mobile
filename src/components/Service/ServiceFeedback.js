import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, SIZES } from '../../constants';

const ServiceFeedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);

  const handleRating = (rate) => setRating(rate);

  const handleSubmit = () => {
    if (!rating || !comment) {
      Alert.alert('Error', 'Please select a rating and add a comment.');
      return;
    }

    const feedback = {
      rating,
      comment,
      user: 'You',
    };

    setFeedbackList((prev) => [...prev, feedback]);
    setRating(0);
    setComment('');
    Alert.alert('Thank You!', 'Your feedback has been submitted.');
  };

  const renderFeedback = ({ item }) => (
    <View style={styles.feedbackCard}>
      <Text style={styles.feedbackUser}>Emma</Text>
      <View style={styles.feedbackRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= item.rating ? 'star' : 'star-outline'}
            size={20}
            color={COLORS.primary}
          />
        ))}
      </View>
      <Text style={styles.feedbackComment}>{item.comment}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {feedbackList.length > 0 ? (
        <FlatList
          data={feedbackList}
          renderItem={renderFeedback}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noFeedbackText}>Please rate and leave your feedback.</Text>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rate Us</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <Icon
                name={star <= rating ? 'star' : 'star-outline'}
                size={30}
                color={COLORS.primary}
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Comments</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Write your comments here..."
          placeholderTextColor={COLORS.gray60}
          multiline
          value={comment}
          onChangeText={setComment}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  contentContainer: {
    paddingBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
  },
  starIcon: {
    marginHorizontal: SIZES.base / 2,
  },
  feedbackCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: SIZES.base,
    marginBottom: SIZES.base,
  },
  feedbackUser: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  feedbackRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  feedbackComment: {
    ...FONTS.body3,
    color: COLORS.gray80,
  },
  noFeedbackText: {
    ...FONTS.h3,
    color: COLORS.gray60,
    textAlign: 'center',
    marginTop: SIZES.padding * 2,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.gray40,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    textAlignVertical: 'top',
    height: 100,
    ...FONTS.body3,
    color: COLORS.black,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.padding * 2,
  },
  submitButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  listContent: {
    marginVertical: SIZES.base,
  },
});

export default ServiceFeedback;
