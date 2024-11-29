import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { FONTS, COLORS, SIZES } from '../../constants';

const ServiceDescription = ({ selectedService }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{selectedService?.name}</Text>
      </View>

      {/* Description Section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{selectedService?.description}</Text>
      </View>

      {/* Price Section */}
      <View style={styles.priceContainer}>
        <Text style={styles.sectionTitle}>Price</Text>
        <Text style={styles.priceText}>${selectedService?.price}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  status: {
    ...FONTS.body2,
    color: COLORS.gray,
    marginTop: 5,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: 10,
  },
  descriptionText: {
    ...FONTS.body3,
    color: COLORS.black,
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceText: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  feedbacksContainer: {
    marginBottom: 20,
  },
  feedbackItem: {
    marginBottom: 10,
  },
  feedbackText: {
    ...FONTS.body3,
    color: COLORS.black,
    lineHeight: 18,
  },
  noFeedbacksText: {
    ...FONTS.body3,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});

export default ServiceDescription;
