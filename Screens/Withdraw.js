import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Clipboard,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDatabase, ref, push, get, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Withdraw = ({ navigation, route }) => {
  const auth = getAuth()
  const { balance } = route.params;
  console.log(balance);
  const db = getDatabase();
  const [copiedText, setCopiedText] = useState('');
  const [amount, setAmount] = useState('');
  const userId = auth.currentUser?.uid;
  const [enteredPin, setEnteredPin] = useState('');
  const [pin, setPin] = useState('');
  const [userWallet, setUserWallet] = useState('');

  useEffect(() => {
    const userRef = ref(db, `users/${auth.currentUser?.displayName}`);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const userPin = userData.withdrawalPIN || '';
          const walletAddress = userData.withdrawalAddress || ''; // Fetch user's wallet address
          // Set the PIN and userWallet states
          setPin(userPin);
          setUserWallet(walletAddress);
          console.log(userPin,'wallet', walletAddress);
        } else {
          // Handle the case where the user's data does not exist
          Alert.alert('Error', 'User data not found.');
        }
      })
      .catch((error) => {
        // Handle error
        Alert.alert('Error', 'Unable to fetch user data. Please try again later.');
        console.error('Error fetching user data:', error.message);
      });
  }, []);



  const post_request = () => {
    if (amount === '' || enteredPin === '') {
      Alert.alert('Please Enter Amount and 4-digit PIN to withdraw');
    } else if (amount <= balance) {
      if (amount < 50) {
        Alert.alert('Minimum amount is $50');
        return;
      }
      // Compare entered PIN with the fetched PIN
      if (pin !== '') {
        if (pin !== enteredPin) {
          return Alert.alert('Invalid PIN', 'Please enter the correct 4-digit PIN to proceed.');
        }
      }
      const db = getDatabase();
      const request = ref(db, 'requests');
      const newRequestRef = push(request);
      const reqId = newRequestRef.key;
      set(newRequestRef, {
        amount: amount,
        status: 'Pending',
        id: userId,
        request: 'Withdraw',
        timestamp: Date.now(),
        requestId: reqId,
        username: auth.currentUser.displayName,
        userWallet: userWallet, // Use the user's wallet address
      });
      console.log('success');
      navigation.goBack();
      Alert.alert('Request Generated Successfully. Please Wait');
    } else {
      Alert.alert('Insufficient Balance');
      console.log('insufficient amount');
    }
  };

  return (
    <View style={styles.modal}>
      <View style={{ flexDirection: 'row', marginTop: 35, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' }}>
        <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
        <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
      </View>
      <Text style={styles.modal_txt}>Receive your earnings in your wallet</Text>
      <Text style={[styles.subHead, { color: 'red', textAlign: 'justify' }]}>You can only take withdraw in USDT(BEP-20), so make sure you have set the right withdrawal wallet address.</Text>
      <View style={styles.link_container}>
        <Text style={styles.input_container_txt}>Your USDT(BEP-20) address:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userWallet} // Display user's wallet address
            editable={false}
            placeholderTextColor='black'
          />

        </View>
      </View>
      <View style={styles.link_container}>
        <Text style={styles.input_container_txt}>Enter amount to withdraw</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => { setAmount(text) }}
          />
        </View>
      </View>
      <View style={styles.link_container}>
        <Text style={styles.input_container_txt}>Enter Your 4-digit PIN</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => { setEnteredPin(text) }}
            keyboardType='number-pad'
            value={enteredPin}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.transfer_btn} onPress={post_request}>
        <Text style={styles.btn_txt}>
          Initialize Withdraw
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  link_container: {
    height: windowHeight * 0.1,
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    padding: windowHeight * 0.01,
    margin: windowHeight * 0.01,
  },
  modal_txt: {
    fontSize: 22,
    fontWeight: '400',
  },
  input: {
    height: windowHeight * 0.06,
    width: windowWidth * 0.8,
    color:'black'
  },
  inputContainer: {
    flexDirection: 'row',
  },
  paste_icon: {
    alignSelf: 'center',
  },
  subHead: {
    marginVertical: windowHeight * 0.03,
    fontSize: 16,
    color: 'grey',
  },
  input_container_txt: {
    color: 'grey',
  },
  transfer_btn: {
    alignSelf: 'center',
    width: windowWidth * 0.8,
    backgroundColor: '#31A062',
    height: windowHeight * 0.07,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.09,
  },
  btn_txt: {
    color: 'white',
    fontWeight: '700',
  },
});
