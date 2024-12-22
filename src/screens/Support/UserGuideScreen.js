import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, FONTS } from '../../constants';

const MultiStepGuide = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation();

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('HomeTab');
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.backgroundColor1 }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.header, { color: COLORS.primary }]} >Step 1: Register as an Applicant</Text>
            <Text style={[styles.text, { color: COLORS.black }]}>
              Once you successfully register as an Applicant on our SSAP, you must wait for the funder to review your application to confirm that you meet the criteria and requirements for the scholarship.
            </Text>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.header, { color: COLORS.primary }]}>Step 2: Create Wallet and Add Funds</Text>
            <Text style={[styles.text, { color: COLORS.black }]}>
              You need to create your own wallet and add funds because:
            </Text>
            <Text style={[styles.subText, { color: COLORS.black }]}>
              - You may need money to purchase services from the Service Providers in our system. These services may include reviewing your CV or other assistance. When you purchase a service, you must pay 100% of the service fee, and the Provider will provide feedback.
            </Text>
            <Text style={[styles.subText, { color: COLORS.black }]}>
              - You can also chat with the Provider if you have questions about the service. After the Provider comments on your request, you can click "Finish" to complete the process, and you can provide feedback within 3 days of clicking Finish.
            </Text>
            <Text style={[styles.subText, { color: COLORS.black }]}>- You can view your transaction history through the "Wallet" section.</Text>
            <Text style={[styles.subText, { color: COLORS.black }]}>- The purpose of this wallet is for the funder to transfer money to you if you win the scholarship.</Text>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.header, { color: COLORS.primary }]}>Step 3: Scholarship Selection</Text>
            <Text style={[styles.text, { color: COLORS.black }]}>
              The funder will select the winners for the scholarship, and if you are denied, you will need to apply again (optional).
            </Text>
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.header, { color: COLORS.primary }]}>Step 4: Submit Required Documentation</Text>
            <Text style={[styles.text, { color: COLORS.black }]}>
              You must also submit the required documentation, such as your academic transcript reports, for each scholarship term. If you fail to submit these, the funder has the right to terminate the contract and stop funding your scholarship.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.gray30 }]}
          onPress={previousStep}
          disabled={currentStep === 1}
        >
          <Text style={[styles.buttonText, { color: COLORS.white }]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={nextStep}
        >
          <Text style={[styles.buttonText, { color: COLORS.white }]}>
            {currentStep === 4 ? "Return Home" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    marginTop: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: SIZES.padding * 2,
  },
  stepContainer: {
    marginBottom: 30,
    width: '100%',
  },
  header: {
    ...FONTS.h1,
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    ...FONTS.h2,
    marginBottom: 10,
    textAlign: 'left',
  },
  subText: {
    ...FONTS.body3,
    marginBottom: 5,
    textAlign: 'left',
    marginLeft: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: SIZES.body3,
    fontWeight: 'bold',
  },
});

export default MultiStepGuide;
