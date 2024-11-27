import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { FONTS, COLORS, SIZES, icons } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment'

const Description = ({ item }) => {
  console.log(item.qualification);

  return (
    <ScrollView style={styles.container}>
      {/* Key Information */}
      <View style={[styles.section, styles.keyInfoContainer]}>
        <View style={styles.keyInfoRow}>
          <View style={styles.keyInfoItem}>
            <Icon name="location-outline" size={24} color={COLORS.primary} />
            <Text style={styles.keyInfoTitle}>Location</Text>
            <Text style={styles.keyInfoText}>{item.university.country.name}</Text>
          </View>
          <View style={styles.keyInfoItem}>
            <Icon name="book-outline" size={24} color={COLORS.primary} />
            <Text style={styles.keyInfoTitle}>Qualification</Text>
            <Text style={styles.keyInfoText}>Undergraduate</Text>
          </View>
        </View>
        <View style={styles.keyInfoRow}>
          <View style={styles.keyInfoItem}>
            <Icon name="calendar-outline" size={24} color={COLORS.primary} />
            <Text style={styles.keyInfoTitle}>Deadline</Text>
            <Text style={styles.keyInfoText}>{moment(item.deadline).format('MMM DD, YYYY')}</Text>
          </View>
          <View style={styles.keyInfoItem}>
            <Icon name="trophy-outline" size={24} color={COLORS.primary} />
            <Text style={styles.keyInfoTitle}>Award</Text>
            <Text style={styles.keyInfoText}>{item.scholarshipAmount.toLocaleString()}$</Text>
          </View>
        </View>
      </View>

      {/* About this Scholarship */}
      <View style={styles.section}>
        <Text style={styles.title}>About this Scholarship</Text>
        <Text style={styles.text}>
          {item.description}
          {/* The Global Excellence Scholarship aims to support outstanding students
          with exceptional academic achievements and leadership skills. This program
          is designed to foster the growth of tomorrow's leaders and innovators. */}
        </Text>
      </View>

      {/* About the University */}
      <View style={styles.section}>
        <Text style={styles.title}>About the {item.university.name}</Text>
        <Text style={styles.text}>
          Established in 1890, the University of Global Learning is a world-renowned
          institution known for its cutting-edge research and a commitment to
          fostering diversity. The university boasts a vibrant campus with over
          50,000 students from over 120 countries.
        </Text>
      </View>

      {/* Eligibility */}
      <View style={styles.section}>
        <Text style={styles.title}>Eligibility</Text>
        <Text style={styles.text}>- Must be an international student.</Text>
        <Text style={styles.text}>- A minimum GPA of 3.8 or equivalent.</Text>
        <Text style={styles.text}>- Demonstrated leadership skills and community involvement.</Text>
        <Text style={styles.text}>- Proof of English proficiency (TOEFL, IELTS, or equivalent).</Text>
      </View>

      {/* Application Process */}
      <View style={styles.section}>
        <Text style={styles.title}>Application Process</Text>
        <Text style={styles.text}>1. Submit the completed scholarship application form.</Text>
        <Text style={styles.text}>2. Provide official academic transcripts.</Text>
        <Text style={styles.text}>3. Submit a 500-word essay on your academic and career goals.</Text>
        <Text style={styles.text}>4. Two letters of recommendation.</Text>
        <Text style={styles.text}>5. Proof of English proficiency (if applicable).</Text>
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={styles.title}>Benefits</Text>
        <Text style={styles.text}>- Full tuition waiver for the entire duration of the program.</Text>
        <Text style={styles.text}>- Monthly stipend of $1,500.</Text>
        <Text style={styles.text}>- Access to exclusive networking events and mentorship opportunities.</Text>
        <Text style={styles.text}>- Health insurance coverage.</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  section: {
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 8,
  },
  text: {
    ...FONTS.body3,
    color: COLORS.gray60,
  },
  keyInfoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: -30
  },
  keyInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  keyInfoItem: {
    alignItems: 'center',
    width: '45%',
  },
  keyInfoTitle: {
    ...FONTS.h4,
    color: COLORS.black,
    marginTop: SIZES.base / 2,
  },
  keyInfoText: {
    ...FONTS.body4,
    color: COLORS.gray60,
    marginTop: SIZES.base / 4,
    textAlign: 'center',
  },
});

export default Description;
