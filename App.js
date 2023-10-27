import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import app from './config'
import Login from './Screens/Login';
import Admin from './Screens/Admin';
import ManageRequests from './Screens/ManageRequests';
import ManageUsers from './Screens/ManageUsers';
import ManageInvestments from './Screens/ManageInvestments';
import LearningAdmin from './Screens/LearningAdmin';
import UserDetails from './Screens/UserDetails';
import Verification from './Screens/Verification';
import EmailVerification from './Screens/EmailVerification';
import AdminDocumentVerification from './Screens/AdminDocumentVerification';
import Blocked from './Screens/Blocked';
import ManageWalletAddresses from './Screens/ManageWalletAddresses';
import ManageUserAgreement from './Screens/ManageUserAgreement';
import ManagePrivacyPolicy from './Screens/ManagePrivacyPolicy';
import ManageAboutUs from './Screens/ManageAboutUs';
import AboutUs from './Screens/AboutUs';
import Privacy from './Screens/Privacy';
import UserAgreement from './Screens/UserAgreement';
import ManagePopUp from './Screens/ManagePopUp';
import ManagePlans from './Screens/ManagePlans';
import OneTimePercentage from './Screens/OneTimePercentage';
import UserHistory from './Screens/UserHistory';
import SetWithdrawal from './Screens/SetWithdrawal';
import TransactionHistory from './Screens/TransactionHistory';
import Learning from './Screens/Learning';
import AddAmount from './Screens/AddAmount';
import ManageSupportLinks from './Screens/ManageSupportLinks';
import CompletedContracts from './Screens/CompletedContracts';
import ManageApprovedUsers from './Screens/ManageApprovedUsers';
export default function App() {
  const auth = getAuth()
  const [initialRoute, setInitialRoute] = useState('login');
  const [loading, setLoading] = useState(true)
  const Stack = createStackNavigator();
  console.log(initialRoute)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setInitialRoute('Admin');
        setLoading(false)
      } else {
        setInitialRoute('Login');
        setLoading(false)
      }
    });
    unsubscribe
    
  }, []);
  return (
    <View style={{flex:1}}>
      {
        loading ?
          (
            <View style={{height:'100%', alignItems:'center', justifyContent:'center'}}>
              <ActivityIndicator size={50} color={'green'}/>
            </View>
          )
          :
          (
            <NavigationContainer independent={true}>
              <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>

                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Admin' component={Admin} />
                <Stack.Screen name='ManageRequests' component={ManageRequests} />
                <Stack.Screen name='ManageUsers' component={ManageUsers} />
                <Stack.Screen name='ManageInvestments' component={ManageInvestments} />
        
                <Stack.Screen name='LearningAdmin' component={LearningAdmin} />
                <Stack.Screen name='UserDetails' component={UserDetails} />
                <Stack.Screen name='Verification' component={Verification}/>
                <Stack.Screen name='EmailVerification' component={EmailVerification}/>
                <Stack.Screen name='AdminDocumentVerification' component={AdminDocumentVerification}/>
                <Stack.Screen name='Blocked' component={Blocked}/>
                <Stack.Screen name='ManageWalletAddresses' component={ManageWalletAddresses}/>
                <Stack.Screen name='ManageUserAgreement' component={ManageUserAgreement}/>
                <Stack.Screen name='ManagePrivacyPolicy' component={ManagePrivacyPolicy}/>
                <Stack.Screen name='ManageAboutUs' component={ManageAboutUs}/>
                <Stack.Screen name='AboutUs' component={AboutUs}/>
                <Stack.Screen name='Privacy' component={Privacy}/>
                <Stack.Screen name='UserAgreement' component={UserAgreement}/>
                <Stack.Screen name='ManagePopUp' component={ManagePopUp}/>
                <Stack.Screen name='ManagePlans' component={ManagePlans}/>
                <Stack.Screen name='OneTimePercentage' component={OneTimePercentage}/>
                <Stack.Screen name='UserHistory' component={UserHistory}/>
                <Stack.Screen name='SetWithdrawal' component={SetWithdrawal}/>
                <Stack.Screen name='TransactionHistory' component={TransactionHistory}/>
                <Stack.Screen name='Learning' component={Learning}/>
                <Stack.Screen name='AddAmount' component={AddAmount}/>
                <Stack.Screen name='ManageSupportLinks' component={ManageSupportLinks}/>
                <Stack.Screen name='CompletedContracts' component={CompletedContracts}/>
                <Stack.Screen name='ManageApprovedUsers' component={ManageApprovedUsers}/>

              </Stack.Navigator>
            </NavigationContainer>
          )
      }
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});