import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, runTransaction, push } from 'firebase/database';
import AntDesign from 'react-native-vector-icons/AntDesign';
const AddAmount = ({ navigation, route }) => {
  const { user } = route.params;
  const [amount, setAmount] = useState('');
  const db = getDatabase();

  const handleAddAmount = () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric amount.');
      return;
    }

    const distributionEntry = {
      amount: amount,
      Type:'Refferal Bonus',
      date: new Date().toLocaleDateString(), // Format the date as desired
      time: new Date().toLocaleTimeString(), // Format the time as desired
    };

    const userRef = ref(db, `users/${user.username}`);
    runTransaction(userRef, (userData) => {
      if (userData) {
        // Update user's balance and earnings
        userData.balance = (userData.balance || 0) + parseFloat(amount);
        userData.refferalEarning = (userData.refferalEarning || 0) + parseFloat(amount);
      }
      return userData;
    })
      .then(() => {
        push(ref(db, (`users/${user.username}/history`)), distributionEntry);
        Alert.alert('Amount Added', `Successfully added $${amount} to ${user.username}'s balance and earnings.`);
        setAmount('');
      })
      .catch((error) => {
        console.error('Transaction failed: ', error);
        Alert.alert('Error', 'Failed to add amount. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
        <AntDesign
        name="left"
        style={{ marginTop: 35, marginBottom: 20 }}
        size={24}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>Add Amount to {user.username}'s Earning</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddAmount}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddAmount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius:10,
    alignSelf:'center'
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
