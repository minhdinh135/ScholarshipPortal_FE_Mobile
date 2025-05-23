import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, icons, SIZES } from '../../constants';
import { reviewResultApplication } from '../../api/applicationApi';
import { getScholarProgramById } from '../../api/scholarshipProgramApi';
import moment from 'moment';
import { IconButton } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const DetailsScreen = ({ route, navigation }) => {
  const { userInfo } = useAuth();
  const { application: initialApplication } = route.params;
  const [application, setApplication] = useState(initialApplication);
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(false);
  const [criteriaScores, setCriteriaScores] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);

  const review = application.applicationReviews.filter(
    (review) => review.expertId == userInfo.id
  );

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
      const allReviewed = review.every(
        (reviewItem) => reviewItem.score !== null && reviewItem.comment?.trim().length > 0
      );
      setIsReviewed(allReviewed);
    };
    checkIfReviewed();
  }, [application.applicationReviews]);

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />;
      case 'Reviewing':
        return <Ionicons name="hourglass" size={24} color={COLORS.warning} />;
      case 'Submitted':
        return <Ionicons name="hourglass" size={24} color={COLORS.warning} />;
      case 'NeedExtend':
        return <Ionicons name="hourglass" size={24} color={COLORS.warning} />;
      case 'Failed':
        return <Ionicons name="close-circle" size={24} color={COLORS.secondary} />;
      case 'Rejected':
        return <Ionicons name="close-circle" size={24} color={COLORS.secondary} />;
      default:
        return null;
    }
  };

  const handleReviewSubmit = async () => {
    const score = parseFloat(calculateTotalScore());

    if (isNaN(score) || score < 1 || score > 100) {
      Alert.alert('Invalid Score', 'Please enter a valid score between 1 and 100.');
      return;
    }

    const selectedReviewId =
      review
        .filter(rev => rev.score === 0 && rev.comment === null)
        .map(rev => rev.id)[0];

    if (!selectedReviewId) {
      Alert.alert('No Review Available', 'The selected application does not have a review to update.');
      return;
    }

    const updatedReview = {
      applicationReviewId: selectedReviewId,
      comment: reviewText,
      isPassed: score >= 50 ? true : false,
      score,
      isFirstReview: review[0].description === "Application Review" ? true : false
    };

    try {
      setLoading(true);
      await reviewResultApplication(updatedReview);
      const updatedReviews = application.applicationReviews.map((review) =>
        review.id === selectedReviewId
          ? { ...review, comment: reviewText, score, reviewDate: new Date().toISOString() }
          : review
      );
      setApplication((prev) => ({
        ...prev,
        applicationReviews: updatedReviews,
      }));
      setReviewText('');
      setIsReviewed(true);
      Alert.alert('Review Submitted', 'Your review has been submitted.');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'There was an error submitting the review.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scholarship) {
      setCriteriaScores(
        scholarship.criteria.map((criterion) => ({
          ...criterion,
          score: "",
        }))
      );
    }
  }, [scholarship]);

  const calculateTotalScore = () => {
    return criteriaScores.reduce((total, criterion) => {
      const score = parseFloat(criterion.score);
      return total + (isNaN(score) ? 0 : (score * criterion.percentage) / 100);
    }, 0).toFixed(2);
  };

  const handleScoreChange = (id, value) => {
    setCriteriaScores((prevScores) =>
      prevScores.map((criterion) =>
        criterion.id === id ? { ...criterion, score: value } : criterion
      )
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 20,
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'left',
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
            top: 0,
            left: 10,
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: COLORS.white
          }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.screenTitle}>Details</Text>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.applicantInfoContainer}>
            <Image
              source={{ uri: userInfo.role === 'Expert' ? application.applicantProfile.avatar : userInfo.avatar }}
              style={styles.applicantAvatar}
            />
            <View>
              <Text style={styles.title}>
                {userInfo.role === 'Expert' ? application.applicantName : userInfo.username}
              </Text>
              <Text style={styles.emailText}>
                {application.applicantProfile.email || 'Email not available'}
              </Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            {userInfo.role === 'Expert' ? (
              <>
                {renderStatusIcon(review[0].status)}
                <Text
                  style={[
                    styles.statusText,
                    review[0].status === 'Approved' ? styles.statusApprovedText :
                      review[0].status === 'Reviewing' ? styles.statusPendingText :
                        styles.statusDisapprovedText
                  ]}
                >
                  {review[0].status}
                </Text>
              </>
            ) : (
              <>
                {renderStatusIcon(application.status)}
                <Text
                  style={[
                    styles.statusText,
                    application.status === 'Approved' ? styles.statusApprovedText :
                      application.status === 'Reviewing' ? styles.statusPendingText :
                        application.status === 'NeedExtend' ? styles.statusPendingText :
                          application.status === 'Submitted' ? styles.statusPendingText :
                            styles.statusDisapprovedText
                  ]}
                >
                  {application.status}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Information</Text>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Scholarship:</Text> {scholarship?.name}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>University:</Text> {scholarship?.university?.name}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Applied on:</Text> {moment(application.appliedDate).format("MMM DD, YYYY")}
          </Text>
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

        {userInfo.role === "Expert" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Criteria</Text>
            {(criteriaScores.map((criteria) => (
              <View key={criteria.name}>
                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>{criteria?.name}:</Text> {criteria?.description} ({criteria?.percentage}%)
                </Text>
              </View>
            )))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Reviews</Text>
          {userInfo.role === "Expert" ? (
            review.length > 0 ? (
              review.map((reviewItem) => (
                <View key={reviewItem.id} style={styles.reviewContainer}>
                  <Text style={[styles.sectionTitle, { color: COLORS.primary, ...FONTS.h2 }]}>
                    {reviewItem.description}
                  </Text>
                  <Text style={styles.reviewDescription}>
                    {`Score:`} <Text style={{ fontStyle: 'normal' }}>{reviewItem.score || 'N/A'}</Text>
                  </Text>
                  <Text style={styles.reviewDescription}>
                    {`Comment:`} <Text style={{ fontStyle: 'italic' }}>{reviewItem.comment || 'No comments provided.'}</Text>
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>No reviews available.</Text>
            )
          ) : (
            application.applicationReviews.length > 0 ? (
              application.applicationReviews.map((reviewItem) => (
                <View key={reviewItem.id} style={styles.reviewContainer}>
                  <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>
                    {reviewItem.description}
                  </Text>
                  <Text style={styles.reviewDescription}>
                    {`Score:`} <Text style={{ fontStyle: 'normal' }}>{reviewItem.score || 'N/A'} points</Text>
                  </Text>
                  <Text style={styles.reviewDescription}>
                    {`Comment:`} <Text style={{ fontStyle: 'italic' }}>{reviewItem.comment || 'No comments provided.'}</Text>
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>No reviews available.</Text>
            )
          )}
        </View>
        {userInfo.role === "Expert" && (
          isReviewed ? (
            <View style={styles.section}>
              <Text style={styles.alreadyReviewText}>You already have reviewed this application.</Text>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scoring Criteria</Text>
              {criteriaScores.map((criterion) => (
                <View style={styles.criteriaContainer}>
                  <Text style={styles.criteriaText}>
                    {criterion.name} ({criterion.percentage}%)
                  </Text>
                  <TextInput
                    style={[styles.textInput, styles.criteriaInput]}
                    placeholder="1-100"
                    value={criterion.score}
                    onChangeText={(value) => handleScoreChange(criterion.id, value)}
                    keyboardType="numeric"
                  />
                </View>
              ))}
              <View style={styles.totalScoreContainer}>
                <Text style={styles.totalScoreText}>Total Score: {calculateTotalScore()}</Text>
              </View>
              <Text style={styles.sectionTitle}>Comment</Text>
              <TextInput
                style={[styles.textInput, { height: 100 }]}
                placeholder="Write your comment here..."
                value={reviewText}
                onChangeText={setReviewText}
                multiline={true}
                numberOfLines={4}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleReviewSubmit}>
                <Text style={styles.submitButtonText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          )
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
    marginTop: -10
  },
  section: {
    marginBottom: SIZES.base * 3,
  },
  screenTitle: {
    ...FONTS.h1,
    color: COLORS.black,
    marginLeft: 15,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  applicantInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  applicantAvatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginRight: SIZES.base,
    backgroundColor: COLORS.white,
  },
  emailText: {
    ...FONTS.body3,
    color: COLORS.gray70,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  statusText: {
    ...FONTS.body2,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginLeft: SIZES.base,
  },
  statusApprovedText: { color: COLORS.success, ...FONTS.h2 },
  statusPendingText: { color: COLORS.warning, ...FONTS.h2 },
  statusDisapprovedText: { color: COLORS.secondary, ...FONTS.h2 },
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
    borderWidth: 0.5,
    borderColor: COLORS.gray30,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewDescription: {
    ...FONTS.body3,
    color: COLORS.gray90,
    marginBottom: SIZES.base / 2,
    fontWeight: 'bold',
  },
  infoText: {
    ...FONTS.body3,
    color: COLORS.primary3,
  },
  boldText: {
    ...FONTS.body3,
    fontWeight: 'bold',
    color: COLORS.gray60,
  },
  alreadyReviewText: {
    ...FONTS.h2,
    color: COLORS.gray50,
    textAlign: 'center'
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
  criteriaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.base,
  },
  criteriaText: {
    ...FONTS.body3,
    color: COLORS.gray70,
    flex: 0.7,
  },
  criteriaInput: {
    flex: 0.2,
    textAlign: "center",
  },
  totalScoreContainer: {
    marginVertical: SIZES.base,
    alignItems: "center",
  },
  totalScoreText: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
});
