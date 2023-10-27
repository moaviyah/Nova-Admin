import React from 'react';
import { StyleSheet, ScrollView, Text, View, Image } from 'react-native';

const Guide = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems:'flex-end'}}>
      <Image source={require('../assets/TrustNOVALogo.png')} style={{height:100, width:130}}/>
      <View style={{flexDirection:'row'}}>
      <Text style={styles.title}>Take A Step Towards Success <Image source={require('../assets/success.png')} /></Text>
      
      </View>
      </View>
      <Text style={{ textAlign: 'justify' }}>
        Welcome to <Text style={styles.boldText}>Nova Trust </Text>, an innovative Android app that offers you the opportunity to invest
        in seven different levels, each represented by a star rating. This comprehensive guide will walk
        you through the process of investing with <Text style={styles.boldText}>Nova Trust </Text>, ensuring a secure and profitable
        experience.
      </Text>
      <Text style={styles.heading}>1. Getting Started:</Text>
      <Text style={{ textAlign: 'justify' }}>
        Open the Google Play Store on your Android device. {'\n'} Search for "Nova Trust" & install the app “<Text style={styles.boldText}>Nova Trust </Text>”. {'\n'}
        Creating an Account with a Referral Code. {'\n'} Provide your email address and create a secure password. & Sign in. Then Click on Verification Icon complete Email verification & also complete the ID verification process as instructed.
      </Text>

      <Text style={styles.heading}>2. Selecting Your Investment Level</Text>
      <Text style={{ textAlign: 'justify' }}>
        Exploring the Investment Levels, Nova Trust offers seven different investment levels, each with a specific investment amount and profit potential. {'\n'}
        One-Star Level: $200, {'\n'} Two-Star Level: $400, {'\n'} Three-Star Level: $600,{'\n'} Four-Star Level: $800,{'\n'} Five-Star Level: $1,000,{'\n'} Six-Star Level: $1,500,{'\n'} Seven-Star Level: $2,000.{'\n'}
      </Text>

      <Text style={styles.heading}>3. Making Your Initial Deposit</Text>
      <Text style={{ textAlign: 'justify' }}>
        Accessing the "Invest NOW" Tab. From the Home screen, click on "Invest NOW." {'\n'} Choose your desired investment level & Initiating a Deposit. {'\n'} Ensure you meet the specified conditions for deposit, including accepted networks and currency. {'\n'}
        Accepted Networks: USDT BEP20 & USDT TRC-20 {'\n'}
       <Text style={styles.boldText}> Investment Currency: USDT (Stable Currency).</Text>
      </Text>

      <Text style={styles.heading}>4. Setting Up Your Bybit & Bitget Accounts</Text>
      <Text style={{ textAlign: 'justify' }}>
       <Text style={styles.boldText}> Please Note: It is a condition that the user must follow. {'\n'}</Text> “Create accounts on Bybit and Bitget using Nova Trust's referral code.”{'\n'}
        BYBIT Referral Code:<Text style={styles.boldText}> YVWO8J </Text> {'\n'}
        BITGET Referral Code:<Text style={styles.boldText}>  DT4XZTRA </Text> {'\n'}
        Completing ID Verification on <Text style={styles.boldText}> BYBIT </Text>, making a Deposit on <Text style={styles.boldText}> BYBIT </Text> By P2P or transfer from Binance or other wallet to <Text style={styles.boldText}> BYBIT </Text> or <Text style={styles.boldText}> BITGET </Text> & then Transfer assets to your <Text style={styles.boldText}> “Nova Trust wallet.” </Text> {'\n'}
        <Text style={styles.boldText}> Maybe you have to setup Google Authentication, Mobile Number verification & Funds passwords for security & safety on BYBIT 0r BITGET. Set up as requested. </Text> {'\n'}
      </Text>
      <Text style={styles.heading}>5. How to Setup Google Authentication:</Text>
      <Text style={{ textAlign: 'justify' }}>
        <Text style={styles.boldText}>Install Google authenticator. Copy the key appeared on BYBIT or BITGET and set up in google authenticator as shown in the screenshot & then complete verification by time-based code appeared in authenticator. </Text> {'\n'}
        Now transfer USDT to the company wallet & paste <Text style={styles.boldText}> TxId & Submit.</Text> {'\n'}
        Nova Trust will review and verify your deposit & Once succeeded Congratulations you are now in business with <Text style={styles.boldText}> NovaTrust.</Text>
      </Text>
      <Text style={styles.heading}>6. Investment and Profit Distribution</Text>
      <Text style={{ textAlign: 'justify' }}>
        Nova Trust invests your funds in stocks, cryptocurrencies, trading, and other ethical businesses. <Text style={styles.boldText}> “We do not engage in gambling or interest-based activities” </Text> . Profit is distributed on the 1st and 16th of each month. You can earn up to five times your initial investment. On average 5 to 20 % turnover, one will get monthly. 
      </Text>

      <Text style={styles.warning}>7. Important:</Text>
      <Text style={{ textAlign: 'justify' }}>
       <Text style={styles.boldText}> Make sure you have deposited to the right & correct wallet address & Setup withdrawal wallet correctly. Any fund sent to the wrong address will be permanently lost. </Text>
      </Text>

      <Text style={styles.thankYou}>Thank you for choosing Nova Trust for your investment journey. We are committed to helping you achieve your financial goals in a secure and profitable manner. If you have any questions or need assistance, please don't hesitate to contact our support team.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    borderWidth:1,
    color:'purple',
    borderColor:'purple',
    padding:5,
    alignItems:'center'
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  warning: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'red',
  },
  thankYou: {
    fontSize: 16,
    paddingVertical: 20,
    textAlign: 'justify',
    fontWeight: '300'
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default Guide;
