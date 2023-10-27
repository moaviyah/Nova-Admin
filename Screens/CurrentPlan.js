import { SafeAreaView, StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue, off } from 'firebase/database';

import { primary } from '../color';
import { getAuth } from 'firebase/auth';

const windowWidth = Dimensions.get('window').height
const windowHeight = Dimensions.get('window').height;

const CurrentPlan = ({ navigation }) => {
  const auth = getAuth()
  const [plan, setPlan] = useState();
  const [profit, setProfit] = useState();
  
  useEffect(() => {
    const db = getDatabase();
    const userId = auth.currentUser?.displayName;
    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data.plan);
      if (data.plan > 0) {
        setPlan(data.plan)
      } else {
        setPlan(`No Current Plan`)
      }
      setProfit(data.earned)
      console.log(data.earned)
    });

    return () => {
      // Unsubscribe from the database when the component unmounts
      off(userRef);
    };
  }, []);
  return (
    <SafeAreaView style={styles.modal}>

      <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 20, alignItems: 'center', justifyContent:'space-between' }}>
        <AntDesign name='left' style={{}} size={24} onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 20, marginLeft: 20, fontWeight: '500' }}>My Investments</Text>
        <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
      </View>


      <View style={{ padding: 20, backgroundColor: '#fff', borderRadius: 15, }}>
        <View style={{ flexDirection: 'row', fontSize: 16, fontWeight: '300', alignItems: 'center' }}>
          <Image source={require('../assets/portfolio.png')} style={{ height: 30, width: 30 }} />
          <Text style={{ fontSize: 16, fontWeight: '500', marginLeft: 10 }}>
            Your Investment Portfolio
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <Text style={{ fontWeight: '300' }}>
            Invested Amount
          </Text>
          <Text style={{ fontWeight: '300' }}>
            Current Value
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
          <Text style={{ fontWeight: '500', fontSize:16}}>
            $ {plan}
          </Text>
          <Text style={{ fontWeight: '500', fontSize:16 }}>
            $ {parseFloat(plan) + parseFloat(profit)}
          </Text>
        </View>

        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
          <View>
            <Text style={{fontWeight:'300'}}>
              Overall Returns
            </Text>
            <Text style={{color:primary, fontSize:16}}>
              $ {profit} (+{profit / plan * 100} %)
            </Text>
          </View>
          <Image source={require('../assets/chart.png')} style={{}}/>
        </View>
      </View>


    </SafeAreaView>
  )
}

export default CurrentPlan

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    paddingVertical:20,
    paddingHorizontal:15
  },
})