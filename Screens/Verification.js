import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { sendEmailVerification, reload, getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

const Verification = ({ navigation }) => {
  const auth = getAuth()
  const user = auth.currentUser;
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  const db = getDatabase();

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
          if(verificationStatus === true){
            setIsDocumentVerified(true);
          }else if(verificationStatus === false){
            setIsDocumentVerified(false)
          }else{
            setIsDocumentVerified('Declined')
          }
          console.log(verificationStatus)
        } else {
          setIsDocumentVerified(false);
        }
      });
    };

    getVerificationStatus();
    return () => unsubscribe();
  }, []);

  const sendVerification = () => {
    setIsSendingVerification(true);
    sendEmailVerification(user)
      .then(() => {
        // Email verification link sent successfully
        setIsSendingVerification(false);
        Alert.alert("Email Verification Link Sent", "Please check your inbox.");
        reload(user);
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error sending email verification link', error);
        Alert.alert("Error", error.message);
        setIsSendingVerification(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Verification</Text>
        <Image source={require('../assets/TrustNOVALogo.png')} style={{ height: 60, width: 80 }} />
      </View>
      
      
      <View style={styles.buttonsContainer}>
      <Text style={styles.statusText}>
        Email Verification Status: {isEmailVerified ? 'Verified' : 'Not Verified'}
      </Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isEmailVerified ? '#2ecc71' : '#3498db',
            },
          ]}
          onPress={sendVerification}
          disabled={isSendingVerification}
        >
          {isSendingVerification ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <AntDesign name="mail" size={24} color="#fff" />
              <Text style={styles.buttonText}>
                {isEmailVerified ? 'Resend Verification' : 'Email Verification'}
              </Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.statusText}>
        Document Verification Status: {isDocumentVerified}
      </Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isDocumentVerified === true ? '#2ecc71' : '#e74c3c',
            },
          ]}
          onPress={() => {
            navigation.navigate('DocumentVerification');
          }}
          disabled={isDocumentVerified === true}
        >
          <AntDesign name="filetext1" size={24} color="#fff" />
          <Text style={styles.buttonText}>
            {isDocumentVerified === true ? 'Verified' : 'Verify ID Document'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 35,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#333',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginTop: 20,
  },
  buttonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Verification;
