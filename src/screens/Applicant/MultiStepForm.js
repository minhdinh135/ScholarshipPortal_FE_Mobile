import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView
} from "react-native";
import { COLORS, SIZES, FONTS, images } from "../../constants";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../../context/AuthContext";
import { postApplication } from "../../api/applicationApi";
import { Ionicons } from "@expo/vector-icons";
import { sendNotificationFunder } from "../../api/notificationApi";
import CircularProgress from "react-native-circular-progress-indicator";

const StepOne = ({ formData, setFormData, errors }) => {
  return (
    <View style={styles.cardContent}>
      <Text style={styles.headerText}>Please fill out your personal information below to apply scholarship.</Text>
      <Text style={styles.inputLabel}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={COLORS.gray50}
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={COLORS.gray50}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <Text style={styles.inputLabel}>Phone Number</Text>
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

const StepFour = ({ formData }) => {
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <Image source={images.pdf_icon} style={styles.fileIcon} />;
      case "jpg":
      case "jpeg":
      case "png":
        return <Image source={images.image_icon} style={styles.fileIcon} />;
      case "doc":
      case "docx":
        return <Image source={images.docx_icon} style={styles.fileIcon} />;
      case "zip":
      case "rar":
        return <Image source={images.zip_icon} style={styles.fileIcon} />;
      default:
        return <Image source={images.image_icon} style={styles.fileIcon} />;
    }
  };

  return (
    <ScrollView
      style={styles.cardContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headerText}>
        Please check your information before submitting:
      </Text>
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Text style={styles.infoText}>Name: {formData.name}</Text>
        <Text style={styles.infoText}>Email: {formData.email}</Text>
        <Text style={styles.infoText}>Phone: {formData.phone}</Text>
      </View>

      {formData.documents.length > 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          {formData.documents.map((doc, index) => (
            <View key={index} style={styles.fileItem}>
              {getFileIcon(doc.fileName)}
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{doc.type}</Text>
                <Text style={styles.fileSize}>{formatFileSize(doc.fileSize)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {formData.optionalDocuments.length > 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Optional Documents</Text>
          {formData.optionalDocuments.map((doc, index) => (
            <View key={index} style={styles.fileItem}>
              {getFileIcon(doc.fileName)}
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{doc.type}</Text>
                <Text style={styles.fileSize}>{formatFileSize(doc.fileSize)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const FileUploadSection = ({
  title,
  types,
  formData,
  setFormData,
  errors,
  setTypes,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!selectedType) {
      Alert.alert("Error", "Please select a type before uploading a file.");
      return;
    }

    try {
      setLoading(true);
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

        const responseJson = await response.json();

        if (response.ok) {
          setFormData({
            ...formData,
            documents: [
              ...formData.documents,
              {
                name: selectedType,
                type: selectedType,
                fileUrl: responseJson.data[0],
                fileName: name,
                fileSize: size,
              },
            ],
          });

          setTypes((prev) => prev.filter((type) => type !== selectedType));
          setSelectedType("");
        } else {
          Alert.alert("Upload Error", "Failed to upload file.");
        }
      }
    } catch (error) {
      Alert.alert("Error", "There was a problem selecting or uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index) => {
    const updatedDocuments = [...formData.documents];
    const removedType = updatedDocuments[index].type;
    updatedDocuments.splice(index, 1);
    setFormData({ ...formData, documents: updatedDocuments });
    setTypes((prev) => [...prev, removedType]);
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <Image source={images.pdf_icon} style={{ width: 40, height: 40 }} />;
      case "jpg":
      case "jpeg":
      case "png":
        return <Image source={images.image_icon} style={{ width: 40, height: 40 }} />;
      case "doc":
      case "docx":
        return <Image source={images.docx_icon} style={{ width: 40, height: 40 }} />;
      case "zip":
      case "rar":
        return <Image source={images.zip_icon} style={{ width: 40, height: 40 }} />;
      default:
        return <Image source={images.image_icon} style={{ width: 40, height: 40 }} />;
    }
  };

  return (
    <View style={styles.cardContent}>
      <Text style={styles.headerText}>{title}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          <Picker.Item label="Select type..." value="" />
          {types.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>
      </View>
      {errors.documents && <Text style={styles.errorText}>{errors.documents}</Text>}

      <TouchableOpacity style={styles.uploadButton} onPress={uploadFile} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            "Upload File"
          )}
        </Text>
      </TouchableOpacity>

      {formData.documents.length > 0 && (
        <View style={styles.fileListContainer}>
          {formData.documents.map((doc, index) => (
            <View key={index} style={styles.fileListItem}>
              <View style={styles.fileIconContainer}>
                {getFileIcon(doc.fileName)}
              </View>
              <View style={styles.fileInfoContainer}>
                <Text style={styles.fileNameText}>{doc.type}</Text>
                <Text style={styles.fileSizeText}>
                  {formatFileSize(doc.fileSize)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFile(index)}
              >
                <Ionicons name="close-circle" size={24} color={COLORS.gray80} />
              </TouchableOpacity>
            </View>
          ))}
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
    documents: [],
    optionalDocuments: [],
  });

  const allTypes = [
    "Academic Transcript",
    "Recommendation Letter",
    "Personal Statement",
    "CV/Resume",
    "Research Proposal",
    "Portfolio",
    "Certification",
    "Exam Scores",
    "Financial Report",
  ];

  const [requiredTypes, setRequiredTypes] = useState(
    selectedScholarship.documents
      .filter((doc) => doc.isRequired)
      .map((doc) => doc.type)
  );
  const [optionalTypes, setOptionalTypes] = useState(
    [
      ...selectedScholarship.documents
        .filter((doc) => !doc.isRequired)
        .map((doc) => doc.type),
      "Other"
    ]
  );

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
    const uploadedRequiredTypes = formData.documents.map((doc) => doc.type);
    const missingTypes = requiredTypes.filter(
      (type) => !uploadedRequiredTypes.includes(type)
    );

    const newErrors = {};
    if (missingTypes.length > 0) {
      newErrors.documents = `You must upload all required documents`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAndNextStep = () => {
    const isValid =
      step === 1 ? validateStepOne() : step === 2 ? validateStepTwo() : true;
    if (isValid) setStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prevStep) => Math.max(prevStep - 1, 1));
    } else {
      navigation.goBack();
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const allDocuments = [
        ...formData.documents,
        ...formData.optionalDocuments,
      ];

      const applicationData = {
        applicantId: userInfo.id,
        scholarshipProgramId: selectedScholarship.id,
        appliedDate: new Date().toISOString(),
        status: "Submitted",
        documents: allDocuments,
      };

      await Promise.all([
        await postApplication(applicationData),
        await sendNotificationFunder(userInfo.id, selectedScholarship.id),
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

  const renderProgressBar = () => {
    let stepTitle = "";
    let nextDescription = "";

    switch (step) {
      case 1:
        stepTitle = "Personal Info";
        nextDescription = "Next - Required Document";
        break;
      case 2:
        stepTitle = "Required Document";
        nextDescription = "Next - Optional Document";
        break;
      case 3:
        stepTitle = "Optional Document";
        nextDescription = "Next - Confirm Information";
        break;
      case 4:
        stepTitle = "Confirmation";
        nextDescription = "You're ready to submit!";
        break;
    }

    return (
      <View style={styles.headerContainer}>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.title}>{stepTitle}</Text>
          <Text style={styles.descriptionText}>{nextDescription}</Text>
        </View>
        <View style={styles.circularProgressContainer}>
          <CircularProgress
            value={(step / 4) * 100}
            maxValue={100}
            radius={30}
            activeStrokeWidth={6}
            inActiveStrokeWidth={6}
            activeStrokeColor={COLORS.primary}
            inActiveStrokeColor={COLORS.gray30}
            inActiveStrokeOpacity={0.5}
            showProgressValue={false}
          />
          <Text style={styles.stepText}>{`${step} of ${4}`}</Text>
        </View>
      </View>
    );
  };

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
          <FileUploadSection
            title="Please ensure you have the following documents to apply for this scholarship."
            types={requiredTypes}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setTypes={setRequiredTypes}
          />
        )}
        {step === 3 && (
          <FileUploadSection
            title="You can submit other files to support your application."
            types={optionalTypes}
            formData={{
              ...formData,
              documents: formData.optionalDocuments, // Use the temporary list for optional documents
            }}
            setFormData={(newFormData) =>
              setFormData((prev) => ({
                ...prev,
                optionalDocuments: newFormData.documents,
              }))
            }
            errors={errors}
            setTypes={setOptionalTypes}
          />
        )}
        {step === 4 && <StepFour formData={formData} />}

        <View style={styles.buttonContainer}>
          {step > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={
              step === 4 ? handleSubmitConfirmation : validateAndNextStep
            }
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : step === 4 ? (
                "Submit"
              ) : (
                "Next"
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
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.padding,
    marginBottom: -20
  },
  circularProgressContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionText: {
    ...FONTS.body4,
    color: COLORS.gray50,
  },
  stepText: {
    position: "absolute",
    ...FONTS.body4,
    color: COLORS.black,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  infoCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoText: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: 5,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  fileIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    ...FONTS.body3,
    color: COLORS.black,
  },
  fileSize: {
    ...FONTS.body5,
    color: COLORS.gray50,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray40,
    borderRadius: SIZES.base,
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
  headerText: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: 20,
  },
  inputLabel: {
    marginBottom: 4,
    color: COLORS.gray50,
    ...FONTS.body4,
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
    ...FONTS.body3,
    marginVertical: SIZES.base / 2,
  },
  uploadButton: {
    padding: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginVertical: SIZES.base,
  },
  fileListContainer: {
    marginTop: SIZES.base,
  },
  fileListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray30,
  },
  fileIconContainer: {
    marginRight: SIZES.base,
  },
  fileInfoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  fileNameText: {
    ...FONTS.body3,
    color: COLORS.black,
  },
  fileSizeText: {
    ...FONTS.body5,
    color: COLORS.gray50,
  },
  removeButton: {
    padding: SIZES.base,
    backgroundColor: COLORS.red,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MultiStepForm;