import { View, Text, ScrollView, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView, FlatList } from 'react-native-gesture-handler';
import { COLORS, FONTS, SIZES } from '../../constants';
import HorizontalList from '../../components/List/HorizontalList';
import { getScholarProgramByExpertId } from "../../api/expertApi";
import { useNavigation } from '@react-navigation/native';
import { LineDivider } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const ScholarshipListScreen = () => {
  const { userInfo } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [scholarPrograms, setScholarPrograms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  const fetchScholarshipPrograms = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await getScholarProgramByExpertId(userInfo.id);
      setScholarPrograms(response.data.items);
      setFilteredPrograms(response.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userInfo.id]);

  useEffect(() => {
    fetchScholarshipPrograms();
  }, [fetchScholarshipPrograms]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPrograms(scholarPrograms);
    } else {
      const filtered = scholarPrograms.filter((program) =>
        program.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPrograms(filtered);
    }
  };

  function renderScholarshipList() {
    return (
      <View>
        <FlatList
          data={filteredPrograms}
          listKey="Popular Scholarship"
          scrollEnabled={false}
          keyExtractor={(item) => `Popular Scholarship-${item.id}`}
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
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: COLORS.white }}>
        <Text style={styles.title}>Review List</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search scholarships..."
          placeholderTextColor={COLORS.gray}
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
          {filteredPrograms.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: SIZES.padding,
              }}
            >
              <Text style={{ color: COLORS.gray60, ...FONTS.h2 }}>
                No application was assigned yet
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderScholarshipList()}
            </ScrollView>
          )}
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
    borderColor: COLORS.gray20,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.radius,
    backgroundColor: COLORS.lightGray,
  },
});

export default ScholarshipListScreen;