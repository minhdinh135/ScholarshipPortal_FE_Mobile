import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, FlatList, Image } from 'react-native'
import { IconButton, LineDivider } from '../../components/Card'
import ServiceHorizontalList from '../../components/Service/ServiceHorizontalList';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import { getServices } from '../../api/serviceApi';

const ServiceList = ({ navigation }) => {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(() => {
    setLoading(true);
    getServices().then((res) => {
      setServices(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  function renderHeader() {
    return (
      <View>
        <Image
          source={{ uri: 'https://daihoc.fpt.edu.vn/templates/fpt-university/images/header.jpg' }}
          style={{ width: '100%', height: 200 }}
          resizeMode="cover"
        />
        <Text
          style={{
            textAlign: 'center',
            marginTop: SIZES.padding,
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: SIZES.base }}>
            <Text style={{ flex: 1, ...FONTS.body3 }}>Showing {services.length} results</Text>
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
            onPress={() => navigation.navigate('ServiceDetailScreen', { selectedScholarship: item })}
          />
        )}
        ItemSeparatorComponent={() => <LineDivider lineStyle={{ backgroundColor: COLORS.gray20 }} />}
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
    </View>
  );

}

export default ServiceList;
