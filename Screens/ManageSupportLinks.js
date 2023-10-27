import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { primary } from '../color';

const ManageSupportLinks = ({ navigation }) => {
  const [supportLink, setSupportLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load the support link from Firebase on component mount
  useEffect(() => {
    const db = getDatabase();
    const supportLinkRef = ref(db, 'supportLink');

    onValue(supportLinkRef, (snapshot) => {
      if (snapshot.exists()) {
        const link = snapshot.val();
        setSupportLink(link);
      }
    });
  }, []);

  // Function to handle updating the support link
  const handleUpdateLink = () => {
    const db = getDatabase();
    const supportLinkRef = ref(db, 'supportLink');

    // Update the support link in Firebase
    set(supportLinkRef, supportLink)
      .then(() => {
        alert('Support link updated successfully.');
        setSupportLink('')
      })
      .catch((error) => {
        console.error('Error updating support link:', error);
        alert('Failed to update support link. Please try again later.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AntDesign name='left' size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Manage Support Links</Text>
      </View>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.linkContainer}>
          <Text style={styles.label}>Support Link:</Text>
          <TextInput
            style={styles.input}
            value={supportLink}
            onChangeText={(text) => setSupportLink(text)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateLink}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  linkContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop:10
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManageSupportLinks;
