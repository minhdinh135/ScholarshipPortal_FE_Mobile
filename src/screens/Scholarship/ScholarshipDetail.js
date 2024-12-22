import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IconButton } from '../../components/Card';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import Description from '../../components/ScholarshipProgram/Description';
import { useAuth } from '../../context/AuthContext';
import { getApplicantById } from '../../api/applicantApi';

const ScholarshipDetail = ({ navigation, route }) => {
  const { userInfo } = useAuth();
  const { selectedScholarship } = route.params;
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchApplicationByApplicantId = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApplicantById(userInfo.id);
      const applied = response.data.some(
        (application) => application.scholarshipProgramId === selectedScholarship.id
      );
      setHasApplied(applied);
    } catch (error) {
      console.error('Error fetching applicant data:', error);
    } finally {
      setLoading(false);
    }
  }, [userInfo.id, selectedScholarship.id]);

  useEffect(() => {
    fetchApplicationByApplicantId();
  }, [fetchApplicationByApplicantId]);

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
    return (
      <View
        style={{
          padding: SIZES.padding,
          backgroundColor: COLORS.white,
        }}
      >
        <Text style={{ ...FONTS.h2 }}>{selectedScholarship?.name}</Text>
        <Text
          style={{
            color: COLORS.gray60,
            marginTop: 5,
            ...FONTS.body3,
          }}
        >
          Ho Chi Minh City, Vietnam
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          {hasApplied ? (
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
              onPress={() =>
                navigation.navigate('MultiStep', {
                  selectedScholarship: selectedScholarship,
                })
              }
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
          source={{
            uri: 'https://daihoc.fpt.edu.vn/templates/fpt-university/images/header.jpg',
          }}
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

  if (loading) {
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
