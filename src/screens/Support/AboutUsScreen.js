import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { COLORS, FONTS, icons } from '../../constants';
import { IconButton } from '../../components/Card';

const AboutUsScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={{ uri: 'https://scholarship-portal-nu.vercel.app/assets/AboutUs-2rtciBUv.png' }}
        style={styles.headerImage}
      >
        <IconButton
          icon={icons.back}
          iconStyle={{
            width: 30,
            height: 30,
            tintColor: COLORS.black,
          }}
          containerStyle={{
            width: 60,
            height: 60,
            top: 15,
            left: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            backgroundColor: COLORS.white,
          }}
          onPress={() => navigation.goBack()}
        />
      </ImageBackground>

      <View style={{ padding: 20 }}>
        <Text style={styles.title}>About Us</Text>

        <Text style={styles.paragraph}>
          At the Scholarship Search and Application Portal (SSAP), we believe that every student deserves the opportunity to pursue their academic dreams. Our mission is to simplify the scholarship search and application process, making it accessible and efficient for students worldwide.
        </Text>

        <Text style={styles.paragraph}>
          With our user-friendly platform, students can easily find scholarships tailored to their needs, apply confidently, and track their application status. We also provide scholarship providers with robust tools to manage applications and allocate funds effectively, ensuring that deserving students receive the support they need.
        </Text>

        <Text style={styles.paragraph}>
          Explore our platform today and take the first step towards achieving your academic goals. Together, we can make a difference in the lives of students everywhere!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  title: {
    ...FONTS.title,
    textAlign: 'center',
    color: COLORS.primary,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    color: '#555',
    marginBottom: 12,
  },
});

export default AboutUsScreen;
