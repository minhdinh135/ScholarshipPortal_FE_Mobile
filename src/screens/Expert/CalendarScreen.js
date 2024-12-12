import React, { useState, useCallback, memo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { COLORS, SIZES, FONTS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { getApplicationByExpertId } from '../../api/expertApi';
import moment from 'moment';

const Item = memo(({ item, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.itemTitle}>{item.name}</Text>
    <Text style={styles.itemSubtitle}>Time: {item.time}</Text>
    <Text style={styles.itemSubtitle}>Location: {item.location}</Text>
  </TouchableOpacity>
));

const CalendarScreen = ({ navigation }) => {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  useEffect(() => {
    setLoading(true);
    getApplicationByExpertId(userInfo.id)
      .then((res) => {
        const fetchedApplications = res.data || [];
        const agendaItems = fetchedApplications.reduce((acc, application) => {
          application.applicationReviews.forEach((review) => {
            const date = moment(review.reviewDate).format("YYYY-MM-DD");

            if (!acc[date]) {
              acc[date] = [];
            }

            acc[date].push({
              name: application.applicantId,
              time: moment(review.reviewDate).format("hh:mm A"),
              location: `Location for Application ${application.id}`,
              applicationId: application.id,
              reviewDetails: review,
            });
          });
          return acc;
        }, {});

        setItems(agendaItems);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userInfo?.id]);

  const renderItem = useCallback(
    (item) => (
      <Item
        item={{
          name: item.name,
          time: item.time,
          location: item.location,
        }}
        onPress={() => handleItemPress(item)}
      />
    ),
    []
  );

  const handleItemPress = (item) => {
    navigation.navigate("SecondReviewScreen")
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        selected={moment().format("YYYY-MM-DD")}
        renderItem={renderItem}
        pastScrollRange={3}
        futureScrollRange={3}
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
    color: COLORS.black,
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 2,
    marginRight: SIZES.padding / 2,
    marginTop: SIZES.padding / 2,
    shadowColor: COLORS.gray40,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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

export default CalendarScreen;
