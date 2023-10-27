// AboutUs.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue, off } from 'firebase/database';


const AboutUs = ({ navigation }) => {
  const [aboutUsContent, setAboutUsContent] = useState("Loading About Us...");

  // Function to fetch and update "About Us" content from Firebase
  useEffect(() => {
    const db = getDatabase();
    const aboutUsRef = ref(db, 'aboutus'); // Replace with your Firebase Realtime Database reference

    onValue(aboutUsRef, (snapshot) => {
      if (snapshot.exists()) {
        const content = snapshot.val();
        setAboutUsContent(content);
      } else {
        setAboutUsContent("About Us content not found.");
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(aboutUsRef);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 20, alignItems: 'center', justifyContent:'space-between' }}>
        <AntDesign name='left' style={{}} size={24} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 20, marginLeft: 20, fontWeight: '500' }}>About Us</Text>
        <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.aboutUsText}>{aboutUsContent}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#3498db',
  },
  scrollContainer: {
    flex: 1,
  },
  aboutUsText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default AboutUs;
