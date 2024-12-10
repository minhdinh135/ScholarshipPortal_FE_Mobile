import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants';
import { reviewResultApplication, updateApplication } from '../../api/applicationApi';
import { getScholarProgramById } from '../../api/scholarshipProgramApi';

const DetailsScreen = ({ route }) => {
  const { application: initialApplication } = route.params;
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

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />;
      case 'Submitted':
        return <Ionicons name="hourglass" size={24} color={COLORS.gray50} />;
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
    if (isNaN(score) || score < 1 || score > 10) {
      Alert.alert('Invalid Score', 'Please enter a valid score between 1 and 10.');
      return;
    }

    const updatedReview = {
      applicationReviewId: application.applicationReviews[0].id,
      comment: reviewText,
      isPassed: true,
      score,
      isFirstReview: false,
    };

    try {
      setLoading(true);
      await reviewResultApplication(updatedReview);
      const updatedReviews = application.applicationReviews.map((review) =>
        review.id === updatedReview.applicationReviewId
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

  const updateStatus = async (newStatus) => {
    if (!isReviewed) {
      Alert.alert('Action Blocked', 'You must submit your review before approving or rejecting the application.');
      return;
    }

    setLoading(true);
    try {
      await updateApplication(application.id, newStatus);
      setApplication((prev) => ({ ...prev, status: newStatus }));
      Alert.alert('Status Updated', `The application status has been changed to ${newStatus}.`);
    } catch (error) {
      console.log(error);
      Alert.alert('Update Failed', 'There was an error while updating the application status.');
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
          <Text style={styles.title}>{application.applicant.username}</Text>
          <View style={styles.statusContainer}>
            {renderStatusIcon(application.status)}
            <Text
              style={[
                styles.statusText,
                application.status === 'Approved'
                  ? styles.statusApprovedText
                  : application.status === 'Submitted'
                    ? styles.statusPendingText
                    : styles.statusDisapprovedText,
              ]}
            >
              {application.status}
            </Text>
          </View>
          <Text style={styles.infoText}>Email: {application.applicant.email}</Text>
          <Text style={styles.infoText}>Phone: {application.applicant.phoneNumber}</Text>
          <Text style={styles.infoText}>Address: {application.applicant.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Details</Text>
          <Text style={styles.infoText}>Applied Date: {new Date(application.appliedDate).toLocaleDateString()}</Text>
          <Text style={styles.infoText}>Scholarship Program: {scholarship?.name}</Text>
          <Text style={styles.infoText}>University: {scholarship?.university?.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          {application.applicationDocuments.length > 0 ? (
            application.applicationDocuments.map((doc, index) => (
              <View key={doc.id} style={styles.documentContainer}>
                <Ionicons name="document-text" size={20} color={COLORS.primary} />
                <Text style={styles.documentText}>{doc.name}</Text>
              </View>
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
                {review.score ? (
                  <>
                    <Text style={styles.reviewDescription}>
                      {`Comment:`} <Text style={{ fontStyle: 'italic' }}>{review.comment || 'No comments provided.'}</Text>
                    </Text>
                    <Text style={styles.infoText}>
                      {`Score: ${review.score} | Date: ${new Date(review.reviewDate).toLocaleDateString()}`}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.infoText}>This application hasn't been reviewed yet.</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.infoText}>No reviews available.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Review</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write your review here..."
            value={reviewText}
            onChangeText={setReviewText}
            editable={!isReviewed}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter a score (1-10)"
            value={reviewScore}
            onChangeText={setReviewScore}
            keyboardType="numeric"
            editable={!isReviewed}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit} disabled={isReviewed}>
            <Text style={styles.submitButtonText}>{isReviewed ? 'Review Submitted' : 'Submit Review'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.actionsContainer}>
        {application.status === 'Submitted' ? (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={() => updateStatus('Approved')} disabled={loading || !isReviewed}>
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={() => updateStatus('Rejected')} disabled={loading || !isReviewed}>
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.handledMessage}>You already handled this application.</Text>
        )}
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  statusPendingText: { color: COLORS.gray50 },
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
});
