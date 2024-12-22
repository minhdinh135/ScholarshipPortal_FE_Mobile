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
import { getApplicantById } from '../../api/applicantApi';
import { getScholarProgramById } from '../../api/scholarshipProgramApi';
import { useAuth } from '../../context/AuthContext';
import { IconButton } from '../../components/Card';
import moment from 'moment';

const ApplicationHistoryScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantsWithScholarship = async () => {
      try {
        const applicantRes = await getApplicantById(userInfo.id);
        const applicantData = applicantRes.data;
        const scholarshipCache = {};

        const applicantsWithScholarship = await Promise.all(
          applicantData.map(async (applicant) => {
            const scholarshipId = applicant.scholarshipProgramId;
            if (!scholarshipCache[scholarshipId]) {
              try {
                const scholarshipRes = await getScholarProgramById(scholarshipId);
                scholarshipCache[scholarshipId] = scholarshipRes.data;
              } catch (err) {
                console.error(`Failed to fetch scholarship ${scholarshipId}:`, err);
                scholarshipCache[scholarshipId] = { name: 'Unknown' };
              }
            }

            return {
              ...applicant,
              scholarshipProgram: scholarshipCache[scholarshipId],
            };
          })
        );

        const groupedApplications = groupApplicationsByDate(applicantsWithScholarship.reverse());
        setSections(groupedApplications);
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantsWithScholarship();
  }, []);

  const groupApplicationsByDate = (applications) => {
    const grouped = applications.reduce((acc, applicant) => {
      const dateKey = moment(applicant.appliedDate).format('MMMM DD, YYYY');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(applicant);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => moment(b, 'MMMM DD, YYYY') - moment(a, 'MMMM DD, YYYY'))
      .map((date) => ({
        title: date,
        data: grouped[date],
      }));
  };

  const renderApplicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ScholarshipDetail', { selectedScholarship: item.scholarshipProgram })
      }
    >
      <View>
        <Text style={[styles.programName, FONTS.h3]}>
          {item.scholarshipProgram?.name || 'Unknown'}
        </Text>
        <Text style={[styles.detail, FONTS.body4]}>
          Applied on: {moment(item.appliedDate).format('MMM DD, YYYY')}
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
          onPress={() => navigation.navigate("Profile")}
        />
        <Text style={styles.headerText}>Application History</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderApplicationItem}
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

export default ApplicationHistoryScreen;
