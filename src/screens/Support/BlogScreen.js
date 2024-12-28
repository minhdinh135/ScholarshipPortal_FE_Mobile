import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const ScholarshipBlogPost = () => {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/scholarship-image.jpg' }}
        style={styles.image}
      />
      <Text style={styles.title}>Scholarship Opportunities for 2024</Text>
      <Text style={styles.date}>December 19, 2024</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.paragraph}>
          Scholarships are an excellent way for students to fund their education.
          Whether you are pursuing a degree in science, arts, or technology, many organizations
          offer financial assistance. In this post, we explore some of the top scholarship
          opportunities available for the upcoming year. Stay tuned as we break down how to
          apply, eligibility criteria, and deadlines to help you get started on your educational journey.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  contentContainer: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default ScholarshipBlogPost;
