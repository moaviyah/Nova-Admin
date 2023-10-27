import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  getDatabase,
  ref,
  update,
  onValue,
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo
import { primary } from '../color';

const ManagePopUp = ({ navigation }) => {
  const db = getDatabase();
  const popUpConfigRef = ref(db, 'popupConfig'); // Reference to the pop-up configuration in the database
  const storage = getStorage();
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false); // State to track if the pop-up is enabled
  const [popUpText, setPopUpText] = useState(''); // State to store the pop-up text
  const [popUpImageURL, setPopUpImageURL] = useState(''); // State to store the image URL

  useEffect(() => {
    // Fetch pop-up configuration from the database
    onValue(popUpConfigRef, (snapshot) => {
      if (snapshot.exists()) {
        const config = snapshot.val();
        setIsEnabled(config.isEnabled);
        setPopUpText(config.text);
        setPopUpImageURL(config.imageUrl);
        setLoading(false);
      }
    });
  }, []);

  // Function to open the image picker
  const selectImage = async () => {
    try {
      setLoading(true);
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Denied',
          'You need to grant camera roll permission to upload images.'
        );
        return;
      }

      const imagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      };

      const result =
        await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();

          const fileExtension = imageUri.split('.').pop();
          const fileName = `PopUp_image.${fileExtension}`;

          const storageReference = storageRef(storage, fileName);
          await uploadBytes(storageReference, blob);

          const downloadUrl = await getDownloadURL(storageReference);
          setPopUpImageURL(downloadUrl);
          setLoading(false);
          console.log('Image Uploaded Successfully');
        } catch (error) {
          console.log('Error uploading image:', error);
          Alert.alert('Something went wrong');
        }
       
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload the image. Please try again.');
    }
  };

  // Function to save the pop-up configuration to the database
  const savePopUpConfig = () => {
    const configToUpdate = {
      isEnabled: isEnabled,
      text: popUpText,
      imageUrl: popUpImageURL, // Save the image URL
    };

    // Update the pop-up configuration in the database
    update(popUpConfigRef, configToUpdate)
      .then(() => {
        console.log('Pop-up configuration saved successfully.');
        Alert.alert('Pop Up configuration Saved Successfully');
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Error saving pop-up configuration:', error);
        // Handle the error
      });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Manage Pop-Up</Text>
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Enable Pop-Up</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => setIsEnabled(value)}
              value={isEnabled}
            />
          </View>

          <Text style={styles.label}>Pop-Up Text:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            value={popUpText}
            onChangeText={(text) => setPopUpText(text)}
          />

          <Text style={styles.label}>Pop-Up Image:</Text>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={selectImage}
          >
            <AntDesign name="camera" size={40} color="#3498db" />
            <Text style={styles.imagePickerText}>Select an Image</Text>
          </TouchableOpacity>
          <View style={{alignItems:'center', width:'100%'}}>
          {popUpImageURL ? (
            
            <Image
              source={{ uri: popUpImageURL }}
              style={styles.selectedImage}
            />
            
          ) : null}
</View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={savePopUpConfig}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f3f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePickerText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#3498db',
  },
  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    alignSelf:'center'
  },
  saveButton: {
    backgroundColor: primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop:15
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManagePopUp;
