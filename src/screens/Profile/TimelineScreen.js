import React, { useState } from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { COLORS, FONTS, SIZES } from '../../constants';

const TimelineScreen = () => {
  const [timelineData] = useState([
    {
      time: '10:00\n2024-11-25',
      title: 'Meeting with Team',
      description: 'Discuss project updates and assign new tasks.',
    },
    {
      time: '14:00\n2024-11-26',
      title: 'Code Review',
      description: 'Review the latest PRs and suggest improvements.',
    },
    {
      time: '12:00\n2024-11-27',
      title: 'Lunch Break',
      description: 'Enjoy a relaxing lunch break.',
    },
    {
      time: '16:00\n2024-11-28',
      title: 'Client Call',
      description: 'Discuss the upcoming project roadmap with the client.',
    },
    {
      time: '18:00\n2024-11-29',
      title: 'Wrap Up',
      description: 'Summarize the day\'s achievements and plan tomorrow.',
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Weekly Timeline</Text>
      <Timeline
        data={timelineData}
        circleSize={15}
        circleColor={COLORS.primary}
        lineColor={COLORS.primary}
        timeContainerStyle={{ minWidth: 70 }}
        timeStyle={styles.time}
        descriptionStyle={styles.description}
        titleStyle={styles.title}
        innerCircle={'dot'}
        separator={true}
        separatorStyle={{ backgroundColor: COLORS.gray40 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    justifyContent: 'center'
  },
  header: {
    ...FONTS.h2,
    color: COLORS.black,
    textAlign: 'center',
    paddingVertical: SIZES.padding * 0.5,
    marginBottom: 10
  },
  time: {
    textAlign: 'center',
    // backgroundColor: COLORS.primary,
    color: COLORS.gray40,
    padding: 5,
    borderRadius: 13,
    overflow: 'hidden',
  },
  description: {
    color: COLORS.gray50,
    ...FONTS.body3
  },
  title: {
    ...FONTS.h3
  },
});

export default TimelineScreen;
