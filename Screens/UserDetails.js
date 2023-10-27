import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { primary } from '../color';

const UserDetails = ({ navigation, route }) => {
  const { user, history } = route.params;
  const db = getDatabase();
  const [isAgent, setIsAgent] = useState(user.isAgent);
  const [isBlocked, setIsBlocked] = useState(user.isBlocked);
  const [editedPlan, setEditedPlan] = useState(user.plan.toString()); // Initialize editedPlan state
  const [editedBalance, setEditedBalance] = useState(user.balance.toString()); // Initialize editedBalance state

  // Function to toggle user as an agent
  const toggleAgentStatus = () => {
    const userRef = ref(db, `users/${user.username}`);
    const updatedStatus = !isAgent;

    update(userRef, { isAgent: updatedStatus })
      .then(() => {
        console.log(`User is now ${updatedStatus ? 'an agent' : 'not an agent'}`);
        setIsAgent(updatedStatus);
      })
      .catch((error) => {
        console.error('Error toggling agent status:', error);
        // Handle the error
      });
  };

  // Function to toggle user's blocked status
  const toggleBlockedStatus = () => {
    const userRef = ref(db, `users/${user.username}`);
    const updatedStatus = !isBlocked;

    update(userRef, { isBlocked: updatedStatus })
      .then(() => {
        console.log(`User is now ${updatedStatus ? 'blocked' : 'unblocked'}`);
        setIsBlocked(updatedStatus);
      })
      .catch((error) => {
        console.error('Error toggling blocked status:', error);
        // Handle the error
      });
  };

  const resetPin =()=>{
    const userRef = ref(db, `users/${user.username}`);
    const updatedUserData = {
      withdrawalPIN: null, // Set to null to remove the field
      withdrawalAddress: null, // Set to null to remove the field
    };
  
    // Update the user's data in Firebase to remove the specified fields
    update(userRef, updatedUserData)
      .then(() => {
        console.log('User PIN and Address reset successfully');
      })
      .catch((error) => {
        console.error('Error resetting user PIN and Address:', error);
        // Handle the error
      });
  }

  return (
    <ScrollView style={styles.container}>
      <AntDesign
        name="left"
        style={styles.backButton}
        size={24}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.userInfoContainer}>
        <FontAwesome5 name="user" style={styles.userIcon} size={40} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      <View style={styles.userDetailsContainer}>
        <Text style={styles.userDetail}>Balance: {user.balance}</Text>
        <Text style={styles.userDetail}>Date of Birth: {user.dateOfBirth}</Text>
        <Text style={styles.userDetail}>Country: {user.country}</Text>
        <Text style={styles.userDetail}>Earned: {user.earned}</Text>
        <Text style={styles.userDetail}>Email: {user.email}</Text>
        <Text style={styles.userDetail}>Plan: ${user.plan}</Text>
        <Text style={styles.userDetail}>Referred By: {user.referredBy}</Text>
      </View>

      {/* <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Edit Plan"
          value={editedPlan}
          onChangeText={(text) => setEditedPlan(text)}
        />
        <TouchableOpacity style={styles.editButton} onPress={updatePlan}>
          <Text style={styles.editButtonText}>Edit Plan</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleAgentStatus}>
          <Text style={styles.buttonText}>
            {isAgent ? 'Remove Agent' : 'Make Agent'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:primary}]} onPress={()=>navigation.navigate('UserHistory', { history})}>
          <Text style={styles.buttonText}>
            See Distribution History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isBlocked ? 'green' : 'red' }]}
          onPress={toggleBlockedStatus}
        >
          <Text style={styles.buttonText}>
            {isBlocked ? 'Unblock User' : 'Block User'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:'#fb8500'}]} onPress={()=>navigation.navigate('TransactionHistory')}>
          <Text style={styles.buttonText}>
            See Transactions History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:'#2f3e46'}]} onPress={()=>navigation.navigate('AddAmount', {user})}>
          <Text style={styles.buttonText}>
            Send Amount
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:'#9e0059'}]} onPress={resetPin}>
          <Text style={styles.buttonText}>
            Reset User Pin & Address
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ... (styles and export)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginTop: 35,
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  userIcon: {
    marginRight: 10,
    color: '#333',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetailsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  userDetail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: 'white',
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserDetails;
