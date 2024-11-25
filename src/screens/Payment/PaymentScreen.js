// import React, { useState } from 'react';
// import { View, Button, Alert } from 'react-native';
// import axios from 'axios';
// import { WebView } from "react-native-webview";
// import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

// const PaymentScreen = () => {
//   const [invoiceUrl, setInvoiceUrl] = useState(null);
//   const [amount, setAmount] = useState(1000);

//   const { initPaymentSheet, presentPaymentSheet } = useStripe();

//   const createInvoice = async () => {
//     console.log("XẪ: ");
//     try {
//       const response = await axios.post('${process.env.BASE_URL}/api/payments/create-invoice', { accountId: "13", amount });
//       console.log("XXXÂXẪ: ", response.data);
//       const { error: paymentError } = await presentPaymentSheet();
//       if (response.data && response.data.data) {
//         setInvoiceUrl(response.data.data);
//         console.log("x: ", response);

//       } else {
//         Alert.alert("Error", "Failed to create invoice");
//       }
//     } catch (error) {
//       console.error("Error creating invoice:", error);
//       Alert.alert("Error", "Something went wrong");
//     }
//   };

//   if (invoiceUrl) {
//     return (
//       <View style={{ flex: 1 }}>
//         <WebView
//           source={{ uri: invoiceUrl }}
//           onNavigationStateChange={(navState) => {
//             if (navState.url.includes('success')) {
//               Alert.alert("Payment Successful", "Thank you for your payment!");
//               setInvoiceUrl(null);
//             } else if (navState.url.includes('cancel')) {
//               Alert.alert("Payment Cancelled", "The payment was cancelled.");
//               setInvoiceUrl(null);
//             }
//           }}
//           style={{ flex: 1, marginTop: 20 }}
//         />
//       </View>
//     );
//   }

//   return (
//     <StripeProvider publishableKey={process.env.VITE_STRIPE_PUBLISHABLE_KEY}>
//       <View style={{ flex: 1, marginTop: "100px" }}>
//         <Button title="Pay Now" onPress={createInvoice} />
//       </View>
//     </StripeProvider>
//   );
// };

// export default PaymentScreen;

// import React, { useState } from 'react';
// import { View, Button, Alert } from 'react-native';
// import axios from 'axios';
// import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

// const PaymentScreen = () => {
//   const [amount, setAmount] = useState(100);
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();

//   // Function to create payment intent
//   const createInvoice = async () => {
//     console.log("Creating invoice...", amount);
//     try {
//       const response = await axios.post(`${process.env.BASE_URL}/api/payments/stripe-checkout`, {
//         senderId: 13,
//         receiverId: 12,
//         amount: amount,
//         description: "Test Mobile Payment"
//       });

//       if (response.data && response.data.clientSecret) {
//         const { clientSecret } = response.data;

//         // Initialize the Payment Sheet with the client secret
//         const { error: initError } = await initPaymentSheet({
//           paymentIntentClientSecret: clientSecret,
//         });

//         if (initError) {
//           console.log("Error initializing payment sheet:", initError);
//           Alert.alert("Error", "Failed to initialize payment sheet.");
//           return;
//         }

//         // Present the Payment Sheet to the user
//         const { error, paymentIntent } = await presentPaymentSheet();

//         if (error) {
//           console.log("Payment failed:", error);
//           Alert.alert("Payment Failed", "Something went wrong with the payment.");
//         } else {
//           // Check if payment was successful
//           if (paymentIntent.status === 'succeeded') {
//             Alert.alert("Payment Successful", "Thank you for your payment!");
//           } else {
//             Alert.alert("Payment Failed", "Your payment did not go through.");
//           }
//         }
//       } else {
//         Alert.alert("Error", "Failed to create invoice.");
//       }
//     } catch (error) {
//       console.error("Error creating invoice:", error);
//       Alert.alert("Error", "Something went wrong.");
//     }
//   };

//   return (
//     <StripeProvider publishableKey={process.env.VITE_STRIPE_PUBLISHABLE_KEY}>
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Button title="Pay Now" onPress={createInvoice} />
//       </View>
//     </StripeProvider>
//   );
// };

// export default PaymentScreen;

import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import axios from 'axios';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as WebBrowser from 'expo-web-browser';

const PaymentScreen = () => {
  const [amount, setAmount] = useState(100);

  // Function to create payment intent
  const createInvoice = async () => {
    console.log("Creating invoice...", amount);
    try {
      const response = await axios.post(`${process.env.BASE_URL}/api/payments/stripe-checkout`, {
        senderId: 13,
        receiverId: 12,
        amount: amount,
        description: "Test Mobile Payment"
      })

      if (response.data && response.data.data.sessionUrl) {
        const { sessionUrl } = response.data.data;

        // Open the checkout URL in a web browser
        const result = await WebBrowser.openBrowserAsync(sessionUrl);

        if (result.type === 'cancel') {
          Alert.alert("Payment Cancelled", "You cancelled the payment.");
        } else {
          Alert.alert("Payment Successful", "Thank you for your payment!");
        }
      } else {
        Alert.alert("Error", "Failed to create invoice.");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <StripeProvider publishableKey={process.env.VITE_STRIPE_PUBLISHABLE_KEY}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Pay Now" onPress={createInvoice} />
      </View>
    </StripeProvider>
  );
};

export default PaymentScreen;
