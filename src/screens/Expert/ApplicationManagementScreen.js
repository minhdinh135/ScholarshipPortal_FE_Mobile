import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { COLORS, FONTS, SIZES, icons, images } from "../../constants";
import { getApplicationByExpertId } from "../../api/expertApi";
import { getAccountById } from "../../api/accountApi";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { FilterModal, IconButton } from "../../components/Card";
import { useSharedValue, withTiming, withDelay } from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

const ApplicationManagementScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const filterModalSharedValue1 = useSharedValue(SIZES.height);
  const filterModalSharedValue2 = useSharedValue(SIZES.height);

  useFocusEffect(
    React.useCallback(() => {
      const fetchApplications = async () => {
        setLoading(true);
        try {
          const res = await getApplicationByExpertId(userInfo.id);
          const applicationsData = res.data || [];

          const applicationsWithApplicants = await Promise.all(
            applicationsData.map(async (application) => {
              try {
                const applicantRes = await getAccountById(application.id);
                return { ...application, applicant: applicantRes };
              } catch (error) {
                console.error(Error`fetching`);
                return { ...application, applicant: null };
              }
            }),
          );

          setApplications(applicationsWithApplicants);
          setFilteredApplications(applicationsWithApplicants); // Initialize filtered list
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      };

      fetchApplications();
    }, [userInfo.id]),
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: COLORS.primary };
      case "Awarded":
        return { backgroundColor: "yellow" };
      case "Submitted":
        return { backgroundColor: COLORS.gray20 };
      case "Rejected":
        return { backgroundColor: "red" };
      default:
        return { backgroundColor: COLORS.gray10 };
    }
  };

  const applyFilter = (status) => {
    setActiveFilter(status);
    if (status === "All") {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(
        (application) => application.status === status,
      );
      setFilteredApplications(filtered);
    }
  };

  const renderApplication = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <TouchableOpacity
        style={styles.applicationCard}
        onPress={() =>
          navigation.navigate("ApplicationDetailScreen", { application: item })
        }
      >
        <View style={styles.applicationInfo}>
          {/* <Text style={styles.applicationName}>{item.applicant.username.toUpperCase()}</Text> */}
          <Text style={styles.applicantEmail}>
            Email: {item.applicant?.email}
          </Text>
          <Text style={styles.date}>
            Applied on: {moment(item.appliedDate).format("MMM DD, YYYY")}
          </Text>
        </View>
        <View style={[styles.statusBadge, statusStyle]}></View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={{
          marginTop: 36,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={{ ...FONTS.h2, marginBottom: 20 }}>Approval List</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search applications..."
          placeholderTextColor={COLORS.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <IconButton
          icon={icons.filter}
          iconStyle={{ width: 20, height: 20 }}
          containerStyle={{
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            backgroundColor: COLORS.primary,
            marginLeft: 10,
          }}
          onPress={() => {
            filterModalSharedValue1.value = withTiming(0, {
              duration: 100,
            });
            filterModalSharedValue2.value = withDelay(
              100,
              withTiming(0, {
                duration: 500,
              }),
            );
          }}
        />
      </View>

      {/* Filter Buttons */}
      <View>
        <FlatList
          horizontal
          data={["All", "Approved", "Rejected", "Submitted"]}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginBottom: 20,
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === item && styles.activeFilterButton,
                {
                  marginLeft: index === 0 ? 0 : SIZES.radius,
                  marginRight: index === 3 ? SIZES.padding : 0,
                },
              ]}
              onPress={() => applyFilter(item)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === item && styles.activeFilterButtonText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Application List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredApplications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={images.empty_file}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>No applications found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredApplications}
          keyExtractor={(item) => item.id}
          renderItem={renderApplication}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FilterModal
        filterModalSharedValue1={filterModalSharedValue1}
        filterModalSharedValue2={filterModalSharedValue2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.large,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SIZES.base,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
  },
  emptyImage: {
    width: SIZES.width * 0.7,
    height: SIZES.height * 0.7,
    marginVertical: -120,
  },
  emptyText: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: "center",
    padding: SIZES.padding,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray80,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.base,
    height: 50,
    paddingLeft: 20,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  filterButton: {
    marginLeft: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  filterText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
  listContainer: {
    paddingBottom: SIZES.padding,
  },
  applicationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 0.8,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.gray20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 10,
  },
  applicationInfo: {
    flex: 1,
    justifyContent: "center",
  },
  applicationName: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  position: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  date: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 5,
  },
  applicantName: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 5,
  },
  applicantEmail: {
    fontSize: SIZES.small,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 5,
  },
  statusBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  filterButton: {
    backgroundColor: COLORS.gray10,
    paddingVertical: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.gray50,
    ...FONTS.body4,
    marginBottom: -4,
  },
  activeFilterButtonText: {
    color: COLORS.white,
    ...FONTS.body4,
  },
});

export default ApplicationManagementScreen;

