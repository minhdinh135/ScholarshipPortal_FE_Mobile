import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants";

const ApplicationManagementScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([
    { id: "1", name: "John Doe", status: "approved", position: "Software Engineer", date: "2024-11-01" },
    { id: "2", name: "Jane Smith", status: "rejected", position: "Product Manager", date: "2024-10-15" },
    { id: "3", name: "Alice Johnson", status: "pending", position: "Data Analyst", date: "2024-11-05" },
    { id: "4", name: "Bob Brown", status: "cancelled", position: "UX Designer", date: "2024-09-30" },
    { id: "5", name: "Charlie Green", status: "approved", position: "Marketing Specialist", date: "2024-10-20" },
    { id: "6", name: "Diana White", status: "pending", position: "Sales Representative", date: "2024-11-10" },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return { backgroundColor: "green" };
      case "rejected":
        return { backgroundColor: "red" };
      case "pending":
        return { backgroundColor: "yellow" };
      case "cancelled":
        return { backgroundColor: COLORS.gray10 };
      default:
        return { backgroundColor: COLORS.gray10 };
    }
  };

  const renderApplication = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <TouchableOpacity
        style={styles.applicationCard}
        onPress={() => navigation.navigate("ApplicationDetailScreen", { application: item })}
      >
        <View style={styles.applicationInfo}>
          <Text style={styles.applicationName}>{item.name}</Text>
          <Text style={styles.position}>{item.position}</Text>
          <Text style={styles.date}>Applied on: {item.date}</Text>
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
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Applications List */}
      <FlatList
        data={applications.filter((app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderApplication}
        contentContainerStyle={styles.listContainer}
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
    paddingBottom: SIZES.large,
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
  statusBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,  // Makes the status a circle (dot)
    backgroundColor: "transparent", // default for no status
    alignSelf: "center",
  },
});

export default ApplicationManagementScreen;
