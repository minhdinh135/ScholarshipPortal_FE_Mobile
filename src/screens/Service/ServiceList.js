import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image } from 'react-native';
import { FilterModal, IconButton, LineDivider } from '../../components/Card';
import ServiceHorizontalList from '../../components/Service/ServiceHorizontalList';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import { getServices } from '../../api/serviceApi';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const ServiceList = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    PageIndex: 1,
    PageSize: 5,
    SortBy: '',
    IsDescending: false,
    IsPaging: true,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const filterModalSharedValue1 = useSharedValue(SIZES.height);
  const filterModalSharedValue2 = useSharedValue(SIZES.height);

  const fetchServices = useCallback(() => {
    setLoading(true);
    getServices({
      PageIndex: pagination.PageIndex,
      PageSize: pagination.PageSize,
      SortBy: pagination.SortBy,
      IsDescending: pagination.IsDescending,
      IsPaging: pagination.IsPaging,
    }).then((res) => {
      setServices(res.data.items);
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

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
          source={{ uri: 'https://media.istockphoto.com/id/1210820371/photo/businesswoman-checking-agreement-before-signing.jpg?s=612x612&w=0&k=20&c=2tsVZCmNArAj0_1wx-Gh13oWYJRE7F8nIcDNvxaXjlY=' }}
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
          Services
        </Text>
      </View>
    );
  }

  function renderResult() {
    if (services.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.gray50, textAlign: 'center', ...FONTS.h2 }}>
            No services available yet
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={services}
        keyExtractor={(item) => `Result-${item.id}`}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: SIZES.base }}>
            <Text style={{ flex: 1, ...FONTS.body3 }}>{services.length} results</Text>
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
                filterModalSharedValue2.value = withDelay(
                  100,
                  withTiming(0, {
                    duration: 500,
                  })
                );
              }}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <ServiceHorizontalList
            course={item}
            containerStyle={{
              marginVertical: SIZES.padding,
              marginTop: index === 0 ? SIZES.radius : SIZES.padding,
            }}
            onPress={() => navigation.navigate('ServiceDetailScreen', { selectedService: item })}
          />
        )}
        ItemSeparatorComponent={() => <LineDivider lineStyle={{ backgroundColor: COLORS.gray20 }} />}
        ListFooterComponent={
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            {pagination.hasPreviousPage && (
              <Text onPress={loadPreviousPage} style={{ color: COLORS.primary }}>
                Previous
              </Text>
            )}
            {pagination.hasNextPage && (
              <Text onPress={loadNextPage} style={{ color: COLORS.primary }}>
                Next
              </Text>
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

export default ServiceList;
