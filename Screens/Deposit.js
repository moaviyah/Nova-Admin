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
import { getDatabase, ref, set, push, onValue, get } from 'firebase/database';

import { Picker } from '@react-native-picker/picker';
import { getAuth } from 'firebase/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Deposit = ({ navigation, route }) => {
  const auth = getAuth()
  const {planAmount, planLevel} = route.params
  console.log(planAmount, planLevel)
  const userId = auth.currentUser?.uid;
  const [amount, setAmount] = useState('Enter amount');
  const [isCopied, setIsCopied] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [selectedChain, setSelectedChain] = useState('bnb'); // Default selected chain
  const [walletAddresses, setWalletAddresses] = useState({});
  const [address, setAddress] = useState('');
  const name = auth.currentUser?.displayName;
useEffect(() => {
  const db = getDatabase();
  const walletRef = ref(db, 'addresses');
  onValue(walletRef, (snapshot) => {
    if (snapshot.exists()) {
      const addressesData = snapshot.val();
      
      // Filter out the "lastUpdateDate" property
      const filteredAddressesData = { ...addressesData };
      delete filteredAddressesData.lastUpdateDate;

      setWalletAddresses(filteredAddressesData);
      setAddress(filteredAddressesData[selectedChain]?.wallet || '');
    }
  });
}, [selectedChain]);

  const copyToClipboard = () => {
    Clipboard.setString(address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 4000);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handleButtonClick = (value) => {
    setAmount(value.toString());
  };

  function post_request() {
    if (amount === '' || trxId === '') {
      return Alert.alert('Please Enter TrxId of the transfer to proceed.');
    }
  
    const db = getDatabase();
    const request = ref(db, 'requests');
    const newRequestRef = push(request);
    const reqId = newRequestRef.key;
  
    // Fetch the current user's data
    const userRef = ref(db, `users/${name}`);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const referredBy = userData.referredBy || '';
  
          set(newRequestRef, {
            amount: planAmount,
            status: 'Pending',
            id: userId,
            request: 'Deposit',
            timestamp: Date.now(),
            requestId: reqId,
            username: auth.currentUser.displayName,
            trxId: trxId,
            chain: selectedChain,
            level: planLevel,
            referredBy: referredBy, // Include referredBy in the request
          });
  
          Alert.alert('Request posted. Please wait for a response');
          console.log('success');
          navigation.goBack();
        } else {
          // Handle the case where the user's data does not exist
          Alert.alert('Error', 'User data not found.');
        }
      })
      .catch((error) => {
        // Handle error
        Alert.alert('Error', 'Unable to post the request. Please try again later.');
        console.error('Error fetching user data:', error.message);
      });
  }
  

  return (
    <View style={styles.modal}>
      <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' }}>
        <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
        <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
      </View>

      <Text style={styles.modal_txt}>Send your funds from your wallet</Text>
      <Text style={styles.subHead}>You must transfer from your centralized exchange account</Text>

      <Text style={styles.detail_txt}>Transfer Details</Text>
      <View style={styles.add_container}>
        <Text style={styles.add_txt}>Chain</Text>
        <Picker
          selectedValue={selectedChain}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedChain(itemValue)}
        >
          {Object.keys(walletAddresses).map((chain, index) => (
            <Picker.Item key={index} label={chain.toUpperCase()} value={chain} />
          ))}
        </Picker>
      </View>
      <View style={styles.add}>
        <View style={styles.icon_container}>
          <Text style={styles.add_txt}> Wallet Address</Text>
          <MaterialCommunityIcons name={isCopied ? 'check' : 'content-copy'} size={20} onPress={copyToClipboard} />
        </View>

        <View style={styles.add_container}>
          <Text style={styles.add_link}> {address}</Text>
        </View>
        <Text style={styles.add_txt}>
          Amount
        </Text>

        <View style={styles.add_container}>
          <TextInput style={styles.amountInput} placeholder={planAmount} placeholderTextColor="black"  editable={false} />
        </View>

        <View style={styles.add_container}>
          <TextInput style={styles.amountInput} placeholder="Trx Id" placeholderTextColor="#9B9B9B" onChangeText={(text) => setTrxId(text)} value={trxId} />
        </View>

        <TouchableOpacity style={styles.transfer_btn} onPress={post_request}>
          <Text style={styles.btn_txt}>
            I made the transfer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Deposit;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: windowWidth * 0.05,
  },
  modal_txt: {
    fontSize: 22,
    fontWeight: '400'
  },
  subHead: {
    marginVertical: windowHeight * 0.03,
    fontSize: 16,
    color: 'grey',
  },
  detail_txt: {
    marginBottom: windowHeight * 0.03,
    fontWeight: '500'
  },
  add: {
    backgroundColor: '#EDEDED',
    height: windowHeight * 0.5,
    padding: windowWidth * 0.05,
    borderRadius: 10
  },
  add_txt: {
    fontWeight: '600'
  },
  icon_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  add_container: {
    borderBottomWidth: 1,
    marginBottom: windowHeight * 0.01
  },
  add_link: {
    margin: windowWidth * 0.03,
    marginBottom: windowHeight * 0.01
  },
  amountInput: {
    marginTop: windowHeight * 0.025,
  },
  setnumber_container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  num_btn: {
    backgroundColor: 'lightblue',
    margin: windowHeight * 0.005,
    padding: windowHeight * 0.009,
    marginVertical: windowHeight * 0.009,
    borderRadius: 5
  },
  transfer_btn: {
    alignSelf: 'center',
    width: windowWidth * 0.8,
    backgroundColor: '#31A062',
    height: windowHeight * 0.07,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  btn_txt: {
    color: 'white',
    fontWeight: '700'
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
