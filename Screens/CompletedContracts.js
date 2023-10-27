import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';

const CompletedContracts = ({ navigation }) => {
  const db = getDatabase();
  const [completedContracts, setCompletedContracts] = useState([]);

  useEffect(() => {
    // Fetch completed contracts data from the Firebase Realtime Database
    const completedContractsRef = ref(db, 'completedContracts');

    onValue(completedContractsRef, (snapshot) => {
      if (snapshot.exists()) {
        const contractsData = snapshot.val();
        // Convert the Firebase object into an array of contracts
        const contractsList = Object.keys(contractsData).map((userId) => ({
          userId, // Use the user's ID as a key
          ...contractsData[userId],
        }));
        setCompletedContracts(contractsList);
      }
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      off(completedContractsRef);
    };
  }, [db]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.header}>Completed Contracts</Text>
      <FlatList
        data={completedContracts}
        keyExtractor={(contract) => contract.userId} // Use the user's ID as the key
        renderItem={({ item }) => (
          <View style={styles.contractItem}>
            <Text>User ID: {item.userId}</Text>
            <Text>Balance: ${item.balance}</Text>
            <Text>Level: {item.level}</Text>
            <Text>Plan: ${item.plan}</Text>
            <Text>Earned: ${item.earned}</Text>
            <Text>Date: {format(new Date(item.date), 'MMMM dd, yyyy HH:mm:ss')}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical:40
  },
  backButton: {
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contractItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth:0.5
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});

export default CompletedContracts;
