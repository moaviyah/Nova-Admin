import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { background } from '../color';

const UserHistory = ({ navigation, route }) => {
  const { history } = route.params;

  // Check if history is null or empty
  if (!history || Object.keys(history).length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <AntDesign name="left" size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.headerText}>Profits History</Text>
          <Image source={require('../assets/TrustNOVALogo.png')} style={styles.logo} />
        </View>
        <Text style={styles.noDataText}>No history available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name="left" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Profits History</Text>
        <Image source={require('../assets/TrustNOVALogo.png')} style={styles.logo} />
      </View>

      <FlatList
        data={Object.values(history)} // Use Object.values() to get an array of the nested objects
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.amount}>Amount: ${item.amount}</Text>
            <Text style={styles.type}>Type: {item.Type}</Text>
            <Text style={styles.date}>Date: {item.date}</Text>
            <Text style={styles.time}>Time: {item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  logo: {
    height: 60,
    width: 80,
  },
  historyHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  time: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default UserHistory;
