import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, set, onValue , off} from 'firebase/database';

const ManagePrivacyPolicy = ({ navigation }) => {
  const [userAgreement, setUserAgreement] = useState("Loading User Agreement...");

  // Function to save the edited User Agreement
  const saveUserAgreement = () => {
    // Get a reference to the Firebase Realtime Database
    const db = getDatabase();
    const userAgreementRef = ref(db, 'privacypolicy'); // Replace with your Firebase Realtime Database reference

    // Update the User Agreement text in the database
    set(userAgreementRef, userAgreement)
      .then(() => {
        console.log('User Agreement saved successfully.');
        // After saving, you can navigate back to the previous screen.
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Error saving User Agreement:', error);
        // Handle the error
      });
  };

  // Function to fetch and update User Agreement from Firebase
  useEffect(() => {
    const db = getDatabase();
    const userAgreementRef = ref(db, 'privacypolicy'); // Replace with your Firebase Realtime Database reference

    onValue(userAgreementRef, (snapshot) => {
      if (snapshot.exists()) {
        const agreementText = snapshot.val();
        setUserAgreement(agreementText);
      } else {
        setUserAgreement("Privacy Policy not found.");
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(userAgreementRef);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage User Agreement</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={10}
          value={userAgreement}
          onChangeText={(text) => setUserAgreement(text)}
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={saveUserAgreement}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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
  },
  scrollContainer: {
    flex: 1,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    minHeight: 300, // Minimum height for the TextInput
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManagePrivacyPolicy;
