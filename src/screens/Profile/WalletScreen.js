import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, images, icons } from '../../constants';
import { IconButton } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { getWalletById } from '../../api/walletApi';
import { StripeProvider } from '@stripe/stripe-react-native';
import { WebView } from "react-native-webview";
import axios from 'axios';
import { getTransactionByWalletId } from '../../api/paymentApi';

const WalletScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [sessionUrl, setSessionUrl] = useState(null);
  const [wallet, setWallet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getWalletInformation = async () => {
    setLoading(true);
    try {
      const [walletResponse, transactionResponse] = await Promise.all([
        getWalletById(userInfo.id),
        getTransactionByWalletId(wallet.id)
      ]);

      setWallet(walletResponse.data || []);
      setTransactions(transactionResponse.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWalletInformation();
  }, [userInfo.id]);

  const addMoney = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.BASE_URL}/api/payments/stripe-checkout`,
        {
          senderId: userInfo.id,
          receiverId: userInfo.id,
          amount: amount,
          description: "Add money to wallet",
        },
      );

      if (response.data && response.data.data.sessionUrl) {
        setSessionUrl(response.data.data.sessionUrl);
      } else {
        Alert.alert("Error", "Failed to create invoice.");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = () => {
    setIsModalVisible(true);
  };

  const confirmAddMoney = () => {
    if (amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    setIsModalVisible(false);
    addMoney();
  };

  const renderTransaction = ({ item }) => {
    const isReceiver = item.walletReceiverId === wallet.id;

    return (
      <View style={styles.transactionContainer}>
        <Text style={{ ...FONTS.body3, color: COLORS.gray70 }}>{item.description}</Text>
        <Text
          style={{
            ...FONTS.body3,
            fontWeight: 'bold',
            color: isReceiver ? COLORS.primary : COLORS.secondary,
          }}
        >
          {isReceiver ? `+$${item.amount}` : `-$${item.amount}`}
        </Text>
      </View>
    );
  };

  return (
    <StripeProvider publishableKey={process.env.VITE_STRIPE_PUBLISHABLE_KEY}>
      <View style={{ flex: 1 }}>
        {sessionUrl ? (
          <WebView
            source={{ uri: sessionUrl }}
            onNavigationStateChange={(navState) => {
              if (navState.url.includes("success")) {
                setSessionUrl(null);
                navigation.navigate("PaymentSuccessScreen");
              } else if (navState.url.includes("cancel")) {
                setSessionUrl(null);
                navigation.navigate("PaymentFailScreen");
              }
            }}
            onError={(error) => {
              console.error("WebView Error:", error);
              Alert.alert("Error", "Failed to load payment session.");
              setSessionUrl(null);
            }}
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: COLORS.white }}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ ...FONTS.body3, color: COLORS.gray70, marginTop: 10 }}>Loading...</Text>
              </View>
            ) : (
              <>
                <ImageBackground
                  source={images.featured_bg_image}
                  style={styles.backgroundImage}
                  imageStyle={{ resizeMode: 'cover' }}
                >
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton
                      icon={icons.back}
                      iconStyle={{ tintColor: COLORS.black }}
                      containerStyle={styles.iconButton}
                      onPress={() => navigation.goBack()}
                    />
                    <Text style={{ color: COLORS.white, ...FONTS.h2, marginVertical: 30 }}>My Wallet</Text>
                    <Text style={{ color: COLORS.white, ...FONTS.largeTitle }}>${wallet?.balance.toLocaleString()}</Text>
                    <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Total Balance</Text>

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddMoney}
                      >
                        <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Add Money</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.withdrawButton}
                        onPress={() => console.log('Withdraw pressed')}
                      >
                        <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Withdraw</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>

                <View style={styles.transactionContainerWrapper}>
                  <Text style={{ ...FONTS.h2, color: COLORS.gray80, marginBottom: 10 }}>Transactions</Text>
                  <FlatList
                    data={transactions}
                    renderItem={renderTransaction}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ marginTop: 10 }}
                  />
                </View>
              </>
            )}
          </View>
        )}

        {/* Modal for Adding Money */}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ ...FONTS.h2, color: COLORS.black }}>Enter Amount</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor={COLORS.gray70}
                onChangeText={(value) => setAmount(Number(value))}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={{ color: COLORS.white }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.okButton} onPress={confirmAddMoney}>
                  <Text style={{ color: COLORS.white }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  transactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
    width: '100%',
  },
  iconButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  withdrawButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  transactionContainerWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: COLORS.gray70,
    marginTop: 20,
    padding: 10,
    ...FONTS.body3,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  okButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
});

export default WalletScreen;
