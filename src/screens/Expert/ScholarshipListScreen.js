import { View, Text, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS, FONTS, SIZES } from '../../constants';
import HorizontalList from '../../components/List/HorizontalList';
import { getApplicationByExpertId, getScholarProgramByExpertId } from "../../api/expertApi";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LineDivider } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const ScholarshipListScreen = () => {
  const { userInfo } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [scholarPrograms, setScholarPrograms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('Ongoing');

  useFocusEffect(
    React.useCallback(() => {
      const fetchScholarshipPrograms = async () => {
        setLoading(true);
        try {
          const [scholar, application] = await Promise.all([
            getScholarProgramByExpertId(userInfo.id),
            getApplicationByExpertId(userInfo.id),
          ]);
          setScholarPrograms(scholar.data.items);
          setApplications(application.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchScholarshipPrograms();
    }, [userInfo.id])
  );

  const filteredApplications = applications.filter(app =>
    app.applicationReviews.some(review =>
      review.expertId == userInfo.id && review.score === 0 && review.comment === null
    )
  );

  const unfinishedScholarPrograms = scholarPrograms.filter(program =>
    filteredApplications.map(app => app.scholarshipProgramId).includes(program.id)
  );

  const completedScholarPrograms = scholarPrograms.filter(
    program => !unfinishedScholarPrograms.map(up => up.id).includes(program.id)
  );

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const getFilteredPrograms = () => {
    const programsToFilter =
      activeTab === 'Ongoing' ? unfinishedScholarPrograms : completedScholarPrograms;
    if (searchText.trim() === '') {
      return programsToFilter;
    }
    return programsToFilter.filter((program) =>
      program.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const renderScholarshipList = () => {
    const filteredPrograms = getFilteredPrograms();
    return (
      <FlatList
        data={filteredPrograms}
        listKey={`${activeTab} Scholarships`}
        keyExtractor={(item) => `${activeTab}-${item.id}`}
        keyboardDismissMode='on-drag'
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
        }}
        renderItem={({ item, index }) => (
          <HorizontalList
            course={item}
            containerStyle={{
              marginVertical: SIZES.padding,
              marginTop: index === 0 ? SIZES.radius : SIZES.padding,
            }}
            onPress={() =>
              navigation.navigate('ScholarshipDetail', { selectedScholarship: item })
            }
          />
        )}
        ItemSeparatorComponent={() => (
          <LineDivider
            lineStyle={{
              backgroundColor: COLORS.gray20,
            }}
          />
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: SIZES.padding,
            }}
          >
            <Text style={{ color: COLORS.gray60, ...FONTS.h2 }}>
              No scholarships found
            </Text>
          </View>
        )}
      />
    );
  };

  const renderTabs = () => {
    return (
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Ongoing' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Ongoing')}
        >
          <Text style={activeTab === 'Ongoing' ? styles.activeTabText : styles.tabText}>
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Completed' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={activeTab === 'Completed' ? styles.activeTabText : styles.tabText}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: COLORS.white }}>
        <Text style={styles.title}>Scholarship List</Text>
        {renderTabs()}
        <TextInput
          style={styles.searchBar}
          placeholder="Search scholarships..."
          placeholderTextColor={COLORS.gray60}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.white,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: COLORS.white }}>
          {renderScholarshipList()}
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: SIZES.padding,
  },
  searchBar: {
    height: 40,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.radius,
    backgroundColor: COLORS.gray10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    paddingVertical: 5,
  },
  tab: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.gray10,
    alignItems: "center",
    borderRadius: SIZES.radius,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.gray50,
    ...FONTS.body4,
  },
  activeTabText: {
    color: COLORS.white,
    ...FONTS.body4,
  },
});

export default ScholarshipListScreen;
