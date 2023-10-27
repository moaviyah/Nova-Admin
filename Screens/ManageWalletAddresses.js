import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const ManageWalletAddresses = ({ navigation }) => {
  const [walletAddresses, setWalletAddresses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateDate, setLastUpdateDate] = useState(null);
  const [remainingDays, setRemainingDays] = useState(null); // State for remaining days

  useEffect(() => {
    const db = getDatabase();
    const walletRef = ref(db, 'addresses');
    onValue(walletRef, (snapshot) => {
      if (snapshot.exists()) {
        const addressesData = snapshot.val();
        setWalletAddresses(addressesData);
        setLastUpdateDate(addressesData.lastUpdateDate || null); // Set last update date
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    // Calculate remaining days if lastUpdateDate is set
    if (lastUpdateDate) {
      const currentDate = new Date();
      const differenceInTime = currentDate - new Date(lastUpdateDate);
      const daysPassed = differenceInTime / (1000 * 3600 * 24);
      const remainingDays = 15 - daysPassed;
      setRemainingDays(remainingDays.toFixed());
    }
  }, [lastUpdateDate]);

  const handleSave = () => {
    const db = getDatabase();
    const walletRef = ref(db, 'addresses');

    // Check if 15 days have passed since the last update
    if (hasFifteenDaysPassed(lastUpdateDate)) {
      // Save the current date and time
      const currentDate = new Date().toISOString();
      const updatedAddresses = { ...walletAddresses, lastUpdateDate: currentDate };

      set(walletRef, updatedAddresses)
        .then(() => {
          alert('Wallet addresses updated successfully.');
          setWalletAddresses(updatedAddresses); // Update the local state
          setLastUpdateDate(currentDate); // Update last update date
          setRemainingDays(15); // Reset remaining days
        })
        .catch((error) => {
          console.error('Error updating wallet addresses:', error);
          alert('Failed to update wallet addresses. Please try again later.');
        });
    } else {
      alert('You can update the addresses once every 15 days.');
    }
  };

  const handleEditAddress = (chain, text) => {
    setWalletAddresses({
      ...walletAddresses,
      [chain]: { wallet: text },
    });
  };

  // Function to check if 15 days have passed
  const hasFifteenDaysPassed = (lastUpdateDate) => {
    if (!lastUpdateDate) return true; // If there's no last update date, allow updating
    const currentDate = new Date();
    const differenceInTime = currentDate - new Date(lastUpdateDate);
    const daysPassed = differenceInTime / (1000 * 3600 * 24);
    return daysPassed >= 15;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Manage Wallet Addresses</Text>
      </View>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        Object.entries(walletAddresses).map(([chain, address], index) => {
          // Skip rendering the input for lastUpdateDate
          if (chain === 'lastUpdateDate') return null;

          return (
            <View key={index} style={styles.addressContainer}>
              <Text style={styles.label}>{chain.toUpperCase()} Address:</Text>
              <TextInput
                style={styles.input}
                value={address.wallet}
                onChangeText={(text) => handleEditAddress(chain, text)}
              />
            </View>
          );
        })
      )}

      {remainingDays !== null && (
        <Text style={styles.remainingText}>
          {remainingDays > 0
            ? `You can update the addresses in ${remainingDays} days.`
            : 'You can update the addresses now.'}
        </Text>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
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
  addressContainer: {
    marginBottom: 20,
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  remainingText: {
    fontSize: 18,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default ManageWalletAddresses;
