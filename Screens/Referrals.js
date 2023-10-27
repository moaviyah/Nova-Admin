import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Clipboard, ActivityIndicator, Alert, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue, off, update, get } from "firebase/database";
import { getAuth } from 'firebase/auth';

const Referrals = ({ navigation }) => {
  const auth = getAuth()
  const username = auth.currentUser?.displayName; // Replace with the user's referral code
  const [userReferrals, setUserReferrals] = useState()
  const [loading, setLoading] = useState(true)
  const db = getDatabase()
  useEffect(() => {
    const unsubscribe = get(ref(db, `users/${username}/referrals`)) // Corrected path to referrals
      .then((snapshot) => {
        if (snapshot.exists()) {
          const referralsData = snapshot.val();
          const referralsArray = Object.keys(referralsData).map((key) => ({
            username: key,
            profit: referralsData[key].profit,
          }));
          setUserReferrals(referralsArray);
        } else {
          setUserReferrals()
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching user information: ', error);
        setLoading(false);
      });

    return () => {
      // Unsubscribe when the component unmounts
      unsubscribe;
    };
  }, [db, username]);

  const copyToClipboard = () => {
    Clipboard.setString(referralCode);
    alert('Referral code copied to clipboard!');
  };

  // ...

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View>
          <View style={{ flexDirection: 'row', marginTop: 35, marginBottom: 20, justifyContent: 'space-between', alignItems: 'center' }}>
            <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
            <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
          </View>

          <Text style={styles.title}>Referrals</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.description}>
              Share your referral code with friends and earn rewards when they join and earn:
            </Text>
            <Text style={styles.referralCode}>@{username}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
            </TouchableOpacity>
          </View>
          {userReferrals !== undefined && ( // Check if userReferrals is defined
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
              <Text style={[styles.title,]}>Your Total Referrals</Text>
              <Text style={[styles.title, { fontSize: 18 }]}>
                {userReferrals.length}
              </Text>
            </View>

          )}{userReferrals?.map((referral, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, paddingHorizontal: 7 }}>
              <Text style={{ fontSize: 16 }}>{referral.username}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backIcon: {
    marginTop: 35,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contentContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  referralCode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  copyButton: {
    backgroundColor: '#007bff', // Change to your desired button color
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Referrals;
