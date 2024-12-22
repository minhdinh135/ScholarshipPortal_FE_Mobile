import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from "react-native";
import { COLORS, SIZES, FONTS } from "../../constants";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../../context/AuthContext";
import { postApplication } from "../../api/applicationApi";
import { Ionicons } from "@expo/vector-icons";
import { sendNotificationFunder } from "../../api/notificationApi";

const StepOne = ({ formData, setFormData, errors }) => {
  return (
    <View style={styles.cardContent}>
      <Text style={styles.title}>Personal Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={COLORS.gray50}
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={COLORS.gray50}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor={COLORS.gray50}
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        keyboardType="number-pad"
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
    </View>
  );
};

const StepTwo = ({ formData, setFormData, errors }) => {
  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result) {
        const { uri, name, mimeType, size } = result.assets[0];
        const files = new FormData();
        files.append("files", {
          uri: uri,
          name: name,
          type: mimeType,
          size: size,
        });

        const response = await fetch(`${process.env.BASE_URL}/api/file-upload`, {
          method: "POST",
          body: files,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const responseText = await response.text();

        try {
          const responseJson = JSON.parse(responseText);

          if (response.ok) {
            Alert.alert("Upload Success", "File uploaded successfully.");
            setFormData({ ...formData, file: responseJson.data[0] });
          } else {
            Alert.alert("Upload Error", "Failed to upload file.");
          }
        } catch (error) {
          Alert.alert("Response Error", "The response is not valid JSON.");
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "There was a problem selecting or uploading the file.",
      );
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, file: null });
  };

  return (
    <View style={styles.cardContent}>
      <Text style={styles.title}>Upload Document</Text>
      <TextInput
        style={styles.input}
        placeholder="File Name"
        placeholderTextColor={COLORS.gray50}
        value={formData.filename}
        onChangeText={(text) => setFormData({ ...formData, filename: text })}
      />
      {errors.filename && <Text style={styles.errorText}>{errors.filename}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.type}
          onValueChange={(itemValue) => setFormData({ ...formData, type: itemValue })}
        >
          <Picker.Item label="Select type..." value="" />
          <Picker.Item label="Academic Transcript" value="Academic Transcript" />
          <Picker.Item label="Recommendation Letter" value="Recommendation Letter" />
          <Picker.Item label="Personal Statement" value="Personal Statement" />
          <Picker.Item label="CV/Resume" value="CV/Resume" />
          <Picker.Item label="Research Proposal" value="Research Proposal" />
          <Picker.Item label="Portfolio" value="Portfolio" />
          <Picker.Item label="Certification" value="Certification" />
          <Picker.Item label="Exam Scores" value="Exam Scores" />
          <Picker.Item label="Financial Report" value="Financial Report" />
        </Picker>
      </View>
      {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
      {formData.file && (
        <View style={styles.filePreviewContainer}>
          {formData.file.match(/\.(jpg|jpeg|png)$/i) ? (
            <Image
              source={{ uri: formData.file }}
              style={styles.imagePreview}
            />
          ) : (
            <Text>Uploaded File: {formData.file}</Text>
          )}
          <TouchableOpacity style={styles.removeButton} onPress={removeFile}>
            <Ionicons name="close-circle" size={24} color={COLORS.gray80} />
          </TouchableOpacity>
        </View>
      )}
      {formData.file ? (
        <></>
      ) : (
        <>
          <TouchableOpacity style={styles.uploadButton} onPress={uploadFile}>
            <Text style={styles.buttonText}>Upload File</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const StepThree = ({ formData }) => {
  return (
    <View style={styles.cardContent}>
      <Text style={styles.title}>Check Information</Text>
      <Text style={styles.summaryText}>Name: {formData.name}</Text>
      <Text style={styles.summaryText}>Email: {formData.email}</Text>
      <Text style={styles.summaryText}>Phone: {formData.phone}</Text>
      <Text style={styles.summaryText}>File name: {formData.filename}</Text>
      <Text style={styles.summaryText}>Type: {formData.type}</Text>
      {formData.file && (
        <View style={{ marginVertical: 16 }}>
          {formData.file.endsWith(".jpg") ||
            formData.file.endsWith(".png") ||
            formData.file.endsWith(".jpeg") ||
            formData.file.endsWith(".pdf") ? (
            <Image
              source={{ uri: formData.file }}
              style={{ width: 200, height: 200, borderRadius: 8 }}
            />
          ) : (
            <Text>Uploaded file: {formData.file}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const MultiStepForm = ({ navigation, route }) => {
  const { userInfo } = useAuth();
  const { selectedScholarship } = route.params;
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo.username,
    email: userInfo.email,
    phone: "0931239847",
    filename: "",
    type: "",
    file: null,
  });

  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!formData.filename) newErrors.filename = "File name is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.file) newErrors.file = "Document is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAndNextStep = () => {
    const isValid = step === 1 ? validateStepOne() : validateStepTwo();
    if (isValid) setStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const submitForm = async () => {
    setLoading(true);
    try {
      const applicationData = {
        applicantId: userInfo.id,
        scholarshipProgramId: selectedScholarship.id,
        appliedDate: new Date().toISOString(),
        status: "Submitted",
        documents: [
          {
            name: formData.filename,
            type: formData.type,
            fileUrl: formData.file,
          },
        ],
      };
      await Promise.all([
        await postApplication(applicationData),
        await sendNotificationFunder(userInfo.id, selectedScholarship.id)
      ]);
      Alert.alert("Success", "Form submitted successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("ApplicationHistoryScreen"),
        },
      ]);
    } catch (error) {
      console.log("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitConfirmation = () => {
    Alert.alert("Confirm Submission", "Are you sure you want to submit?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: submitForm },
    ]);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((s, index) => (
        <React.Fragment key={s}>
          <View
            style={[
              styles.stepDot,
              (step > s || s === step) && styles.activeStepDot,
            ]}
          >
            <Text
              style={
                s === step || step > s ? styles.activeStepText : styles.stepText
              }
            >
              {s}
            </Text>
          </View>
          {index < 2 && (
            <View
              style={[styles.stepLine, step > s && styles.activeStepLine]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>

      {renderProgressBar()}

      <View style={styles.card}>
        {step === 1 && (
          <StepOne
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        {step === 2 && (
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}
        {step === 3 && (
          <StepThree formData={formData} setFormData={setFormData} />
        )}

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={
              step === 3 ? handleSubmitConfirmation : validateAndNextStep
            }
          >
            <Text style={styles.buttonText}>
              {loading ? (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                </View>
              ) : (
                step === 3 ? "Submit" : "Next"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SIZES.base * 2,
    padding: SIZES.padding,
  },
  stepDot: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: COLORS.gray20,
    alignItems: "center",
    justifyContent: "center",
  },
  activeStepDot: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    color: COLORS.gray50,
    ...FONTS.h3,
  },
  activeStepText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: COLORS.gray20,
  },
  activeStepLine: {
    backgroundColor: COLORS.primary,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 3,
    borderTopRightRadius: SIZES.radius * 3,
    padding: SIZES.padding * 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: SIZES.radius,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.black,
    textAlign: "center",
    marginBottom: SIZES.padding,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray40,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    marginBottom: SIZES.padding,
    color: COLORS.black,
    ...FONTS.body3
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray40,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  inputLabel: {
    marginBottom: 4,
    color: COLORS.black,
    ...FONTS.body3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.padding,
  },
  backButton: {
    flex: 0.45,
    padding: SIZES.base,
    backgroundColor: COLORS.gray30,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  nextButton: {
    flex: 0.45,
    padding: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  errorText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginBottom: 10,
    marginTop: -20
  },
  summaryText: {
    color: COLORS.black,
    fontSize: 16,
    marginVertical: SIZES.base / 2,
  },
  uploadButton: {
    padding: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginVertical: SIZES.base,
  },
  filePreviewContainer: {
    position: "relative",
    marginVertical: 16,
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: "contain",
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: 0,
    backgroundColor: COLORS.red,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MultiStepForm;
