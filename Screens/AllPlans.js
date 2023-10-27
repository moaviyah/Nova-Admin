import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue } from 'firebase/database';
import { primary } from '../color';
import { getAuth } from 'firebase/auth';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const All_plans = ({ navigation, route }) => {
  const auth = getAuth()
  const { balance, userPlan } = route.params;
  const db = getDatabase();
  const [plans, setPlans] = useState([]); // State to store plans fetched from Firebase

  useEffect(() => {
    const db = getDatabase();
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
  }, []);

  const user = auth.currentUser;
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  useEffect(() => {
    // Listen for changes in email verification status
    const unsubscribe = auth.onAuthStateChanged((updatedUser) => {
      if (updatedUser) {
        setIsEmailVerified(updatedUser.emailVerified);
      }
    });

    // Get the document verification status
    const getVerificationStatus = () => {
      const userRef = ref(db, `Documents/${auth.currentUser.displayName}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const verificationStatus = data.verified;
          setIsDocumentVerified(verificationStatus === true);

        } else {
          setIsDocumentVerified(false);
        }
      });
    };

    //Get the percentage 

    getVerificationStatus();  
    return () => unsubscribe();
  }, []);

  const handlePlanSelect = (planAmount, interestRate, planLevel) => {
    if (isEmailVerified === false) {
      Alert.alert('Please Complete Email Verification In order to invest in Nova Trust')
      return
    }
    else if (isDocumentVerified === false) {
      Alert.alert('Please Complete Document Verification In order to invest in Nova Trust')
      return
    }
    else if(userPlan === 0 ||userPlan === '0'){
      navigation.navigate('Deposit', {planAmount, planLevel})
    }
    else{
    navigation.navigate('PlanSelection', {
      selectedPlan: planAmount,
      balance: balance,
      interest: interestRate,
      userPlan: userPlan,
      planLevel:planLevel
    });
  }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 35, marginBottom: 20 }}>
          <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.head}>Investment Plans</Text>
        </View>

        {/* Map over the plans and render them dynamically */}
        {plans.map((plan) => (
          <TouchableOpacity style={styles.btnContainer} key={plan.id} onPress={() => handlePlanSelect(plan.amount, plan.interest, plan.level)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, fontWeight: '500' }}>Level {plan.level}</Text>
              <AntDesign name='right' size={24} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Investment</Text>
              <Text style={[styles.btnTxt, { fontWeight: '300', fontSize: 16 }]}>Returns upto</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.btnTxt}>$ {plan.amount}</Text>
              <Text style={[styles.btnTxt, { color: primary }]}>$ {plan.potentialEarning}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};

export default All_plans;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  head: {
    alignSelf: 'center',
    fontSize: 22,
    marginLeft: 50,
    fontWeight: '600',
  },
  btnContainer: {
    justifyContent: 'space-evenly',
    marginVertical: windowHeight * 0.01,
    backgroundColor: '#fff',
    marginHorizontal: windowWidth * 0.05,
    borderRadius: 10,
    padding: windowWidth * 0.05,
    elevation: 1,
  },
  btnTxt: {
    fontSize: 18,
    fontWeight: '500',
  },
});
