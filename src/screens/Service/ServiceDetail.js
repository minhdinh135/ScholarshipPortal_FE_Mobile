import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet, Animated,
  TextInput,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import {
  IconButton,
  LineDivider,
} from "../../components/Card";
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as DocumentPicker from "expo-document-picker";
import { COLORS, FONTS, SIZES, icons, constants } from '../../constants';
import ServiceDescription from '../../components/Service/ServiceDescription';
import { useAuth } from '../../context/AuthContext';
import { getWalletById } from '../../api/walletApi';
import { transferMoney } from '../../api/paymentApi';
import ServiceFeedback from '../../components/Service/ServiceFeedback';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { sendRequest } from '../../api/requestApi';
import { sendNotificationProvider } from '../../api/notificationApi';

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
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [form, setForm] = useState({
    senderId: '',
    receiverId: '',
    description: '',
    amount: selectedService.price,
    paymentMethod: '',
  });

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
  )

  const getWalletInformation = async () => {
    setLoading(true);
    try {
      const [userWallet, providerWallet] = await Promise.all([
        getWalletById(userInfo.id),
        getWalletById(selectedService.providerId),
      ]);
      setForm((prevForm) => ({
        ...prevForm,
        senderId: userWallet.data.accountId,
        receiverId: providerWallet.data.accountId,
      }));
      return { userWallet, providerWallet };
    } catch (error) {
      console.log('Error fetching wallet information:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.id && selectedService?.providerId) {
      getWalletInformation();
    }
  }, [userInfo?.id, selectedService?.providerId]);

  const onTabPress = React.useCallback((tabIndex) => {
    flatListRef?.current?.scrollToOffset({ offset: tabIndex * SIZES.width });
  });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleUploadFile = async () => {
    setLoading(true);
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
            if (isImage) {
              setImagePreview(responseJson.data[0]);
            }
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { userWallet } = await getWalletInformation();
      const userBalance = userWallet.data.balance;
      if (selectedService.price > userBalance) {
        return Alert.alert(
          'Insufficient Balance',
          'Your wallet balance is not enough to proceed with this request. Please top up your wallet or choose a different payment method.'
        );
      }
      await transferMoney(form);
      const requestData = {
        description: form.description,
        applicantId: form.senderId,
        serviceIds: [selectedService.id],
        requestFileUrls: [imagePreview],
      };
      await Promise.all([
        sendRequest(requestData),
        sendNotificationProvider(userInfo.id, selectedService.id)
      ]);
      Alert.alert('Success', 'Your request has been submitted successfully.', [
        {
          text: 'OK',
          onPress: () => {
            bottomSheetRef.current?.close();
            resetFormAndImagePreview();
          },
        },
      ]);
    } catch (error) {
      console.error('Submission Error:', error);
      Alert.alert('Error', 'There was an issue submitting your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFormAndImagePreview = () => {
    setForm((prevForm) => ({
      ...prevForm,
      description: '',
      paymentMethod: '',
    }));
    setImagePreview([]);
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

  function renderServiceInfo() {
    return (
      <View style={{
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
      }}>
        <Text style={{ ...FONTS.h2, paddingTop: SIZES.padding }}>{selectedService?.name}</Text>
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
          src="https://images.stockcake.com/public/6/d/8/6d8cc8ae-69d2-4a38-842f-ad2deaa9ba4f_large/writing-on-paper-stockcake.jpg"
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
                {index == 0 && <ServiceDescription selectedService={selectedService} navigation={navigation} />}
                {index == 1 && <ServiceFeedback />}
              </View>
            )
          }}
        />
      </View>
    )
  }

  function renderBottomSheet() {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '80%']}
        enablePanDownToClose={true}
        handleComponent={null}
        backdropComponent={renderBackdrop}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sheetTitle}>Request Form</Text>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe your request"
            value={form.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline={true}
            numberOfLines={5}
          />
          <Text style={styles.sectionTitle}>Upload File</Text>
          {imagePreview.length > 0 ? (<></>) : (
            <>
              <TouchableOpacity style={styles.fileUploadButton} onPress={handleUploadFile}>
                <Text style={styles.fileUploadText}>Upload Image</Text>
              </TouchableOpacity>
            </>
          )}
          {imagePreview.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imagePreview }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImagePreview([])}
              >
                <Ionicons name="close-circle" size={24} color={COLORS.gray80} />
              </TouchableOpacity>
            </View>
          )}
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
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              height: 60,
              marginTop: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.primary,
              borderRadius: SIZES.radius
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.white} />
            ) : (
              <Text style={{ ...FONTS.h2, color: COLORS.white }}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>
    );
  }

  function renderLoadingScreen() {
    if (!loading) return null;

    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white
      }}
    >
      {renderLoadingScreen()}
      {renderHeader()}
      {renderTop()}
      {renderServiceInfo()}
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
    marginVertical: 10,
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
    height: 100,
    textAlignVertical: 'top'
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
    position: 'relative',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 5,
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});