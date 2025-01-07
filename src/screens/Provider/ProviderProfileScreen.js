import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  FlatList,
} from 'react-native';
import { getProviderById } from "../../api/providerApi";
import { getServicesByProviderId } from "../../api/serviceApi";
import { COLORS, FONTS, icons } from "../../constants";
import { IconButton } from '../../components/Card';

const ProviderProfileScreen = ({ navigation, route }) => {
  const { selectedService } = route.params;
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [providerResponse, serviceResponse] = await Promise.all([
        getProviderById(selectedService.providerId),
        getServicesByProviderId(selectedService.providerId),
      ]);
      setProvider(providerResponse.data);
      setServices(serviceResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedService.providerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://512pixels.net/downloads/macos-wallpapers-thumbs/10-12--thumb.jpg",
        }}
        style={styles.headerBackground}
      >
        <IconButton
          icon={icons.back}
          iconStyle={styles.iconStyle}
          containerStyle={styles.iconContainer}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.avatarContainer}>
          {provider?.avatar && (
            <Image source={{ uri: provider?.avatar }} style={styles.profilePicture} />
          )}
        </View>
      </ImageBackground>
      <View style={styles.providerInfo}>
        <Text style={styles.profileName}>{provider?.contactPersonName}</Text>
        <Text style={styles.profileBio}>{provider?.email}</Text>
        <Text style={styles.profileDescription}>Total services: {services.length}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.cardsContainer}>
        {services.length > 0 ? (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MemoizedServiceCard item={item} navigation={navigation} />}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.noServicesText}>No services available</Text>
        )}
      </View>
    </View>
  );
};

const ServiceCard = ({ item, navigation }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.name}</Text>
    <Text style={styles.cardDescription}>{item.description}</Text>
    <TouchableOpacity
      style={styles.cardButton}
      onPress={() => navigation.navigate("ServiceDetailScreen", { selectedService: item })}
    >
      <Text style={styles.cardButtonText}>Learn More</Text>
    </TouchableOpacity>
  </View>
);

const MemoizedServiceCard = memo(ServiceCard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerBackground: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -60,
    zIndex: 1,
  },
  profilePicture: {
    width: 130,
    height: 130,
    borderRadius: 100,
  },
  providerInfo: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 16,
  },
  profileName: {
    color: COLORS.black,
    ...FONTS.h2,
    textAlign: 'center',
    marginBottom: 4,
  },
  profileBio: {
    color: COLORS.gray50,
    ...FONTS.body3,
    textAlign: 'center',
    marginBottom: 12,
  },
  profileDescription: {
    color: COLORS.black,
    ...FONTS.body3,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.gray20,
    marginVertical: 20,
    marginHorizontal: 16,
  },
  cardsContainer: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    ...FONTS.h2,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  cardButtonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  noServicesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  iconStyle: {
    width: 25,
    height: 25,
    tintColor: COLORS.black,
  },
  iconContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
});

export default ProviderProfileScreen;
