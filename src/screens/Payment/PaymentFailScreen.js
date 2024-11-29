import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { TextButton } from '../../components/Card';
import { COLORS, FONTS, images, SIZES } from '../../constants';

const PaymentFailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={images.ex_mark}
        style={styles.icon}
      />
      <Text style={styles.title}>PAYMENT FAILED!</Text>
      <Text style={styles.message}>Please try again or contact us.</Text>
      <TextButton
        label="Return Home"
        contentContainerStyle={{
          height: 40,
          paddingHorizontal: SIZES.padding,
          borderRadius: 20,
          backgroundColor: COLORS.primary3,
          marginTop: 40,
        }}
        labelStyle={{
          color: COLORS.white,
          ...FONTS.h3
        }}
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    width: 200,
    height: 200,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.secondary,
    marginBottom: 10
  },
  message: {
    ...FONTS.body2,
    color: COLORS.gray70,
    marginBottom: 20,
  },
});

export default PaymentFailScreen;
