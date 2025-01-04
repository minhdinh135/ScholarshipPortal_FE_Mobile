import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, icons, SIZES } from '../../constants';
import { reviewResultApplication } from '../../api/applicationApi';
import { getScholarProgramById } from '../../api/scholarshipProgramApi';
import moment from 'moment';
import { IconButton } from '../../components/Card';

const DetailsScreen = ({ route, navigation }) => {
  const { application: initialApplication, applicationType } = route.params;
  const [application, setApplication] = useState(initialApplication);
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewScore, setReviewScore] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);

  useEffect(() => {
    const fetchScholarship = async () => {
      setLoading(true);
      try {
        const res = await getScholarProgramById(application.scholarshipProgramId);
        setScholarship(res.data || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [application.scholarshipProgramId]);

  useEffect(() => {
    const checkIfReviewed = () => {
      const reviewIndex = applicationType === 1 ? 0 : 1;
      const review = application.applicationReviews[reviewIndex];

      if (review && review.comment && review.score) {
        setIsReviewed(true);
      }
    };

    checkIfReviewed();
  }, [application.applicationReviews, applicationType]);

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />;
      case 'Reviewing':
        return <Ionicons name="hourglass" size={24} color={COLORS.warning} />;
      case 'Rejected':
        return <Ionicons name="close-circle" size={24} color={COLORS.secondary} />;
      default:
        return null;
    }
  };

  const handleReviewSubmit = async () => {
    if (reviewText.trim().length === 0 || reviewScore.trim().length === 0) {
      Alert.alert('Review Required', 'Please provide both a review and a score before proceeding.');
      return;
    }

    const score = parseFloat(reviewScore);
    if (isNaN(score) || score < 1 || score > 100) {
      Alert.alert('Invalid Score', 'Please enter a valid score between 1 and 100.');
      return;
    }

    const reviewIndex = applicationType === 1 ? 0 : 1;
    const selectedReviewId = application.applicationReviews[reviewIndex]?.id;

    if (!selectedReviewId) {
      Alert.alert('No Review Available', 'The selected application does not have a review to update.');
      return;
    }

    const updatedReview = {
      applicationReviewId: selectedReviewId,
      comment: reviewText,
      isPassed: score >= 50 ? true : false,
      score,
    };

    try {
      setLoading(true);
      await reviewResultApplication(updatedReview);
      const updatedReviews = application.applicationReviews.map((review, index) =>
        index === reviewIndex
          ? { ...review, comment: reviewText, score, reviewDate: new Date().toISOString() }
          : review
      );
      setApplication((prev) => ({
        ...prev,
        applicationReviews: updatedReviews,
      }));
      setReviewText('');
      setReviewScore('');
      setIsReviewed(true);
      Alert.alert('Review Submitted', 'Your review has been submitted. You can now approve or reject the application.');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'There was an error submitting the review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View
            style={{
              margin: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <IconButton
              icon={icons.back}
              iconStyle={{
                width: 25,
                height: 25,
                tintColor: COLORS.black
              }}
              containerStyle={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: COLORS.white
              }}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.screenTitle}>Application Details</Text>
          </View>
          <Text style={styles.title}>{application.applicantName}</Text>
          <View style={styles.statusContainer}>
            {renderStatusIcon(application.status)}
            <Text
              style={[
                styles.statusText,
                application.status === 'Approved' ? styles.statusApprovedText :
                  application.status === 'Reviewing' ? styles.statusPendingText :
                    styles.statusDisapprovedText
              ]}
            >
              {application.status}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Details</Text>
          <Text style={styles.infoText}>Scholarship Program: {scholarship?.name}</Text>
          <Text style={styles.infoText}>University: {scholarship?.university?.name}</Text>
          <Text style={styles.infoText}>Applied on: {moment(application.appliedDate).format("MMM DD, YYYY")}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {application.applicationDocuments.length > 0 ? (
            application.applicationDocuments.map((doc, index) => (
              <TouchableOpacity
                key={doc.id}
                onPress={() => {
                  Linking.openURL(doc.fileUrl).catch((err) =>
                    Alert.alert('Error', 'Unable to open document.')
                  );
                }}
                style={styles.documentContainer}
              >
                <Ionicons name="document-text" size={20} color={COLORS.primary} />
                <Text style={styles.documentLinkText}>{doc.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.infoText}>No documents submitted.</Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {application.applicationReviews.length > 0 ? (
            application.applicationReviews.map((review) => (
              <View key={review.id} style={styles.reviewContainer}>
                <Text style={styles.reviewDescription}>
                  {`Comment:`} <Text style={{ fontStyle: 'italic' }}>{review.comment || 'No comments provided.'}</Text>
                </Text>
                <Text style={styles.infoText}>
                  {`Score: ${review.score || 'N/A'} | Date: ${moment(review.reviewDate).format("MMM DD, YYYY") ? new Date(review.reviewDate).toLocaleDateString() : 'N/A'}`}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.infoText}>No reviews available.</Text>
          )}
        </View>
        {isReviewed ? (
          <View style={styles.section}>
            <Text style={styles.infoText}>This application has been reviewed.</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Review</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your review here..."
              value={reviewText}
              onChangeText={setReviewText}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter a score (0-100)"
              value={reviewScore}
              onChangeText={setReviewScore}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.base * 4,
  },
  section: {
    marginBottom: SIZES.base * 3,
  },
  screenTitle: {
    ...FONTS.h1,
    color: COLORS.black,
    marginLeft: 20,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
    marginTop: 30,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  statusText: {
    ...FONTS.body2,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginLeft: SIZES.base,
  },
  statusApprovedText: { color: COLORS.primary },
  statusPendingText: { color: COLORS.warning },
  statusDisapprovedText: { color: COLORS.secondary },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.gray70,
    marginBottom: SIZES.base,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  documentLinkText: {
    ...FONTS.body3,
    color: COLORS.primary,
    textDecorationLine: 'underline',
    marginLeft: SIZES.base,
  },
  documentText: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginLeft: SIZES.base,
  },
  reviewContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray30,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewDescription: {
    ...FONTS.body3,
    color: COLORS.gray90,
    marginBottom: SIZES.base / 2,
    fontWeight: 'bold',
  },
  infoText: {
    ...FONTS.body3,
    color: COLORS.gray80,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray30,
    backgroundColor: COLORS.white,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    flex: 0.45,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    flex: 0.45,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    ...FONTS.body2,
    fontWeight: 'bold',
  },
  handledMessage: {
    color: COLORS.gray50,
    ...FONTS.body3,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray30,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    marginBottom: SIZES.base,
    ...FONTS.body3,
    color: COLORS.gray80,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    ...FONTS.body2,
    fontWeight: 'bold',
  },
  selectedReview: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
});
