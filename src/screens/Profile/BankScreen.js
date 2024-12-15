import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { COLORS, SIZES, FONTS, icons, images } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { IconButton } from '../../components/Card';
import { getWalletById } from '../../api/walletApi';

const BankScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const getWalletInformation = async () => {
    setLoading(true);
    try {
      const walletResponse = await getWalletById(userInfo.id);
      setWallet(walletResponse.data || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWalletInformation();
  }, [userInfo.id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={icons.back}
          iconStyle={{ tintColor: COLORS.black }}
          containerStyle={styles.iconButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Bank Information</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : wallet ? (
        <>
          <ImageBackground
            source={images.bg_1}
            style={styles.card}
            imageStyle={{ borderRadius: 12 }}
          >
            <Text style={styles.bankName}>Bank Information</Text>
            <Text style={styles.cardNumber}>
              {wallet.bankAccountNumber?.replace(/(.{4})(?=.)/g, '$1 ')}42
            </Text>
            <Text style={styles.cardHolderName}>{wallet.bankAccountName}</Text>
          </ImageBackground>
          <View style={styles.editCardContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Card Number"
              value={wallet.bankAccountNumber?.replace(/(.{4})(?=.)/g, '$1 ')}
              editable={false}
            />

            <Text style={styles.inputLabel}>Card Holder Name</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Card Holder Name"
              value={wallet.bankAccountName}
              editable={false}
            />
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addCardContainer}>
            <TouchableOpacity style={styles.addCardButton}>
              <Text style={styles.addCardText}>+ Add a New Card</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noWalletContainer}>
          <Text style={styles.noWalletText}>You haven't created a wallet yet.</Text>
          <TouchableOpacity style={styles.createWalletButton}>
            <Text style={styles.createWalletText}>Create Wallet Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  header: {
    marginHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 40,
    ...FONTS.h2,
  },
  iconButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 200,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  bankName: {
    color: COLORS.white,
    ...FONTS.h2,
  },
  cardNumber: {
    color: COLORS.white,
    fontSize: 20,
    letterSpacing: 2,
    marginVertical: 10,
  },
  cardHolderName: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  editCardContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  inputLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 5,
  },
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: COLORS.white,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  addCardContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCardText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  noWalletContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noWalletText: {
    ...FONTS.h2,
    color: COLORS.gray80,
    textAlign: 'center',
    marginBottom: 20,
  },
  createWalletButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createWalletText: {
    color: COLORS.white,
    ...FONTS.body3,
  },
});

export default BankScreen;
