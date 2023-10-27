import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import auth from '../config';
import { background, primary } from '../color';
import Lightbox from 'react-native-lightbox-v2';

const AdminDocumentVerification = ({ navigation }) => {
  const db = getDatabase();
  const [usersData, setUsersData] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    // Fetch user documents data from the database
    const usersRef = ref(db, 'Documents');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.entries(data).map(([username, userData]) => ({
          username,
          userData,
        }));
        setUsersData(usersArray);
      }
    });
  }, []);

  const verifyDocument = (username) => {
    // Update the verification status of the user's document
    const documentRef = ref(db, `Documents/${username}`);
    update(documentRef, {  verified: true })
      .then(() => {
        // Document verification successful
        navigation.goBack()
        Alert.alert('Success', `Document for user ${username} verified.`);
      })
      .catch((error) => {
        // Handle error
        Alert.alert('Error', 'Failed to verify document. Please try again.');
      });
  };
  const declineRequest = (username) => {
    // Update the verification status of the user's document
    const documentRef = ref(db, `Documents/${username}`);
    update(documentRef, {  verified: 'declined' })
      .then(() => {
        // Document verification successful
        Alert.alert('Success', `Document for user ${username} verified.`);
        navigation.goBack()
      })
      .catch((error) => {
        // Handle error
        Alert.alert('Error', 'Failed to verify document. Please try again.');
      });
  };


  const renderItem = ({ item, index }) => (
    <View style={styles.userContainer}>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
      <Text style={styles.username}>User: {item.username}</Text>
      <Text style={[styles.username, {fontSize:16}]}>
        Status: {
        item.userData.verified === true ? 'Verified' : 'Not Verified'
        }
      </Text>
      </View>
      <Lightbox
        underlayColor="white"
        doubleTapZoomEnabled
        renderContent={() => (
          <Image     
            source={{ uri: item.userData.frontImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        )}
      >
        <Image
          source={{ uri: item.userData.frontImage }}
          style={styles.documentImage}
          resizeMode="contain"
        />
      </Lightbox>
      <Lightbox
        underlayColor="white"
        doubleTapZoomEnabled
        renderContent={() => (
          <Image
            source={{ uri: item.userData.backImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        )}
      >
        <Image
          source={{ uri: item.userData.backImage }}
          style={styles.documentImage}
          resizeMode="contain"
        />
      </Lightbox>
      {!item.userData.verified && (
        <TouchableOpacity onPress={() => verifyDocument(item.username)} style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>Verify Document</Text>
        </TouchableOpacity>
      )}

{!item.userData.verified && (
        <TouchableOpacity onPress={() => declineRequest(item.username)} style={[styles.verifyButton, {backgroundColor:'red', marginTop:5}]}>
          <Text style={styles.verifyButtonText}>Decline Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <AntDesign
        name="left"
        style={{ marginTop: 35, marginBottom: 20 }}
        size={24}
        onPress={() => navigation.goBack()}
      />
      <FlatList
        data={usersData}
        keyExtractor={(item) => item.username}
        renderItem={renderItem}
        contentContainerStyle={styles.userList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: background,
  },
  userContainer: {
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft:20
  },
  documentImage: {
    width: '95%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderColor:'black',
    borderWidth:0.5,
    alignSelf:'center',
    borderRadius:20
  },
  fullScreenImage: {
    flex: 1,
  },
  verifyButton: {
    backgroundColor: primary,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userList: {
    paddingBottom: 20,
  },
});

export default AdminDocumentVerification;
