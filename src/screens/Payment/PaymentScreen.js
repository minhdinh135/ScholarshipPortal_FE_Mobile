import React, { useState } from "react";
import { View, Button, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { StripeProvider } from "@stripe/stripe-react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "../../constants";

const BASE_URL = process.env.BASE_URL;

const PaymentScreen = ({ navigation }) => {
  const [amount, setAmount] = useState(100);
  const [sessionUrl, setSessionUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const createInvoice = async () => {
    console.log("Creating invoice...", amount);
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/payments/stripe-checkout`,
        {
          senderId: 13,
          receiverId: 13,
          amount: amount,
          description: "Test Mobile Payment",
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

  return (
    <StripeProvider publishableKey={process.env.VITE_STRIPE_PUBLISHABLE_KEY}>
      <View style={{ flex: 1 }}>
        {sessionUrl ? (
          <WebView
            source={{ uri: sessionUrl }}
            onNavigationStateChange={(navState) => {
              // Detect completion or cancellation based on the URL
              if (navState.url.includes("success")) {
                // Alert.alert("Payment Successful", "Thank you for your payment!");
                setSessionUrl(null);
                navigation.navigate("PaymentSuccessScreen");
              } else if (navState.url.includes("cancel")) {
                // Alert.alert("Payment Cancelled", "You cancelled the payment.");
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
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <Button title="Pay Now" onPress={createInvoice} />
            )}
          </View>
        )}
      </View>
    </StripeProvider>
  );
};

export default PaymentScreen;
