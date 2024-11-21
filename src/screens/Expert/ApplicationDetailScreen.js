import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants';

const DetailsScreen = ({ route }) => {
  const { application } = route.params;

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />;
      case 'Pending':
        return <Ionicons name="hourglass" size={24} color={COLORS.primary2} />;
      case 'Disapproved':
        return <Ionicons name="close-circle" size={24} color={COLORS.secondary} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Applicant Information Section */}
      <View style={styles.section}>
        <Text style={styles.title}>{application.name}</Text>
        <Text style={styles.position}>Position: {application.position}</Text>
        <View style={styles.statusContainer}>
          {renderStatusIcon(application.status)}
          <Text
            style={[
              styles.statusText,
              application.status === 'Approved'
                ? styles.statusApprovedText
                : application.status === 'Pending'
                ? styles.statusPendingText
                : styles.statusDisapprovedText,
            ]}
          >
            {application.status}
          </Text>
        </View>
      </View>

      {/* About the Applicant Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About the Applicant</Text>
        <Text style={styles.description}>{application.about}</Text>
      </View>

      {/* Skills Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.description}>{application.skills}</Text>
      </View>

      {/* Experience Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <Text style={styles.description}>{application.experience}</Text>
      </View>

      {/* Education Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <Text style={styles.description}>{application.education}</Text>
      </View>

      {/* Contact Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.description}>Email: {application.email}</Text>
        <Text style={styles.description}>Phone: {application.phone}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.base * 3,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  position: {
    ...FONTS.body2,
    color: COLORS.gray60,
    marginBottom: SIZES.base * 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  statusText: {
    ...FONTS.body2,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginLeft: SIZES.base,
  },
  statusApprovedText: {
    color: COLORS.primary,
  },
  statusPendingText: {
    color: COLORS.primary2,
  },
  statusDisapprovedText: {
    color: COLORS.secondary,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.gray70,
    marginBottom: SIZES.base,
  },
  description: {
    ...FONTS.body3,
    color: COLORS.gray80,
    lineHeight: 22,
    marginBottom: SIZES.base,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.base * 4,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
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
