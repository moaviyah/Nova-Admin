import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { background, primary } from '../color';

const OneTimePercentage = ({navigation}) => {
  const db = getDatabase();
  const oneTimeReferralPercentageRef = ref(db, 'oneTimeRefferalPayment');

  const [percentage, setPercentage] = useState('');
  const [currentPercentage, setCurrentPercentage] = useState('');

  // Fetch the current percentage from Firebase when the component mounts
  useEffect(() => {
    onValue(oneTimeReferralPercentageRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentPercentage(snapshot.val().percentage);
      }
    });
  }, []);

  const handleSavePercentage = () => {
    // Validate that the input is a valid number between 0 and 100
    const parsedPercentage = parseFloat(percentage);
    if (isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
      Alert.alert('Invalid Percentage', 'Please enter a valid percentage between 0 and 100.');
      return;
    }

    // Update the percentage in Firebase
    set(oneTimeReferralPercentageRef, {
      percentage: parsedPercentage,
    })
      .then(() => {
        Alert.alert('Percentage Updated', 'The percentage has been updated successfully.');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to update percentage. Please try again.');
      });

    // Clear the input field
    setPercentage('');
  };

  return (
    <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30, }}>
                <AntDesign name='left' style={{}} size={24} onPress={() => navigation.goBack()} />
                <Text style={{ fontSize: 22, marginLeft: 10 }}>Admin Dashboard</Text>
            </View>
      <Text style={styles.label}>Current Percentage: {currentPercentage}%</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new percentage"
        keyboardType="numeric"
        onChangeText={(text) => setPercentage(text)}
        value={percentage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSavePercentage}>
        <Text style={styles.buttonText}>Save Percentage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:background
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: primary,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default OneTimePercentage;
