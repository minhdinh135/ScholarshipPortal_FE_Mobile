import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FONTS, COLORS, SIZES } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const Description = ({ item }) => {
  const renderKeyInfoRow = () => (
    <View style={[styles.section, styles.keyInfoContainer]}>
      <View style={styles.keyInfoRow}>
        <View style={styles.keyInfoItem}>
          <Icon name="location-outline" size={24} color={COLORS.primary} />
          <Text style={styles.keyInfoTitle}>Location</Text>
          <Text style={styles.keyInfoText}>{item.university.country.name}</Text>
        </View>
        <View style={styles.keyInfoItem}>
          <Icon name="book-outline" size={24} color={COLORS.primary} />
          <Text style={styles.keyInfoTitle}>Education Level</Text>
          <Text style={styles.keyInfoText}>{item.educationLevel}</Text>
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
          <Text style={styles.keyInfoText}>${item.scholarshipAmount.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  const listData = useMemo(() => [
    {
      title: 'About this Scholarship',
      content: item.description,
    },
    {
      title: `About the ${item.university.name}`,
      content: item.university.description,
    },
    {
      title: item.major.name,
      content: item.major.description,
    },
    {
      title: 'Skills',
      content: item.major.skills,
      isSkillsSection: true,
    },
    {
      title: 'Requirement',
      content: item.criteria,
      isCriteriaSection: true,
    },
  ], [item]);

  return (
    <FlatList
      data={listData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        if (item.isSkillsSection) {
          if (!item.content || item.content.length === 0) return null;
          return (
            <View style={styles.section}>
              <Text style={styles.title}>{item.title}</Text>
              {item.content.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <View style={styles.skillIconContainer}>
                    <Icon name="star-outline" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.skillTextContainer}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={styles.skillDescription}>{skill.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        }

        if (item.isCriteriaSection) {
          if (!item.content || item.content.length === 0) return null;
          return (
            <View style={styles.section}>
              <Text style={styles.title}>{item.title}</Text>
              {item.content.map((criterion, index) => (
                <View key={index} style={styles.criterionItem}>
                  <View style={styles.bulletIcon}>
                    <Text>•</Text>
                  </View>
                  <View style={styles.criterionTextContainer}>
                    <Text style={styles.criterionDescription}>{criterion.description} - {criterion.percentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        }

        return (
          <View style={styles.section}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.content}</Text>
          </View>
        );
      }}
      ListHeaderComponent={renderKeyInfoRow}
    />
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
    marginBottom: -30,
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
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray40,
  },
  skillIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  skillTextContainer: {
    marginLeft: SIZES.base,
    flex: 1,
  },
  skillName: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  skillDescription: {
    ...FONTS.body4,
    color: COLORS.gray60,
    marginTop: 4,
  },
  criterionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletIcon: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  criterionTextContainer: {
    marginLeft: SIZES.base,
    flex: 1,
  },
  criterionName: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
  criterionDescription: {
    ...FONTS.body4,
    color: COLORS.gray60,
  },
});

export default Description;
