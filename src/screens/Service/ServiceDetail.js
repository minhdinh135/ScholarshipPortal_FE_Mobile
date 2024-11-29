import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Animated, TextInput, Alert } from 'react-native'
import {
  IconButton,
  LineDivider,
  TextButton
} from "../../components/Card";
import BottomSheet from '@gorhom/bottom-sheet';
import { COLORS, FONTS, SIZES, icons, constants } from '../../constants';
import ServiceDescription from '../../components/Service/ServiceDescription';
import Feedback from '../../components/ScholarshipProgram/Feedback';
import Discussion from '../../components/ScholarshipProgram/Discussion';
import { useAuth } from '../../context/AuthContext';
import { getWalletById } from '../../api/walletApi';
import { transferMoney } from '../../api/paymentApi';

const course_details_tabs = constants.course_details_tabs.map((course_details_tab) => ({
  ...course_details_tab,
  ref: React.createRef()
}))

const TabIndicator = ({ measureLayout, scrollX }) => {

  const inputRange = course_details_tabs.map((_, i) => i * SIZES.width)

  const TabIndicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.width)
  })

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.x)
  })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        height: 4,
        width: TabIndicatorWidth,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
        transform: [{
          translateX
        }]
      }}
    />
  )
}

const Tabs = ({ scrollX, onTabPress }) => {
  const [measureLayout, setMeasureLayout] = React.useState([]);
  const containerRef = React.useRef();

  React.useEffect(() => {
    let ml = [];

    course_details_tabs.forEach(course_details_tab => {
      course_details_tab?.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          ml.push({
            x, y, width, height
          })

          if (ml.length === course_details_tabs.length) {
            setMeasureLayout(ml);
          }
        }
      )
    })
  }, [containerRef.current])

  return (
    <View
      ref={containerRef}
      style={{
        flex: 1,
        flexDirection: 'row'
      }}
    >
      {measureLayout.length > 0 && <TabIndicator
        measureLayout={measureLayout} scrollX={scrollX} />}

      {course_details_tabs.map((item, index) => {
        return (
          <TouchableOpacity
            key={`Tab-${index}`}
            ref={item.ref}
            style={{
              flex: 1,
              paddingHorizontal: 15,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => {
              onTabPress(index)
            }}
          >
            <Text
              style={{
                ...FONTS.h3,
                fontSize: SIZES.height > 800 ? 18 : 17
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const ServiceDetail = ({ navigation, route }) => {

  const { selectedService } = route.params;
  const { userInfo } = useAuth();
  const flatListRef = React.useRef();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const bottomSheetRef = React.useRef(null);
  const [form, setForm] = useState({
    senderId: '',
    receiverId: '',
    description: '',
    amount: selectedService.price,
    paymentMethod: "",
  });

  const getWalletInformation = async () => {
    try {
      const [userWallet, providerWallet] = await Promise.all([
        getWalletById(userInfo.id),
        getWalletById(selectedService.providerId)
      ]);

      setForm(prevForm => ({
        ...prevForm,
        senderId: userWallet.data.id,
        receiverId: providerWallet.data.id
      }));

      return {
        userWallet,
        providerWallet
      };

    } catch (error) {
      console.error('Error fetching wallet information:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (userInfo?.id && selectedService?.providerId) {
      getWalletInformation();
    }
  }, [userInfo?.id, selectedService?.providerId]);

  const onTabPress = React.useCallback(tabIndex => {
    flatListRef?.current?.scrollToOffset({
      offset: tabIndex * SIZES.width
    })
  })

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await transferMoney(form);
      Alert.alert(
        "Request Sent",
        "Your request has been sent successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              bottomSheetRef.current?.close();
              setForm({ description: '', file: '', paymentMethod: '' });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert("Error", "There was an issue submitting your request. Please try again.");
    }
  };

  function renderHeaderComponent() {
    return (
      <>
        <View
          style={{
            flex: 1,
            marginTop: 10
          }}
        >
          <IconButton
            icon={icons.back}
            iconStyle={{
              width: 25,
              height: 25,
              tintColor: COLORS.black
            }}
            containerStyle={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              backgroundColor: COLORS.white
            }}
            onPress={() => navigation.goBack()}
          />
        </View>

        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <IconButton
            icon={icons.favourite_outline}
            iconStyle={{
              tintColor: COLORS.white
            }}
            containerStyle={{
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </View>
      </>
    )
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
          zIndex: 1
        }}
      >
        {renderHeaderComponent()}
      </View>
    )
  }

  function renderScholarshipInfo() {
    return (
      <View style={{
        padding: SIZES.padding,
        backgroundColor: COLORS.white,
      }}>
        <Text style={{ ...FONTS.h2 }}>{selectedService?.name}</Text>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
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
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>Request Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              height: 50,
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: SIZES.radius,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => {/* Add view more action here */ }}
          >
            <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>View More</Text>
          </TouchableOpacity>
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
          backgroundColor: COLORS.gray90
        }}
      >
        <ImageBackground
          // source={selectedService?.imageUrl}
          src="https://daihoc.fpt.edu.vn/templates/fpt-university/images/header.jpg"
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
      </View>
    )
  }

  function renderContent() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            height: 50
          }}
        >
          <Tabs
            scrollX={scrollX}
            onTabPress={onTabPress}
          />
        </View>

        <LineDivider
          lineStyle={{
            backgroundColor: COLORS.gray20
          }}
        />

        <Animated.FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          snapToAlignment='center'
          snapToInterval={SIZES.width}
          decelerationRate='fast'
          keyboardDismissMode='on-drag'
          showsHorizontalScrollIndicator={false}
          data={constants.course_details_tabs}
          keyExtractor={item => `CourseDetailTabs-${item.id}`}
          onScroll={
            Animated.event([
              {
                nativeEvent: { contentOffset: { x: scrollX } }
              }
            ],
              {
                useNativeDriver: false
              })
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: SIZES.width
                }}
              >
                {index == 0 && <ServiceDescription selectedService={selectedService} />}
                {index == 1 && <Feedback />}
                {index == 2 && <Discussion />}
              </View>
            )
          }}
        />
      </View>
    )
  }

  function renderBottomSheet() {
    return (
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={['50%', '80%']} enablePanDownToClose={true}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Request Form</Text>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe your request"
            value={form.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />

          {/* File Upload */}
          <Text style={styles.sectionTitle}>Upload File</Text>
          <TouchableOpacity style={styles.fileUploadButton}>
            <Text style={styles.fileUploadText}>Upload Image</Text>
          </TouchableOpacity>

          {form.file && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: form.file }} style={styles.imagePreview} />
            </View>
          )}

          {/* Payment Method */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                form.paymentMethod === 'Wallet' && styles.selectedPaymentOption,
              ]}
              onPress={() => handleInputChange('paymentMethod', 'Wallet')}
            >
              <Text style={[styles.paymentOptionText, form.paymentMethod === 'Wallet' && styles.selectedWalletText]}>Pay by Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                form.paymentMethod === 'Cash' && styles.selectedPaymentOption,
              ]}
              onPress={() => handleInputChange('paymentMethod', 'Cash')}
            >
              <Text style={[styles.paymentOptionText, form.paymentMethod === 'Cash' && styles.selectedWalletText]}>Pay by Cash</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TextButton
            label="Submit"
            contentContainerStyle={{
              height: 60,
              marginTop: 100
            }}
            labelStyle={{
              ...FONTS.h2
            }}
            onPress={handleSubmit}
          />
        </View>
      </BottomSheet>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white
      }}
    >
      {renderHeader()}
      {renderTop()}
      {renderScholarshipInfo()}
      {renderContent()}
      {renderBottomSheet()}
    </View>
  )
}

export default ServiceDetail;

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    padding: 20,
  },
  sheetTitle: {
    ...FONTS.h1,
    marginBottom: 10,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginTop: 20,
    marginBottom: 10,
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray20,
    borderRadius: SIZES.radius,
    padding: 10,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  fileUploadButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  fileUploadText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  imagePreviewContainer: {
    marginTop: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray20,
    borderRadius: SIZES.radius,
  },
  imagePreview: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  paymentTitle: {
    marginTop: 20,
    ...FONTS.h3,
  },
  paymentOptions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  paymentOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.gray20,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPaymentOption: {
    backgroundColor: 'rgba(66,198,165, 0.3)',
    borderColor: COLORS.primary,
    borderWidth: 2
  },
  paymentOptionText: {
    color: COLORS.black,
    ...FONTS.body3,
  },
  selectedWalletText: {
    color: COLORS.gray80,
    ...FONTS.body3,
  },
  paymentDescription: {
    marginTop: 20,
    ...FONTS.body2,
    color: COLORS.black,
  },
});