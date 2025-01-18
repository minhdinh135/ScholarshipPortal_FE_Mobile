import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { IconButton } from '../../components/Card';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import Description from '../../components/ScholarshipProgram/Description';
import { useAuth } from '../../context/AuthContext';
import { getApplicantById, getApplicantProfileById } from '../../api/applicantApi';
import { useFocusEffect } from '@react-navigation/native';

const ScholarshipDetail = ({ navigation, route }) => {
  const { userInfo } = useAuth();
  const { selectedScholarship } = route.params;
  const [applicant, setApplicant] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [isCountdownReady, setIsCountdownReady] = useState(false);

  const fetchApplicationByApplicantId = useCallback(async () => {
    if (userInfo.role === 'Expert') {
      return;
    }

    try {
      const [response, applicantResponse] = await Promise.all([
        getApplicantById(userInfo.id),
        getApplicantProfileById(userInfo.id)
      ]);

      const applied = response.data.some(
        (application) => application.scholarshipProgramId === selectedScholarship.id
      );

      setHasApplied(applied);
      setApplicant(applicantResponse.data);
    } catch (error) {
      console.error('Error fetching applicant data:', error);
      // Optionally, you can set an error state here to inform the user
      setError('Failed to fetch applicant data. Please try again later.');
    }
  }, [userInfo.id, selectedScholarship.id]);

  const calculateCountdown = useCallback(() => {
    const deadline = new Date(selectedScholarship?.deadline).getTime();
    const now = new Date().getTime();
    const difference = deadline - now;

    if (difference <= 0) {
      setCountdown('Closed');
    } else {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }
    setIsCountdownReady(true);
  }, [selectedScholarship?.deadline]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchApplicationByApplicantId();
        calculateCountdown();
        setLoading(false);
      };
      loadData();
    }, [fetchApplicationByApplicantId, calculateCountdown])
  );

  useEffect(() => {
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [calculateCountdown]);

  // Function to check if the applicant has all the required skills
  const checkSkillsMatch = () => {
    const requiredSkills = selectedScholarship.major.skills.map(skill => skill.name);
    const applicantSkills = applicant.applicantSkills.map(skill => skill.name);

    // Check if every required skill is in the applicant's skills
    const skillsMatch = requiredSkills.every(skill => applicantSkills.includes(skill));

    return skillsMatch && requiredSkills.length === applicantSkills.length;
  };

  // Function to handle Apply Now button click
  const handleApplyNow = () => {
    console.log(applicant.applicantSkills[1]);

    if (!checkSkillsMatch()) {
      Alert.alert('Skills Mismatch', 'You don\'t have the required skills for this scholarship.');
    } else {
      navigation.navigate('MultiStep', { selectedScholarship: selectedScholarship });
    }
  };

  if (loading || !isCountdownReady) {
    return (
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
    );
  }

  function renderHeaderComponent() {
    return (
      <View
        style={{
          flex: 1,
          marginTop: 10,
        }}
      >
        <IconButton
          icon={icons.back}
          iconStyle={{
            width: 25,
            height: 25,
            tintColor: COLORS.black,
          }}
          containerStyle={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: COLORS.white,
          }}
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  function renderHeader() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.height > 800 ? 40 : 20,
          left: 0,
          right: 0,
          flexDirection: 'row',
          paddingHorizontal: SIZES.padding,
          zIndex: 1,
        }}
      >
        {renderHeaderComponent()}
      </View>
    );
  }

  function renderScholarshipInfo() {
    const isDeadlinePassed = countdown === 'Closed';

    const getStatusBadgeStyle = () => {
      switch (selectedScholarship.status) {
        case 'Open':
          return { backgroundColor: COLORS.successLight, textColor: COLORS.success };
        case 'Closed':
          return { backgroundColor: COLORS.gray20, textColor: COLORS.gray80 };
        case 'Completed':
          return { backgroundColor: COLORS.infoLight, textColor: COLORS.info };
        case 'Reviewing':
        case 'Awarding':
          return { backgroundColor: COLORS.warningLight, textColor: COLORS.warning };
        default:
          return { backgroundColor: COLORS.gray20, textColor: COLORS.gray80 };
      }
    };

    const statusBadgeStyle = getStatusBadgeStyle();

    return (
      <View
        style={{
          padding: SIZES.padding,
          backgroundColor: COLORS.white,
        }}
      >
        <Text style={{ ...FONTS.h2 }}>{selectedScholarship?.name}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}
        >
          {isDeadlinePassed ? (
            <>
              <View>
                <Text
                  style={{
                    color: COLORS.gray60,
                    ...FONTS.body3,
                    marginRight: 10
                  }}
                >
                  Status:
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: statusBadgeStyle.backgroundColor,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: SIZES.radius / 2,
                }}
              >
                <Text
                  style={{
                    color: statusBadgeStyle.textColor,
                    ...FONTS.body4,
                  }}
                >
                  {selectedScholarship.status}
                </Text>
              </View>
            </>
          ) : (
            <Text
              style={{
                color: COLORS.gray60,
                ...FONTS.body3,
                flex: 1,
              }}
            >
              Deadline: {countdown}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          {userInfo.role === 'Expert' ? (
            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.primary3,
                borderRadius: SIZES.radius,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
              onPress={() =>
                navigation.navigate('ApplicationManagementScreen', {
                  selectedScholarship: selectedScholarship,
                })
              }
            >
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>View Applications</Text>
            </TouchableOpacity>
          ) : hasApplied ? (
            <View
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.gray20,
                borderRadius: SIZES.radius,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: COLORS.gray80, ...FONTS.h3 }}>
                Already Applied
              </Text>
            </View>
          ) : isDeadlinePassed ? (
            <View
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.gray20,
                borderRadius: SIZES.radius,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: COLORS.gray80, ...FONTS.h3 }}>Closed</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.primary,
                borderRadius: SIZES.radius,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
              onPress={handleApplyNow}
            // disabled={!checkSkillsMatch()}
            >
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Apply Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  function renderTop() {
    return (
      <View
        style={{
          height: SIZES.height > 800 ? 220 : 200,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.gray90,
        }}
      >
        <ImageBackground
          source={{ uri: selectedScholarship.imageUrl }}
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </View>
    );
  }

  function renderContent() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Description item={selectedScholarship} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      {renderHeader()}
      {renderTop()}
      {renderScholarshipInfo()}
      {renderContent()}
    </View>
  );
};

export default ScholarshipDetail;