import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import { COLORS, FONTS, icons } from "../../constants";
import { IconButton } from "../../components/Card";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "../../context/AuthContext";
import { getApplicantProfileById } from "../../api/applicantApi";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const ProfileSkillScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [applicant, setApplicant] = useState({
    applicantEducations: [],
    applicantCertificates: [],
    applicantSkills: [],
    applicantExperience: [],
  });
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchApplicantProfile = async () => {
        setLoading(true);
        try {
          const res = await getApplicantProfileById(userInfo.id);
          setApplicant(res?.data || {});
        } catch (error) {
          console.log("Error fetching applicant", error);
        } finally {
          setLoading(false);
        }
      };
      fetchApplicantProfile();
    }, [userInfo.id])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={icons.back}
          iconStyle={styles.iconStyle}
          containerStyle={styles.iconContainer}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.infoContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>High School Education</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('UpdateInformationScreen', {
                  item: {
                    ...applicant.applicantEducations[0],
                    infoType: 'Education',
                  },
                })}
              >
                <Ionicons name="pencil" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>High school:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantEducations?.[0]?.school || "--"}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Major:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantEducations?.[0]?.major || "--"}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Education level:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantEducations?.[0]?.educationLevel || "--"}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Attendance year:</Text>
                  <Text style={styles.infoValue}>
                    {applicant?.applicantEducations?.[0]?.fromYear || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.column}>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Graduation year:</Text>
                  <Text style={styles.infoValue}>
                    {applicant?.applicantEducations?.[0]?.toYear || "--"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>High school GPA:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantEducations?.[0]?.gpa !== undefined
                  ? applicant.applicantEducations[0].gpa.toFixed(1)
                  : "--"}
              </Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Certificates</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('UpdateInformationScreen', {
                  item: {
                    ...applicant.applicantCertificates[0],
                    infoType: 'Certificate'
                  }
                })}
              >
                <Ionicons name="pencil" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Certificate:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantCertificates?.[0]?.name || "--"}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Achieved Year:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantCertificates?.[0]?.achievedYear || "--"}
              </Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('UpdateInformationScreen', {
                  item: {
                    ...applicant.applicantSkills[0],
                    infoType: 'Skill'
                  }
                })}
              >
                <Ionicons name="pencil" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Skill:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantSkills?.[0]?.name || "--"}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantSkills?.[0]?.type || "--"}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Start year:</Text>
                  <Text style={styles.infoValue}>
                    {applicant?.applicantSkills?.[0]?.fromYear || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.column}>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>End year:</Text>
                  <Text style={styles.infoValue}>
                    {applicant?.applicantSkills?.[0]?.toYear || "--"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Experiences</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('UpdateInformationScreen', {
                  item: {
                    ...applicant.applicantExperience[0],
                    infoType: 'Experience'
                  }
                })}
              >
                <Ionicons name="pencil" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Experience:</Text>
              <Text style={styles.infoValue}>
                {applicant?.applicantExperience?.[0]?.name || "--"}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Start year:</Text>
                  <Text style={styles.infoValue}>
                    {applicant?.applicantExperience?.[0]?.fromYear || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.column}>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>End year:</Text>
                  <Text style={styles.infoValue}>
                    {applicant?.applicantExperience?.[0]?.toYear || "--"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ProfileSkillScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 1,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  iconStyle: {
    tintColor: COLORS.black,
  },
  iconContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  headerText: {
    marginTop: 30,
    ...FONTS.h2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },
  sectionTitle: {
    ...FONTS.h1,
    color: COLORS.primary,
  },
  infoContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderColor: COLORS.gray40,
  },
  infoBlock: {
    marginBottom: 15,
  },
  infoLabel: {
    ...FONTS.h3,
    color: COLORS.primary3,
    fontWeight: "bold",
  },
  infoValue: {
    ...FONTS.body3,
    color: COLORS.black,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  editButton: {
    marginLeft: 10,
  },
});
