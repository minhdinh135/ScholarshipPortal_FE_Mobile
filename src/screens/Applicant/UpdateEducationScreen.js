import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { COLORS, FONTS, icons } from '../../constants';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconButton } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { updateApplicantEducation, addApplicantEducation } from '../../api/applicantApi';
import { getUniversity } from '../../api/universityApi';

const UpdateEducationScreen = ({ navigation, route }) => {
  const { userInfo } = useAuth();
  const { item } = route.params || {};
  const bottomSheetRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(item?.school || 'Select School');
  const [educationLevel, setEducationLevel] = useState(item?.educationLevel || 'Select Type');
  const [gpa, setGpa] = useState(item?.gpa?.toString() || '');
  const [major, setMajor] = useState(item?.major || '');
  const [selectedStartDate, setSelectedStartDate] = useState(item?.fromYear || 'Select Year');
  const [selectedEndDate, setSelectedEndDate] = useState(item?.toYear || 'Select Year');
  const [sheetType, setSheetType] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState({ visible: false, field: null });

  const snapPoints = React.useMemo(() => ['25%', '50%'], []);

  const fetchUniversity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUniversity();
      setUniversities(res.data);
    } catch (error) {
      console.log('Error fetching universities', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversity();
  }, [fetchUniversity]);

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      setDatePickerVisible({ visible: false, field: null });

      if (datePickerVisible.field === 'start') {
        setSelectedStartDate(year.toString());
      } else if (datePickerVisible.field === 'end') {
        setSelectedEndDate(year.toString());
      }
    }
  };

  const renderBottomSheetContent = () => {
    switch (sheetType) {
      case 'school':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sheetTitle}>What school have you enrolled in?</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {universities.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => {
                    setSelectedSchool(option.name);
                    bottomSheetRef.current?.close();
                  }}
                >
                  <Text style={styles.optionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      case 'educationlevel':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.sheetTitle}>What education level have you enrolled in?</Text>
            {['Undergraduate', 'Graduate', 'Bachelor', 'Master', 'Doctoral'].map((type, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => {
                  setEducationLevel(type);
                  bottomSheetRef.current?.close();
                }}
              >
                <Text style={styles.optionText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  const handleSaveChanges = async () => {
    const formData = {
      school: selectedSchool,
      educationLevel: educationLevel,
      gpa: gpa,
      major: major,
      description: item?.description || '',
      fromYear: selectedStartDate,
      toYear: selectedEndDate,
    };

    try {
      setLoading(true);
      if (item) {
        await updateApplicantEducation(userInfo.id, item.id, formData);
      } else {
        await addApplicantEducation(userInfo.id, formData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={icons.back}
          iconStyle={styles.iconStyle}
          containerStyle={styles.iconContainer}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>{item ? 'Edit Education' : 'Add Education'}</Text>
        <TouchableOpacity style={styles.saveButtonHeader} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonHeaderText}>Save</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Modal transparent={true} animationType="fade">
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </Modal>
      ) : (
        <>
          <Text style={styles.mainTitle}>What school have you enrolled in?</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setSheetType('school');
              bottomSheetRef.current?.expand();
            }}
          >
            <Text style={styles.selectButtonText}>{selectedSchool}</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>What education level have you enrolled in?</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setSheetType('educationlevel');
              bottomSheetRef.current?.expand();
            }}
          >
            <Text style={styles.selectButtonText}>{educationLevel}</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>What major have you studied at school?</Text>
          <TextInput
            style={styles.selectButton}
            placeholder="Enter your major"
            placeholderTextColor={COLORS.gray60}
            value={major}
            onChangeText={(text) => setMajor(text)}
          />

          <Text style={styles.mainTitle}>What is your GPA after graduating?</Text>
          <TextInput
            style={styles.selectButton}
            placeholder="Enter your GPA"
            placeholderTextColor={COLORS.gray60}
            value={gpa}
            onChangeText={(text) => setGpa(text)}
          />

          <Text style={styles.mainTitle}>Start Date</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setDatePickerVisible({ visible: true, field: 'start' })}
          >
            <Text style={styles.selectButtonText}>{selectedStartDate}</Text>
          </TouchableOpacity>

          <Text style={styles.mainTitle}>End Date</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setDatePickerVisible({ visible: true, field: 'end' })}
          >
            <Text style={styles.selectButtonText}>{selectedEndDate}</Text>
          </TouchableOpacity>

          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            handleComponent={null}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
          >
            {renderBottomSheetContent()}
          </BottomSheet>

          {datePickerVisible.visible && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
        </>
      )}
    </View>
  );
};

export default UpdateEducationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginVertical: 30
  },
  iconStyle: {
    tintColor: COLORS.black,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  headerText: {
    ...FONTS.h2,
    flex: 1,
    textAlign: 'center',
  },
  saveButtonHeader: {
    paddingVertical: 5,
    borderRadius: 5,
  },
  saveButtonHeaderText: {
    color: COLORS.primary,
    ...FONTS.h4,
  },
  mainTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: 10,
  },
  selectButton: {
    width: '100%',
    padding: 13,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.gray80,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectButtonText: {
    color: COLORS.gray60,
    textAlign: 'left',
    ...FONTS.body3,
  },
  contentContainer: {
    flex: 1,
  },
  sheetTitle: {
    ...FONTS.h2,
    color: COLORS.primary3,
    padding: 20,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray30,
  },
  optionText: {
    ...FONTS.body3,
    color: COLORS.black,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
});
