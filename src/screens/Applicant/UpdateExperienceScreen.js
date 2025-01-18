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
import React, { useState } from 'react';
import { COLORS, FONTS, icons } from '../../constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconButton } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { updateApplicantExperience, addApplicantExperience } from '../../api/applicantApi';

const UpdateExperienceScreen = ({ navigation, route }) => {
  const { userInfo } = useAuth();
  const { item } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState(item?.name || '');
  const [selectedStartDate, setSelectedStartDate] = useState(item?.fromYear || 'Select Year');
  const [selectedEndDate, setSelectedEndDate] = useState(item?.toYear || 'Select Year');
  const [datePickerVisible, setDatePickerVisible] = useState({ visible: false, field: null });

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

  const handleSaveChanges = async () => {
    const formData = {
      name: experience,
      description: item?.description || '',
      fromYear: selectedStartDate,
      toYear: selectedEndDate,
    };

    try {
      setLoading(true);
      if (item) {
        await updateApplicantExperience(userInfo.id, item.id, formData);
      } else {
        await addApplicantExperience(userInfo.id, formData);
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
        <Text style={styles.headerText}>
          {item ? 'Edit Experience' : 'Add Experience'}
        </Text>
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
          <Text style={styles.mainTitle}>What experience do you have?</Text>
          <TextInput
            style={styles.selectButton}
            placeholder="Enter your experience"
            placeholderTextColor={COLORS.gray60}
            value={experience}
            onChangeText={(text) => setExperience(text)}
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

export default UpdateExperienceScreen;

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
    marginVertical: 30,
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
    marginBottom: 20,
  },
  selectButtonText: {
    color: COLORS.gray60,
    textAlign: 'left',
    ...FONTS.body3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
