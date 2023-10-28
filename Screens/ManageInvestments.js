import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Alert, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, onValue, update, off, get, push } from 'firebase/database';
import { primary } from '../color';

const ManageInvestments = ({ navigation }) => {
  const [selectedPlanLevel, setSelectedPlanLevel] = useState('Select Plan');
  const [amount, setAmount] = useState('');
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [percentage, setPercentage] = useState('');
  const [excludedUsers, setExcludedUsers] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const userList = Object.keys(data)
          .map((username) => ({
            username,
            ...data[username],
          }))
          .filter((user) => !user.isBlocked);

        setUsers(userList);
      } else {
        console.log('no Data');
      }
    });
  }, [db]);

  // const toggleUserExclusion = (username) => {
  //   if (excludedUsers.includes(username)) {
  //     setExcludedUsers((prevExcludedUsers) => prevExcludedUsers.filter((user) => user !== username));
  //   } else {
  //     setExcludedUsers((prevExcludedUsers) => [...prevExcludedUsers, username]);
  //   }
  //   // Call calculateDistributedAmount to update the list of eligible users
  //   calculateDistributedAmount();
  // };
  const toggleUserExclusion = (username) => {
    console.log(username)
    // Check if the user is already excluded
    if (excludedUsers.includes(username)) {

    } else {
      // User is not excluded, so add them to the excluded users list
      setExcludedUsers((prevExcludedUsers) => [...prevExcludedUsers, username]);
      Alert.alert('Press the Exclude Button again to remove user from Profit Distribution')
    }
    // Call calculateDistributedAmount to update the list of eligible users
    calculateDistributedAmount();
  };
  const calculateDistributedAmount = () => {
    if (selectedPlanLevel === 'Select Plan') {
      Alert.alert('Please Select a Plan');
    } else if (amount === '' || percentage === '') {
      Alert.alert('Please Enter an Amount to Distribute and a Percentage for agents');
    } else {
      const distributionAmount = parseFloat(amount);
      const filteredUsers = users.filter((user) => parseFloat(user.plan) === parseInt(selectedPlanLevel));

      if (filteredUsers.length === 0) {
        setEligibleUsers([]);
        return;
      }

      // Filter out the excluded users
      const eligibleUsersAfterExclusion = filteredUsers.filter((user) => !excludedUsers.includes(user.username));

      if (eligibleUsersAfterExclusion.length === 0) {
        setEligibleUsers([]);
        return;
      }

      const userShare = (distributionAmount / eligibleUsersAfterExclusion.length).toFixed(2);
      const usersWithDistributedAmount = eligibleUsersAfterExclusion.map((user) => {
        const referralBonus = user.referredBy ? (0.1 * userShare).toFixed(2) : 0;
        return {
          ...user,
          distributedAmount: userShare,
          parentRefferal: referralBonus,
          isExcluded: excludedUsers.includes(user.username),
        };
      });

      setEligibleUsers(usersWithDistributedAmount);
    }
  };


  const handleConfirm = async () => {
    const percent = percentage / 100;
    try {
      const updates = {};
      const timestamp = new Date().toISOString();
      eligibleUsers.forEach((user) => {
        const distributedAmount = parseFloat(user.distributedAmount);
        const remainingAmount = parseFloat(distributedAmount);
        const earnedAmount = parseFloat(user?.earned || 0);
        const newBalance = parseFloat(user.balance) + remainingAmount;
        updates[`users/${user.username}/balance`] = newBalance;
        updates[`users/${user.username}/earned`] = earnedAmount + remainingAmount;
        const distributionEntry = {
          amount: remainingAmount,
          Type: 'Earning',
          date: new Date(timestamp).toLocaleDateString(),
          time: new Date(timestamp).toLocaleTimeString(),
        };
        const userHistoryRef = ref(db, `users/${user.username}/history`);
        push(userHistoryRef, distributionEntry);
      });

      await update(ref(db), updates);

      const snapshot = await get(ref(db, 'users'));
      const usersData = snapshot.val() || {};

      const referralGroups = {};
      eligibleUsers.forEach((user) => {
        if (user.referredBy) {
          if (!referralGroups[user.referredBy]) {
            referralGroups[user.referredBy] = [];
          }
          referralGroups[user.referredBy].push(user);
        }
      });

      for (const referrerUsername in referralGroups) {
        if (referralGroups.hasOwnProperty(referrerUsername)) {
          const referredUsers = referralGroups[referrerUsername];
          const totalReferralBonus = referredUsers.reduce((total, referredUser) => {
            return total + (percent * parseFloat(referredUser.distributedAmount));
          }, 0);
          if (usersData[referrerUsername]?.isAgent === true) {
            const referrerBalance = parseFloat(usersData[referrerUsername]?.balance || 0);
            const newReferrerBalance = parseFloat(referrerBalance + totalReferralBonus);
            const reffererEarningByRefferal = parseFloat(usersData[referrerUsername]?.refferalEarning || 0);
            updates[`users/${referrerUsername}/balance`] = newReferrerBalance;
            updates[`users/${referrerUsername}/refferalEarning`] = totalReferralBonus + reffererEarningByRefferal;
            const distributionEntry = {
              amount: totalReferralBonus,
              Type: 'Refferal Bonus',
              date: new Date(timestamp).toLocaleDateString(),
              time: new Date(timestamp).toLocaleTimeString(),
            };
            const userHistoryRef = ref(db, `users/${referrerUsername}/history`);
            push(userHistoryRef, distributionEntry);
          }
        }
      }

      await update(ref(db), updates);

      setSelectedPlanLevel('Select Plan');
      setAmount('');
      setEligibleUsers([]);
      Alert.alert('Distributed successfully');
    } catch (error) {
      console.error('Error distributing: ', error);
      Alert.alert('Error distributing amount');
    }
  };

  return (
    <View style={styles.container}>
      <AntDesign
        name="left"
        style={{ marginTop: 35, marginBottom: 20 }}
        size={24}
        onPress={() => navigation.goBack()}
      />

      <Text style={styles.label}>Select Plan Level:</Text>
      <Picker
        style={styles.input}
        selectedValue={selectedPlanLevel}
        onValueChange={(itemValue) => setSelectedPlanLevel(itemValue)}
      >
        <Picker.Item label="Select Plan" value="Select Plan" />
        <Picker.Item label="Plan $200" value="200" />
        <Picker.Item label="Plan $400" value="400" />
        <Picker.Item label="Plan $600" value="600" />
        <Picker.Item label="Plan $800" value="800" />
        <Picker.Item label="Plan $1000" value="1000" />
        <Picker.Item label="Plan $1500" value="1500" />
        <Picker.Item label="Plan $2000" value="2000" />
      </Picker>

      <Text style={styles.label}>Enter Amount:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />
      <Text style={styles.label}>Enter Percentage for agents:</Text>
      <TextInput
        style={styles.input}
        placeholder="%"
        keyboardType="numeric"
        value={percentage}
        onChangeText={(text) => setPercentage(text)}
      />

      <Button title="Calculate Distributed Amount" onPress={calculateDistributedAmount} color={primary} />

      {eligibleUsers.length === 0 ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>No eligible users for the selected plan level</Text>
        </View>
      ) : (
        <>
        <FlatList
          data={eligibleUsers}
          vertical
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <View>
                <Text>{`Id: ${item.username || 'N/A'}`}</Text>
                <Text>{`User: ${item.name || 'N/A'}`}</Text>
                <Text>{`Plan Level: $${item.plan || 'N/A'}`}</Text>
                <Text>{`Referred By: ${item.referredBy || 'None'}`}</Text>
                <Text>{`Distributed Amount: $${item.distributedAmount || 'N/A'}`}</Text>
              </View>
              <TouchableOpacity onPress={() => { toggleUserExclusion(item.username); }} style={{ backgroundColor: '#da2c38', alignItems: 'center', justifyContent: 'center', marginVertical: 20, paddingHorizontal: 5, marginLeft: 5, borderRadius: 10 }}>
                <Text style={{ color: 'white' }}>
                  Exclude
                </Text>
              </TouchableOpacity>
            </View>
          )} /><TouchableOpacity style={{ backgroundColor: primary, paddingVertical: 15, borderRadius: 10, alignItems: 'center', }} onPress={handleConfirm}>
            <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18 }}>
              Confirm
            </Text>
          </TouchableOpacity>
          </>

      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  userItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

export default ManageInvestments;
