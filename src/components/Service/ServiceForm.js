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
  const bottomSheetRef = useRef(null);
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
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <View style={styles.container}>
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
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '80%']}
        enablePanDownToClose={true}
      >
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>Submit Form</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={form.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={form.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Message"
            value={form.message}
            onChangeText={(text) => handleInputChange('message', text)}
            multiline={true}
            numberOfLines={4}
          />
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
