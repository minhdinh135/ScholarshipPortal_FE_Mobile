import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FONTS, COLORS, SIZES } from '../../constants';
import { getProviderById } from '../../api/providerApi';

const ServiceDescription = ({ selectedService, navigation }) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProvider = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProviderById(selectedService.providerId);
      setProvider(res.data);
    } catch (error) {
      console.log('Error fetching provider: ', error);
    } finally {
      setLoading(false);
    }
  }, [selectedService.providerId]);

  useEffect(() => {
    if (selectedService?.providerId) {
      fetchProvider();
    }
  }, [fetchProvider, selectedService?.providerId]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{selectedService?.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.sectionTitle}>Price:</Text>
            <Text style={styles.priceText}>${selectedService?.price.toLocaleString()}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.sectionTitle}>Type:</Text>
            <Text style={styles.priceText}>{selectedService?.type}</Text>
          </View>
          {provider && (
            <View style={styles.providerContainer}>
              <Image source={{ uri: provider.avatar }} style={styles.providerAvatar} />
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.contactPersonName}</Text>
                <Text style={styles.providerDescription}>{provider.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ProviderProfileScreen", { selectedService: selectedService })}
              >
                <Text style={{ color: COLORS.white, ...FONTS.h4 }}>View</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{selectedService?.description}</Text>
          </View>
          <View style={styles.priceContainer} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    borderRadius: SIZES.radius,
    borderColor: COLORS.gray20,
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  providerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
    marginRight: 10,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  providerDescription: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding / 2,
    borderRadius: 100
  },
  descriptionContainer: {
    marginBottom: 60,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: 10,
  },
  descriptionText: {
    ...FONTS.body3,
    color: COLORS.black,
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 0,
    flexDirection: 'row',
  },
  priceText: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginLeft: 5
  },
});

export default ServiceDescription;
