import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { primary } from '../color';
import { getAuth, signOut } from "firebase/auth";



const Blocked = ({ navigation }) => {
  const auth = getAuth()
    const handleSignOut = () => {
        signOut(auth)
          .then(() => {
            console.log('signed out')
            navigation.navigate('Welcome')
          })
          .catch((error) => {
            console.log("Error logging out:", error);
          });
      }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Account is Blocked</Text>
      <Text style={styles.message}>
        Your account has been blocked by the administrator. If you believe this
        is a mistake, please contact the administrator.
      </Text>
      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactText}>Contact Administrator</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderColor: primary,
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: primary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Blocked;
