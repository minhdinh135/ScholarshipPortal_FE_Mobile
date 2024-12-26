import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { IconButton } from '../../components/Card';
import { getRequestById } from '../../api/requestApi';
import moment from 'moment';

const ServiceHistoryScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const response = await getRequestById(userInfo.id);
        const groupedRequests = groupRequestsByDate(response.data);
        setSections(groupedRequests);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceRequest();
  }, []);

  const groupRequestsByDate = (requests) => {
    const grouped = requests.reduce((acc, request) => {
      const dateKey = moment(request.requestDate).format('MMMM DD, YYYY');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(request);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => moment(b, 'MMMM DD, YYYY') - moment(a, 'MMMM DD, YYYY'))
      .map((date) => ({
        title: date,
        data: grouped[date],
      }));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
    >
      <View>
        <Text style={[styles.programName, FONTS.h3]}>
          {item.service?.name || 'Unknown'}
        </Text>
        <Text style={[styles.detail, FONTS.body4]}>
          Requested on: {moment(item.requestDate).format('MMM DD, YYYY')}
        </Text>
        <Text style={[styles.status, FONTS.body4]}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={icons.back}
          iconStyle={{
            tintColor: COLORS.black,
          }}
          containerStyle={styles.iconButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Request History</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>You haven't requested a service yet</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 22,
  },
  header: {
    marginHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 40,
    ...FONTS.h2,
  },
  iconButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  noDataText: {
    color: COLORS.gray50,
    ...FONTS.h2,
  },
  list: {
    paddingVertical: SIZES.base,
    marginTop: SIZES.padding,
  },
  sectionHeader: {
    color: COLORS.black,
    ...FONTS.h2,
    padding: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 0.4,
    borderColor: COLORS.gray60,
    padding: SIZES.padding,
    marginBottom: SIZES.padding / 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  programName: {
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  detail: {
    color: COLORS.gray80,
  },
  status: {
    marginTop: SIZES.base / 2,
    color: COLORS.primary3,
  },
});

export default ServiceHistoryScreen;
