import React, { useState, useCallback, memo, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { COLORS, SIZES, FONTS } from '../../constants';
import { useAuth } from '../../context/AuthContext';

// Predefined dummy data
const dummyData = {
  "2024-11-28": [
    {
      name: "Interview with Candidate A",
      time: "10:00 AM - 11:00 AM",
      location: "Room 1",
    },
    {
      name: "Interview with Candidate B",
      time: "2:00 PM - 3:00 PM",
      location: "Room 2",
    },
  ],
  "2024-11-29": [
    {
      name: "Interview with Candidate C",
      time: "9:00 AM - 10:00 AM",
      location: "Room 3",
    },
  ],
  "2024-11-30": [
    {
      name: "Interview with Candidate D",
      time: "1:00 PM - 2:00 PM",
      location: "Room 4",
    },
    {
      name: "Interview with Candidate E",
      time: "3:00 PM - 4:00 PM",
      location: "Room 5",
    },
  ],
};

const Item = memo(({ item }) => (
  <View style={styles.item}>
    <Text style={styles.itemTitle}>{item.name}</Text>
    <Text style={styles.itemSubtitle}>Time: {item.time}</Text>
    <Text style={styles.itemSubtitle}>Location: {item.location}</Text>
  </View>
));

const InterviewerSchedule = () => {
  const [items, setItems] = useState(dummyData);
  const [loading, setLoading] = useState(true); // Add loading state
  const { userInfo, setUser } = useAuth();

  useEffect(() => {
    setLoading(true); // Show loading spinner
    getAccountById(userInfo.id)
      .then((res) => {
        setUser(res.data);
        // Update items or other state here if necessary
      })
      .finally(() => {
        setLoading(false); // Hide loading spinner after data is fetched
      });
  }, [userInfo?.id]);

  // Memoized renderItem to prevent unnecessary re-renders
  const renderItem = useCallback(
    (item) => <Item item={item} />,
    []
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        selected={"2024-11-29"} // Default selected date
        renderItem={renderItem}
        pastScrollRange={3} // Allow navigation to one month in the past
        futureScrollRange={3} // Allow navigation to one month in the future
        showClosingKnob={true}
        theme={{
          calendarBackground: COLORS.white,
          agendaDayTextColor: COLORS.gray30,
          agendaDayNumColor: COLORS.gray30,
          agendaTodayColor: COLORS.primary,
          agendaKnobColor: COLORS.primary,
          selectedDayBackgroundColor: COLORS.primary,
          selectedDayTextColor: COLORS.white,
          todayTextColor: COLORS.primary,
          dayTextColor: COLORS.gray80,
          textDisabledColor: COLORS.gray40,
          dotColor: COLORS.secondary,
          selectedDotColor: COLORS.white,
          monthTextColor: COLORS.primary3,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: SIZES.padding,
    ...FONTS.body3,
    color: COLORS.primary,
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 2,
    marginRight: SIZES.padding / 2,
    marginTop: SIZES.padding / 2,
  },
  itemTitle: {
    ...FONTS.h3,
    color: COLORS.primary3,
  },
  itemSubtitle: {
    ...FONTS.body4,
    color: COLORS.gray60,
  },
});

export default InterviewerSchedule;
