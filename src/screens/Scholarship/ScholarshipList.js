import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, TextInput } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { FilterModal, IconButton, LineDivider } from '../../components/Card';
import { HorizontalList } from '../../components/List';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import { getScholarProgram, countScholarProgram } from '../../api/scholarshipProgramApi';

const ScholarshipList = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarPrograms, setScholarPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScholarships, setTotalScholarships] = useState(0);
  const [pagination, setPagination] = useState({
    PageIndex: 1,
    PageSize: 5,
    SortBy: '',
    IsDescending: false,
    IsPaging: true,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const flatListRef = React.useRef();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const filterModalSharedValue1 = useSharedValue(SIZES.height);
  const filterModalSharedValue2 = useSharedValue(SIZES.height);

  const fetchPrograms = useCallback(() => {
    setLoading(true);
    getScholarProgram({
      PageIndex: pagination?.PageIndex,
      PageSize: pagination?.PageSize,
      SortBy: pagination?.SortBy,
      IsDescending: pagination?.IsDescending,
      IsPaging: pagination?.IsPaging,
    }).then((res) => {
      setScholarPrograms(res.data.items);
      setPagination((prev) => ({
        ...prev,
        hasNextPage: res.data.hasNextPage,
        hasPreviousPage: res.data.hasPreviousPage,
        totalPages: res.data.totalPages,
        PageIndex: res.data.pageIndex,
      }));
      setLoading(false);
    });
  }, [pagination.PageIndex, pagination.PageSize, pagination.SortBy, pagination.IsDescending, pagination.IsPaging]);

  const fetchTotalCount = useCallback(() => {
    countScholarProgram().then((res) => {
      setTotalScholarships(res.data);
    });
  }, []);

  useEffect(() => {
    fetchPrograms();
    fetchTotalCount();
  }, [fetchPrograms, fetchTotalCount]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = scholarPrograms.filter(
      (program) =>
        program.name.toLowerCase().includes(lowerCaseQuery) ||
        program.description.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredPrograms(filtered);
  }, [searchQuery, scholarPrograms]);

  function loadNextPage() {
    if (pagination.hasNextPage) {
      setPagination((prev) => ({ ...prev, PageIndex: prev.PageIndex + 1 }));
    }
  }

  function loadPreviousPage() {
    if (pagination.hasPreviousPage) {
      setPagination((prev) => ({ ...prev, PageIndex: prev.PageIndex - 1 }));
    }
  }

  function renderHeader() {
    return (
      <View>
        <Image
          source={{ uri: 'https://my.alfred.edu/zoom/_images/powell.jpg' }}
          style={{ width: '100%', height: 200 }}
          resizeMode="cover"
        />
        <Text
          style={{
            textAlign: 'center',
            marginVertical: SIZES.padding,
            ...FONTS.h1,
          }}
        >
          Scholarship Programs
        </Text>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search scholarships..."
          style={{
            height: 40,
            borderColor: COLORS.gray30,
            borderWidth: 1,
            borderRadius: SIZES.radius,
            marginHorizontal: SIZES.padding,
            paddingLeft: 10,
            marginBottom: SIZES.padding,
            ...FONTS.body4,
          }}
        />
      </View>
    );
  }

  function renderResult() {
    if (filteredPrograms.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.gray50, textAlign: 'center', ...FONTS.h2 }}>
            No scholarships match your search criteria
          </Text>
        </View>
      );
    }

    return (
      <Animated.FlatList
        ref={flatListRef}
        data={filteredPrograms}
        keyExtractor={(item) => `Result-${item.id}`}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        onScroll={onScroll}
        ListHeaderComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: SIZES.base }}>
            <Text style={{ flex: 1 }}>
              Showing {filteredPrograms.length} - {totalScholarships} results
            </Text>
            <IconButton
              icon={icons.filter}
              iconStyle={{ width: 20, height: 20 }}
              containerStyle={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: COLORS.primary,
              }}
              onPress={() => {
                filterModalSharedValue1.value = withTiming(0, {
                  duration: 100,
                });
                filterModalSharedValue2.value = withDelay(100, withTiming(0, {
                  duration: 500,
                }));
              }}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <HorizontalList
            course={item}
            containerStyle={{
              marginVertical: SIZES.padding,
              marginTop: index === 0 ? SIZES.radius : SIZES.padding,
            }}
            onPress={() => navigation.navigate('ScholarshipDetail', { selectedScholarship: item })}
          />
        )}
        ItemSeparatorComponent={() => <LineDivider lineStyle={{ backgroundColor: COLORS.gray20 }} />}
        ListFooterComponent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 20,
            }}
          >
            {pagination.hasPreviousPage ? (
              <Text onPress={loadPreviousPage} style={{ color: COLORS.primary }}>
                Previous
              </Text>
            ) : (
              <View style={{ width: 60 }} />
            )}
            {pagination.hasNextPage ? (
              <Text onPress={loadNextPage} style={{ color: COLORS.primary }}>
                Next
              </Text>
            ) : (
              <View style={{ width: 60 }} />
            )}
          </View>
        }
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {renderHeader()}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        renderResult()
      )}

      <FilterModal
        filterModalSharedValue1={filterModalSharedValue1}
        filterModalSharedValue2={filterModalSharedValue2}
      />
    </View>
  );
};

export default ScholarshipList;
