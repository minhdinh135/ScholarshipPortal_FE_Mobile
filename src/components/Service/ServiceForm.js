// import React, { useRef, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import BottomSheet from '@gorhom/bottom-sheet';
// import * as ImagePicker from 'expo-image-picker'; // Ensure Expo ImagePicker is installed
// import { COLORS, FONTS, SIZES } from '../../constants'; // Adjust the paths as needed

// const ServiceForm = ({ navigation, route }) => {
//   const bottomSheetRef = useRef(null);
//   const [description, setDescription] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState('Credit Card');
//   const [paymentDescription, setPaymentDescription] = useState('');

//   const snapPoints = ['50%', '90%']; // Bottom sheet snap points

//   // File upload handler
//   const handleImagePick = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
//         <View style={styles.sheetContent}>
//           {/* Description */}
//           <Text style={styles.label}>Description</Text>
//           <TextInput
//             style={styles.textInput}
//             placeholder="Enter your description"
//             multiline
//             value={description}
//             onChangeText={setDescription}
//           />

//           {/* File Upload */}
//           <Text style={styles.label}>Upload File</Text>
//           <TouchableOpacity style={styles.uploadButton} onPress={handleImagePick}>
//             <Text style={styles.uploadText}>Choose File</Text>
//           </TouchableOpacity>
//           {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}

//           {/* Payment Method */}
//           <Text style={styles.label}>Payment Method</Text>
//           <View style={styles.paymentOptions}>
//             <TouchableOpacity
//               style={[
//                 styles.paymentOption,
//                 paymentMethod === 'Credit Card' && styles.selectedOption,
//               ]}
//               onPress={() => setPaymentMethod('Credit Card')}
//             >
//               <Text
//                 style={[
//                   styles.paymentOptionText,
//                   paymentMethod === 'Credit Card' && styles.selectedText,
//                 ]}
//               >
//                 Credit Card
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.paymentOption,
//                 paymentMethod === 'Cash' && styles.selectedOption,
//               ]}
//               onPress={() => setPaymentMethod('Cash')}
//             >
//               <Text
//                 style={[
//                   styles.paymentOptionText,
//                   paymentMethod === 'Cash' && styles.selectedText,
//                 ]}
//               >
//                 Cash
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Payment Description */}
//           <Text style={styles.label}>Payment Description</Text>
//           <TextInput
//             style={styles.textInput}
//             placeholder="Enter payment details"
//             multiline
//             value={paymentDescription}
//             onChangeText={setPaymentDescription}
//           />

//           {/* Buttons */}
//           <View style={styles.buttonRow}>
//             <TouchableOpacity
//               style={[styles.button, { backgroundColor: COLORS.primary }]}
//               onPress={() => {
//                 // Submit logic
//                 console.log({
//                   description,
//                   selectedImage,
//                   paymentMethod,
//                   paymentDescription,
//                 });
//               }}
//             >
//               <Text style={styles.buttonText}>Submit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.button, { backgroundColor: COLORS.gray20 }]}
//               onPress={() => navigation.goBack()}
//             >
//               <Text style={[styles.buttonText, { color: COLORS.black }]}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </BottomSheet>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   sheetContent: {
//     padding: SIZES.padding,
//   },
//   label: {
//     ...FONTS.h3,
//     color: COLORS.black,
//     marginBottom: 5,
//   },
//   textInput: {
//     height: 60,
//     borderColor: COLORS.gray20,
//     borderWidth: 1,
//     borderRadius: SIZES.radius,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     ...FONTS.body3,
//   },
//   uploadButton: {
//     height: 50,
//     backgroundColor: COLORS.primary,
//     borderRadius: SIZES.radius,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   uploadText: {
//     color: COLORS.white,
//     ...FONTS.body3,
//   },
//   imagePreview: {
//     width: '100%',
//     height: 150,
//     borderRadius: SIZES.radius,
//     marginTop: 10,
//     resizeMode: 'contain',
//   },
//   paymentOptions: {
//     flexDirection: 'row',
//     marginBottom: 15,
//   },
//   paymentOption: {
//     flex: 1,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.gray20,
//     borderRadius: SIZES.radius,
//     marginRight: 10,
//   },
//   selectedOption: {
//     backgroundColor: COLORS.primary,
//   },
//   paymentOptionText: {
//     ...FONTS.body3,
//     color: COLORS.black,
//   },
//   selectedText: {
//     color: COLORS.white,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     flex: 1,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: SIZES.radius,
//     marginHorizontal: 5,
//   },
//   buttonText: {
//     color: COLORS.white,
//     ...FONTS.h3,
//   },
// });

// export default ServiceForm;

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const ProductScreen = () => {
  const bottomSheetRef = useRef(null); // Reference for the Bottom Sheet
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (field, value) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form Submitted:', form);
    bottomSheetRef.current?.close();
    setForm({ name: '', email: '', message: '' }); // Reset form
  };

  return (
    <View style={styles.container}>
      {/* Product Information */}
      <View style={styles.productInfo}>
        <Text style={styles.title}>Product Name</Text>
        <Text style={styles.description}>
          This is an amazing product with awesome features. Click the button below to submit a form.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => bottomSheetRef.current?.expand()}
        >
          <Text style={styles.buttonText}>Open Form</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '80%']}
        enablePanDownToClose={true}
      >
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>Submit Form</Text>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={form.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={form.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />

          {/* Message Input */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Message"
            value={form.message}
            onChangeText={(text) => handleInputChange('message', text)}
            multiline={true}
            numberOfLines={4}
          />

          {/* Submit Button */}
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </BottomSheet>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  productInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetContainer: {
    flex: 1,
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
  },
});
