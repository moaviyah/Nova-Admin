import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, set, child, remove, onValue } from 'firebase/database';
import { primary } from '../color';

const db = getDatabase();

const ManagePlans = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ level: '', amount: '', potentialEarning: '' });

  useEffect(() => {
    // Fetch plans from Firebase when the component mounts
    const plansRef = ref(db, 'plans');
    onValue(plansRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const planList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPlans(planList);
      }
    });
  }, [db]);

  const addPlan = () => {
    // Validate input fields
    if (!newPlan.level || !newPlan.amount || !newPlan.potentialEarning) {
      Alert.alert('Enter Complete Details of the plan');
      return;
    }

    // Save the new plan to Firebase
    const plansRef = ref(db, 'plans');
    const newPlanRef = child(plansRef, newPlan.level);
    set(newPlanRef, newPlan);

    // Clear input fields
    setNewPlan({ level: '', amount: '', potentialEarning: '' });
  };

  const confirmDeletePlan = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this plan?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            deletePlan(id);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deletePlan = (id) => {
    // Remove the plan from Firebase
    const planRef = child(ref(db, 'plans'), id);
    remove(planRef);
    navigation.goBack()
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30 }}>
        <AntDesign name="left" style={{}} size={24} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 22, marginLeft: 10 }}>Manage Plans</Text>
      </View>

      {/* Input fields for creating a new plan */}
      <TextInput
        placeholder="Level"
        style={styles.input}
        value={newPlan.level}
        onChangeText={(text) => setNewPlan({ ...newPlan, level: text })}
      />
      <TextInput
        placeholder="Amount"
        style={styles.input}
        value={newPlan.amount}
        onChangeText={(text) => setNewPlan({ ...newPlan, amount: text })}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Potential Earning"
        style={styles.input}
        value={newPlan.potentialEarning}
        onChangeText={(text) => setNewPlan({ ...newPlan, potentialEarning: text })}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.addButton} onPress={addPlan}>
        <Text style={styles.buttonText}>Add Plan</Text>
      </TouchableOpacity>

      {/* List of existing plans */}
      <FlatList
        data={plans}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text>{`Level: ${item?.level}`}</Text>
            <Text>{`Amount: $${item?.amount}`}</Text>
            <Text>{`Potential Earning: $${item?.potentialEarning}`}</Text>
            <TouchableOpacity onPress={() => confirmDeletePlan(item?.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  planItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    color: 'red',
    marginTop: 5,
  },
});

export default ManagePlans;
