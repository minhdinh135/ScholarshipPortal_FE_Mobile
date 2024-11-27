import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { COLORS, SIZES, FONTS } from "../../constants";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../../context/AuthContext";
import { postApplication } from "../../api/applicationApi";

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
  )
};

const StepTwo = ({ formData, setFormData, errors }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result) {
        const { uri, name, mimeType, size } = result.assets[0];
        const isImage = mimeType.startsWith("image/");
        const files = new FormData();
        files.append("files", {
          uri: uri,
          name: name,
          type: mimeType,
          size: size,
        });

        const response = await fetch(`http://10.0.2.2:5254/api/file-upload`, {
          method: "POST",
          body: files,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const responseText = await response.text();
        console.log("Raw Response:", responseText);

        try {
          const responseJson = JSON.parse(responseText);

          if (response.ok) {
            Alert.alert("Upload Success", "File uploaded successfully.");
            setFormData({ ...formData, file: responseJson.data[0] });

            if (isImage) {
              setImagePreview(formData.file);
            }
          } else {
            console.error("Upload error:", responseJson);
            Alert.alert("Upload Error", "Failed to upload file.");
          }
        } catch (error) {
          console.error("Failed to parse response:", error);
          Alert.alert("Response Error", "The response is not valid JSON.");
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      Alert.alert("Error", "There was a problem selecting or uploading the file.");
    }
  };

  return (
    <View style={styles.cardContent}>
      <Text style={styles.title}>Upload Document</Text>
      <TextInput
        style={styles.input}
        placeholder="File Name"
        placeholderTextColor={COLORS.gray50}
        value={formData.school}
        onChangeText={(text) => setFormData({ ...formData, school: text })}
      />
      {errors.school && <Text style={styles.errorText}>{errors.school}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Type"
        placeholderTextColor={COLORS.gray50}
        value={formData.major}
        onChangeText={(text) => setFormData({ ...formData, major: text })}
      />
      {errors.major && <Text style={styles.errorText}>{errors.major}</Text>}
      {formData.file && (
        <View style={{ marginVertical: 16 }}>
          {formData.file.endsWith(".jpg") || formData.file.endsWith(".png") || formData.file.endsWith(".jpeg") ? (
            <Image
              source={{ uri: formData.file }}
              style={{ width: 200, height: 200, borderRadius: 8 }}
            />
          ) : (
            <Text>Uploaded file: {formData.file}</Text>
          )}
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
      <Text style={styles.summaryText}>File name: {formData.school}</Text>
      <Text style={styles.summaryText}>Type: {formData.major}</Text>
      {formData.file && (
        <View style={{ marginVertical: 16 }}>
          {formData.file.endsWith(".jpg") || formData.file.endsWith(".png") || formData.file.endsWith(".jpeg") ? (
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
  )
};

const MultiStepForm = ({ navigation, route }) => {
  const { userInfo } = useAuth();
  const { selectedScholarship } = route.params;
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: userInfo.username,
    email: userInfo.email,
    phone: "0931239847",
    school: "",
    major: "",
    file: null,
  });

  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!formData.school) newErrors.school = "School name is required";
    if (!formData.major) newErrors.major = "Major is required";
    if (!formData.file) newErrors.file = "Document is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAndNextStep = () => {
    const isValid = step === 1 ? validateStepOne() : validateStepTwo();
    if (isValid) setStep((prevStep) => Math.min(prevStep + 1, 3));
  };

  // const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 3));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const submitForm = async () => {
    try {
      const applicationData = {
        applicantId: userInfo.id,
        scholarshipProgramId: selectedScholarship.id,
        appliedDate: new Date().toISOString(),
        status: "Submitted",
        documents: [{
          name: formData.school,
          type: formData.major,
          fileUrl: formData.file
        }]
      }
      await postApplication(applicationData).then((res) => console.log(res));
      Alert.alert("Success", "Form submitted successfully!", [{
        text: "OK",
        onPress: () => navigation.goBack(),
      }]);
    } catch (error) {
      console.log("Form submission error:", error);
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
          <View style={[styles.stepDot, (step > s || s === step) && styles.activeStepDot]}>
            <Text style={(s === step || step > s) ? styles.activeStepText : styles.stepText}>{s}</Text>
          </View>
          {index < 2 && (
            <View style={[styles.stepLine, step > s && styles.activeStepLine]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>

      {renderProgressBar()}

      <View style={styles.card}>
        {step === 1 && <StepOne formData={formData} setFormData={setFormData} errors={errors} />}
        {step === 2 && <StepTwo formData={formData} setFormData={setFormData} errors={errors} />}
        {step === 3 && <StepThree formData={formData} setFormData={setFormData} />}

        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.nextButton} onPress={step === 3 ? handleSubmitConfirmation : validateAndNextStep}>
            <Text style={styles.buttonText}>{step === 3 ? "Submit" : "Next"}</Text>
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
    borderBottomWidth: 1,
    borderColor: COLORS.gray40,
    padding: SIZES.base,
    marginBottom: SIZES.padding,
    color: COLORS.black,
    fontSize: 16,
    backgroundColor: COLORS.lightGray,
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
    color: "red",
    fontSize: 12,
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
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
});

export default MultiStepForm;