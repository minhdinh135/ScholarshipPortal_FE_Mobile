import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants';
import { updateApplication } from '../../api/applicationApi';
import { getScholarProgramById } from '../../api/scholarshipProgramApi';

const DetailsScreen = ({ route }) => {
  const { application: initialApplication } = route.params;
  const [application, setApplication] = useState(initialApplication);
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScholarship = async () => {
      setLoading(true);
      try {
        const res = await getScholarProgramById(application.scholarshipProgramId);
        setScholarship(res.data || null);
      } catch (err) {
        console.error(err);
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

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await updateApplication(application.id, newStatus);
      setApplication((prev) => ({ ...prev, status: newStatus }));
      Alert.alert('Status Updated', `The application status has been changed to ${newStatus}.`);
    } catch (error) {
      console.error(error);
      Alert.alert('Update Failed', 'There was an error while updating the application status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Applicant Information */}
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

        {/* Application Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Details</Text>
          <Text style={styles.infoText}>Applied Date: {new Date(application.appliedDate).toLocaleDateString()}</Text>
          <Text style={styles.infoText}>Scholarship Program: {scholarship?.name}</Text>
          <Text style={styles.infoText}>University: {scholarship?.university?.name}</Text>
        </View>

        {/* Documents */}
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

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {application.applicationReviews.length > 0 ? (
            application.applicationReviews.map((review, index) => (
              <View key={review.id} style={styles.reviewContainer}>
                <Text style={styles.reviewDescription}>{review.description}</Text>
                <Text style={styles.infoText}>
                  Status: {review.status} | Date: {new Date(review.reviewDate).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.infoText}>No reviews available.</Text>
          )}
        </View>
      </ScrollView>

      {/* Fixed Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => updateStatus('Approved')} disabled={loading}>
          <Text style={styles.actionButtonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => updateStatus('Rejected')} disabled={loading}>
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
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
  infoText: {
    ...FONTS.body3,
    color: COLORS.gray80,
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
    backgroundColor: COLORS.gray20,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  reviewDescription: {
    ...FONTS.body3,
    color: COLORS.gray80,
    marginBottom: SIZES.base / 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
