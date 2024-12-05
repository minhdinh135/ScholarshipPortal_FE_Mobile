import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, FONTS } from '../../constants';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    if (!rating) {
      Alert.alert('Error', 'Please select a rating.');
      return;
    }
    if (!comment) {
      Alert.alert('Error', 'Please enter a comment.');
      return;
    }
    Alert.alert('Thank You!', 'Your feedback has been submitted.');
    setRating(0);
    setComment('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>We Value Your Feedback</Text>
      <Text style={styles.subtitle}>
        Please rate your experience and leave a comment below.
      </Text>

      <View style={styles.ratingContainer}>
        <Text style={styles.sectionTitle}>Rate Us</Text>
        <View style={styles.stars}>
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

      <View style={styles.commentContainer}>
        <Text style={styles.sectionTitle}>Your Comments</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Write your comments here..."
          placeholderTextColor={COLORS.gray60}
          multiline
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Feedback</Text>
      </TouchableOpacity>
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
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray60,
    textAlign: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  ratingContainer: {
    marginBottom: SIZES.padding * 1.5,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starIcon: {
    marginHorizontal: SIZES.base,
  },
  commentContainer: {
    marginBottom: SIZES.padding * 1.5,
  },
  textInput: {
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
  },
  submitButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
});

export default Feedback;
