import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker'; // Updated import
import { getStorage, uploadBytes, ref as StorageRef, getDownloadURL } from 'firebase/storage';
import {
  getDatabase,
  ref as DatabaseRef,
  push,
  set,
  child,
  get,
  DataSnapshot,
} from 'firebase/database';
import { getAuth } from 'firebase/auth';

const DocumentVerification = ({ navigation }) => {
  const [frontImageUri, setFrontImageUri] = useState(null);
  const [backImageUri, setBackImageUri] = useState(null);
  const [loading, setLoading] = useState(false)
  const storage = getStorage(); // Initialize Firebase Storage reference
  const db = getDatabase(); // Initialize Firebase Database reference
  const auth = getAuth();
  const handleImageUpload = async (isFrontImage) => {
    try {
      setLoading(true)
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to grant camera roll permission to upload images.');
        return;
      }

      const imagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      };

      const result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

      if (!result.canceled) {
        const selectedImages = result.assets;
        const uploadedImageUrls = [];

        // Loop through the selected images and upload each one
        for (let i = 0; i < selectedImages.length; i++) {
          try {
            const imageUri = selectedImages[i].uri;
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const fileExtension = imageUri.split('.').pop();
            const fileName = `${Date.now()}_${i}.${fileExtension}`;

            const storageRef = StorageRef(storage, `Document_image/${fileName}`);
            await uploadBytes(storageRef, blob);

            const downloadUrl = await getDownloadURL(storageRef);
            uploadedImageUrls.push(downloadUrl);

            if (isFrontImage) {
              setFrontImageUri(downloadUrl)
            } else {
              setBackImageUri(downloadUrl)
            }
            console.log(uploadedImageUrls);
            if (frontImageUri && backImageUri) {
              setLoading(false);
            } else {
              setLoading(false)
            }

          } catch (error) {
            console.log('Error uploading image:', error);
            Alert.alert('Something went wrong');
          }
        }

        // Now you have an array of uploaded image URLs
        // Do something with these URLs, if needed
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload the image. Please try again.');
    }
  };

  const sendForVerification = () => {
    // Check if both front and back images are uploaded
    if (!frontImageUri || !backImageUri) {
      Alert.alert('Incomplete Upload', 'Please upload both front and back ID images.');
      return;
    }

    // Create a new document for verification in the user's node
    const user = auth.currentUser;
    const userRef = DatabaseRef(db, `Documents/${user.displayName}`);

    // Define the document data
    const documentData = {
      frontImage: frontImageUri,
      backImage: backImageUri,
      verified: false, // Initial verification status
    };

    // Push the document data to the user's node
    set((userRef), documentData)
      .then(() => {
        // Documents sent for verification successfully
        Alert.alert('Verification Request Sent', 'Your documents have been sent for verification.');
        navigation.goBack();
        setFrontImageUri('')
        setBackImageUri('')
        // You can also navigate the user to another screen or perform other actions here
      })
      .catch((error) => {
        console.error('Error sending documents for verification', error);
        Alert.alert('Error', 'Failed to send verification request. Please try again.');
      });
  };


  return (
    <View style={styles.container}>
      {
        loading ?
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator />
          </View>
          :
          <View >
            <AntDesign
              name="left"
              style={{ marginTop: 35, marginBottom: 20 }}
              size={24}
              onPress={() => navigation.goBack()}
            />
            <View style={styles.imageContainer}>
              {frontImageUri ? (
                <Image source={{ uri: frontImageUri }} style={styles.image} />
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleImageUpload(true)}
                >
                  <Text style={styles.uploadButtonText}>Upload Front ID</Text>
                </TouchableOpacity>
              )}
              {backImageUri ? (
                <Image source={{ uri: backImageUri }} style={styles.image} />
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleImageUpload(false)}
                >
                  <Text style={styles.uploadButtonText}>Upload Back ID</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.verificationButton} onPress={sendForVerification}>
              <Text style={styles.verificationButtonText}>Send for Verification</Text>
            </TouchableOpacity>
          </View>
      }
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  uploadButton: {
    width: 150,
    height: 150,
    backgroundColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verificationButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 20,
    alignItems: 'center',
  },
  verificationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default DocumentVerification;
