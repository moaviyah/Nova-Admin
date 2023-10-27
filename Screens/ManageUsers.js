import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Added FontAwesome5 for user icon
import {  MaterialCommunityIcons } from 'react-native-vector-icons';
import { getDatabase, ref, onValue } from 'firebase/database';
import filter from 'lodash.filter';
const ManageUsers = ({ navigation }) => {
  const db = getDatabase(); // Initialize Firebase database reference
  const [users, setUsers] = useState([]); // State to store user data
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  const filterUsers = (query, allRequests) => {
    const lowerCaseQuery = query.toLowerCase();

    // If the query is empty, show all requests
    if (query === '') {
      setFilteredUsers(allRequests);
    } else {
      const filteredRequests = allRequests.filter((item) => {

        return (
          (item.name && item?.name.toLowerCase().includes(lowerCaseQuery)) || 
          (item.username && item?.username.toLowerCase().includes(lowerCaseQuery)) 
          // (item.plan && item?.plan.toLowerCase().includes(lowerCaseQuery)) 
          // (item.earned && item?.earned.toLowerCase().includes(lowerCaseQuery))
        );
      });

      setFilteredUsers(filteredRequests);
    }
  };
  // Fetch user data from Firebase database
  useEffect(() => {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // Convert the Firebase object into an array of users with document IDs as usernames
        const userList = Object.keys(userData).map((username) => ({
          username, // Use the document ID as the username
          ...userData[username],
        }));
        setUsers(userList);
        setFilteredUsers(userList)
      }
    });
  }, [db]);

  // Function to navigate to UserDetails screen and pass user data
  const navigateToUserDetails = (user) => {
    navigation.navigate('UserDetails', { user, history: user.history });
  };

  return (
    <View style={styles.container}>
      <AntDesign
        name="left"
        style={styles.backButton}
        size={24}
        onPress={() => navigation.goBack()}
      />
      <Text style={{fontWeight:'bold', fontSize:20}}>Manage Users</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          clearButtonMode='always'
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            filterUsers(text, users); // Pass the requests array as an argument
          }}
        />

        <MaterialCommunityIcons name="magnify" size={24} color="#999" />
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(user) => user.username}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userContainer}>
            <View style={styles.userIconContainer}>
              <FontAwesome5 name="user" size={24} color="#3498db" />
            </View>
            <View style={styles.userInfoContainer}>
            <Text style={[styles.plan, {fontSize:18, fontWeight:'bold'}]}>{item.name}</Text>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.plan}>Plan: {item.plan}</Text>
              <Text style={styles.plan}>Earned: {item.earned}</Text>
              <Text style={styles.plan}>Refferal Earning: {parseFloat(item.refferalEarning)}</Text>
              <Text style={styles.referrals}>
                Referrals: {item.referrals ? Object.keys(item?.referrals).length : 0}
              </Text>
              
              <Text style={styles.approvedReferrals}>
                Approved Referrals: {
                  item.referrals ?
                    Object.values(item?.referrals).filter((referral) => referral?.approved).length : 0
                }
              </Text>
            </View>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToUserDetails(item)}
            >
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5', // Background color for the container
  },
  backButton: {
    marginTop: 35,
    marginBottom: 20,
  },
  userContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 1,
    flexDirection: 'row', // Align user icon, user info, and details button horizontally
    alignItems: 'center', // Center items vertically
  },
  userIconContainer: {
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1, // Takes up remaining space
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Username text color
  },
  plan: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555', // Plan text color
  },
  referrals: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555', // Referrals text color
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginTop:10
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  detailsButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  approvedReferrals: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
});

export default ManageUsers;
