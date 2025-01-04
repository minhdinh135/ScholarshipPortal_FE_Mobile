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
import { COLORS, FONTS, SIZES, images } from "../../constants";
import { getApplicationByExpertId } from "../../api/expertApi";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

const ApplicationManagementScreen = ({ navigation, route }) => {
  const { userInfo } = useAuth();
  const { selectedScholarship } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("First Review");

  useFocusEffect(
    React.useCallback(() => {
      const fetchApplications = async () => {
        setLoading(true);
        try {
          const res = await getApplicationByExpertId(userInfo.id);
          const applicationsData = res.data || [];
          const filteredByScholarship = applicationsData.filter(
            (application) => application.scholarshipProgramId === selectedScholarship.id
          );
          setApplications(filteredByScholarship);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchApplications();
    }, [userInfo.id, selectedScholarship.id])
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return {
          backgroundColor: COLORS.successLight,
          color: COLORS.success,
        };
      case "Awarded":
        return {
          backgroundColor: COLORS.infoLight,
          color: COLORS.info,
        };
      case "Reviewing":
        return {
          backgroundColor: COLORS.warningLight,
          color: COLORS.warning,
        };
      case "Rejected":
        return {
          backgroundColor: "#ffaeae",
          color: "#ff0000",
        };
      default:
        return {
          backgroundColor: COLORS.gray10,
          color: COLORS.gray,
        };
    }
  };

  const filterByTab = () => {
    const typeFilter = activeTab === "First Review" ? 1 : 2;
    return applications.filter(
      (app) =>
        (typeFilter === 1 && app.applicationReviews[1]?.description === undefined) ||
        (typeFilter === 2 && app.applicationReviews[1]?.description !== undefined)
    );
  };

  const renderApplication = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ApplicationDetailScreen", {
            application: item,
          })
        }
      >
        <View style={styles.cardContent}>
          <Text style={styles.applicantName}>{item?.applicantName}</Text>
          <Text style={styles.date}>
            Applied on: {moment(item.appliedDate).format("MMM DD, YYYY")}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusLabel, { color: statusStyle.color }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application List</Text>
      <View style={styles.tabContainer}>
        {["First Review", "Second Review"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search applications..."
        placeholderTextColor={COLORS.gray60}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filterByTab().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={images.empty_file}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>No applications assigned yet</Text>
        </View>
      ) : (
        <FlatList
          data={filterByTab()}
          keyExtractor={(item) => item.id}
          renderItem={renderApplication}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
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
  searchInput: {
    backgroundColor: COLORS.gray10,
    borderRadius: SIZES.radius,
    padding: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 300,
    height: 300,
  },
  emptyText: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    borderColor: COLORS.gray20,
    borderWidth: 0.5,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  applicantName: {
    ...FONTS.h3,
    color: COLORS.black,
  },
  date: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginVertical: 5,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: SIZES.radius,
    marginTop: 5,
  },
  statusLabel: {
    ...FONTS.body4,
  },
});

export default ApplicationManagementScreen;