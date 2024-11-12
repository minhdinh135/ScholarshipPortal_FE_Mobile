import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import axios from 'axios';
import { WebView } from "react-native-webview";
import { StripeProvider } from '@stripe/stripe-react-native';

const PaymentScreen = () => {
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [amount, setAmount] = useState(1000);

  const createInvoice = async () => {
    console.log("XẪ: ");
    try {
      const response = await axios.post('http://10.0.2.2:5254/api/payments/create-invoice', { accountId: "13", amount });
      console.log("XXXÂXẪ: ", response.data);

      if (response.data && response.data.data) {
        setInvoiceUrl(response.data.data);
        console.log("x: ", response);

      } else {
        Alert.alert("Error", "Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  if (invoiceUrl) {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: invoiceUrl }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('success')) {
              Alert.alert("Payment Successful", "Thank you for your payment!");
              setInvoiceUrl(null);
            } else if (navState.url.includes('cancel')) {
              Alert.alert("Payment Cancelled", "The payment was cancelled.");
              setInvoiceUrl(null);
            }
          }}
          style={{ flex: 1, marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={process.env.VITE_STRIPE_PUBLISHABLE_KEY}>
      <View style={{ flex: 1, marginTop: "100px" }}>
        <Button title="Pay Now" onPress={createInvoice} />
      </View>
    </StripeProvider>
  );
};

export default PaymentScreen;
