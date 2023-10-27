import { SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Image, Modal, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { background, primary } from '../color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDatabase, ref, onValue, off, update, set } from "firebase/database";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { getAuth } from 'firebase/auth';
import app from '../config';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = ({ navigation }) => {
  const [earned, setEarned] = useState(0);
  const [balance, setBalance] = useState(0);
  const [refferalEarning, setRefferalEarning] = useState(0)
  const [loading, setLoading] = useState(true);
  const [popupConfig, setPopupConfig] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userPlan, setUserPlan] = useState(0); // State to store the user's plan
  const [level, setLevel] = useState();
  const [isAgent, setisAgent] = useState(false);
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState('')
  const [history, setHistory] = useState('')
  const db = getDatabase()
  const auth = getAuth()
  const openPopUpModal = () => {
    setIsPopupVisible(true);
  };

  const closeModal = () => {
    setIsPopupVisible(false);
  };

  const fetchPopupContent = () => {
    // Fetch the pop-up configuration from Firebase
    // Assuming you have a reference to your Firebase database
    const popupConfigRef = ref(getDatabase(), 'popupConfig');

    onValue(popupConfigRef, (snapshot) => {
      const configData = snapshot.val();

      if (configData && configData.isEnabled) {
        // If pop-up is enabled, set the configuration in state
        setPopupConfig(configData);
        openPopUpModal();
      }
    });
  };

  const openModal = () => {
    navigation.navigate('AllPlans', { balance: balance, userPlan })
  }

  useEffect(() => {
    fetchPopupContent();
  }, []);

  useEffect(() => {
    // Check for the user's plan status when the component is mounted

    const displayName = auth.currentUser?.displayName;
    const userRef = ref(db, `users/${displayName}`);
    const userValueCallback = (snapshot) => {
      const data = snapshot.val();
      const balance = data.balance;
      const earned = data.earned;
      const refferalEarned = data.refferalEarning;
      const plan = data.plan || 0; // Assuming the user's plan is stored in the 'plan' field
      const planLevel = data.level || 0;
      const agent = data.isAgent || false;
      const wallet = data.withdrawalAddress || null;
      const userPin = data.withdrawalPIN || null;
      const history = data.history
      setHistory(history)
      setAddress(wallet);
      setPin(userPin)
      setisAgent(agent)
      setRefferalEarning(refferalEarned);
      setBalance(balance);
      setEarned(earned);
      setUserPlan(plan); // Set the user's plan in state
      setLevel(planLevel)
      if(plan>0 && earned === parseFloat(plan * 5) ||earned > parseFloat(plan * 5)){
        const completedContractPath = ref(db, `completedContracts/${auth.currentUser?.displayName}`);
        set(completedContractPath, {balance:balance, plan:plan, level:planLevel,earned:earned, date:new Date().toISOString()}).then(()=>{
          Alert.alert('Your Contract is completed')
          setUserPlan(0)
          setLevel(0)
          setEarned(0)
          update(userRef, {earned:0, plan:0, level:0})
  
        })

      }
      if(data?.isAgent){
        setisAgent(true)
      }
      setLoading(false);
    };

    // Attach the event listener
    onValue(userRef, userValueCallback);

    // Return a cleanup function to remove the event listener when the component unmounts
    return () => {
      off(userRef, 'value', userValueCallback);
    };
  }, [db]);

  const WithdrawClick = ()=>{
    if(!address || !pin){
      Alert.alert('Please set Wallet Address and pin before withdraw')
      return;
    }else
    navigation.navigate('Withdraw', { balance })
  }
  return (
    <SafeAreaView style={styles.container}>
      {
        loading ?
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator />
          </View>
          :
          <View>
            <ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: windowHeight * 0.05, marginHorizontal: windowWidth * 0.05, }}>
                <View>
                <Text style={styles.welcome_txt}>Welcome to Nova Trust,</Text>
                <Text style={styles.welcome_txt}>{auth.currentUser?.displayName}</Text>
                </View>
                <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
              </View>
              {/* Top card For portfollio */}
              <View style={styles.total_card}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:10}}>
                <Text style={styles.total_txt}>Your total asset portfollio</Text>
                {isAgent && (
                <View style={{ flexDirection: 'row' }}>
                  <FontAwesome5 name="user-tie" size={24} color="#ff8c00" />
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ff8c00', marginLeft: 8 }}>Agent</Text>
                </View>
              )}
                </View>
                <View style={styles.btn_container}>
                  <View>
                    <Text style={{ color: 'white' }}>
                      Balance: ${balance}
                    </Text>
                    <Text style={styles.amout}>
                      Total: $ {balance + parseFloat(userPlan)}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'center', }}>
                    {level > 0 && (
                      <View style={{ flexDirection: 'row', }}>
                        <Text style={{ color: 'white', marginLeft: windowWidth * 0.15 }}></Text>
                        {Array.from({ length: level }).map((_, index) => (
                          <Ionicons key={index} name="star" size={20} color="gold" />
                        ))}
                      </View>
                    )}

                    <TouchableOpacity style={styles.invest_btn} onPress={openModal}>
                      <Text style={styles.invest_btn_txt}>
                        {userPlan === 0 || userPlan === '0' ? 'Invest Now' : 'Upgrade Now'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10 }}>
                  <Text style={styles.earned}>
                    Earned : ${earned}
                  </Text>
                  <Text style={[styles.earned]}>
                    Refferal Earning : ${refferalEarning}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 30 }} onPress={() => navigation.navigate('Guide')}>
                <Image source={require('../assets/notifications.png')} style={{ height: 20, width: 20 }} />
                <Text style={[styles.last_txt, {fontWeight:'bold', color:'#eb5e28'}]}>
                  How to Invest Complete Guideline
                </Text>
              </TouchableOpacity>

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={WithdrawClick}
                >
                  <Ionicons name="cash" size={40} color='#bc4749' />
                  <Text style={[styles.buttonText, { color: '#bc4749' }]}>Withdraw</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Refferals')}
                >
                  <Ionicons name="people" size={40} color='#f4a261' />
                  <Text style={[styles.buttonText, { color: '#f4a261' }]}>Referrals</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('Learning')}
                >
                  <Ionicons name="book" size={40} color='#48cae4' />
                  <Text style={[styles.buttonText, { color: '#48cae4' }]}>Learning</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button]}
                  onPress={()=>navigation.navigate('UserHistory', { history})}
                >
                  <Ionicons name="analytics" size={40} color='#3a5a40' />
                  <Text style={[styles.buttonText, { color: '#3a5a40' }]}>Profits History</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <Modal
              animationType="slide"
              transparent={true}
              visible={isPopupVisible}
              onRequestClose={closeModal}
            >
              <View style={styles.popupContainer}>
                <ImageBackground
                  source={{ uri: popupConfig?.imageUrl }}
                  style={styles.backgroundImage}
                  imageStyle={{ height: '100%', resizeMode: 'contain' }}
                >
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Ionicons name="close-circle" size={30} color={primary} />
                  </TouchableOpacity>


                  <View style={{ backgroundColor: 'black', width: '100%', alignItems: 'center', paddingHorizontal: 10, alignSelf: 'flex-end', position: 'absolute', bottom: 40 }}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '600', textAlign: 'center' }}>{popupConfig?.text}</Text>
                  </View>
                </ImageBackground>
              </View>
            </Modal>

          </View>
      }

    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background
  },
  welcome_txt: {
    fontSize: 24,
    fontWeight: '800',
  },
  total_card: {
    height: windowHeight * 0.25,
    width: windowWidth * 0.87,
    backgroundColor: primary,
    alignSelf: 'center',
    borderRadius: 15,
    margin: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  total_txt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: windowWidth * 0.05,
  },
  btn_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * 0.017,
  },
  amout: {
    fontSize: 24,
    fontWeight: '600',
    color: background,
  },
  invest_btn: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.32,
    backgroundColor: background,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: windowWidth * 0.15,
    justifyContent: 'center',
    marginTop:5,
  },
  invest_btn_txt: {
    color: primary,
    fontSize: 15,
    fontWeight: '500'
  },
  middle_container: {
    flexDirection: 'row',
    margin: windowWidth * 0.05,
    alignItems: 'center'
  },
  middle_txt: {
    fontWeight: '600',
    fontSize: 22
  },
  all_btn: {
    alignContent: 'center',
    marginLeft: windowWidth * 0.4

  },
  all_btn_txt: {
    fontSize: 20,
    color: 'red'
  },

  img_card: {
    height: windowHeight * 0.25,
    width: windowWidth * 0.32,
    backgroundColor: '#DD9939',
    margin: windowWidth * 0.06,
    borderRadius: 20,
    marginRight: 0,
    justifyContent: 'center',
    marginTop: 0,
    alignItems: 'center',
  },
  last_txt: {
    fontSize: 14,
    marginBottom: 5,

    marginLeft: windowWidth * 0.05
  },
  guide_btn: {
    marginHorizontal: windowWidth * 0.05,
    padding: windowHeight * 0.02,
    borderRadius: 10,
    borderBottomWidth: 1
  },
  guide_title: {
    fontSize: 18,
    fontWeight: '700'
  },
  guide_txt: {

  },
  gold_img: {
    height: windowHeight * 0.25,
    width: windowWidth * 0.32,
    backfaceVisibility: 'hidden',
    backgroundColor: 'transparent',
    resizeMode: 'cover',
    borderRadius: 15,
  },

  earned: {
    color: '#fff'
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  button: {
    width: '45%', // Adjust the width to fit your layout
    height: 150, // Adjust the height as needed
    backgroundColor: '#edede9', // Customize the button's background color
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Adjust the margin as needed
  },
  buttonText: {
    color: primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10, // Adjust the margin as needed
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'black'
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});