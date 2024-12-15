import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { IconButton } from '../../components/Card';
import { getRequestById } from '../../api/requestApi';
import moment from 'moment';

const ApplicationHistory = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceRequest = async () => {
      try {
        const response = await getRequestById(userInfo.id);
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceRequest();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
    >
      <View>
        <Text style={[styles.programName, FONTS.h3]}>
          {item.service?.name || 'Unknown'}
        </Text>
        <Text style={[styles.detail, FONTS.body4]}>
          Applied on: {moment(item.requestDate).format('MMM DD, YYYY')}
        </Text>
        <Text style={[styles.status, FONTS.body4]}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
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
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
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
  headerTitle: {
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: SIZES.base,
    marginTop: SIZES.padding,
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

export default ApplicationHistory;
