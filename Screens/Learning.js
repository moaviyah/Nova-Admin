import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Linking, Image, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue } from 'firebase/database';
import { primary } from '../color';

const Learning = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    // Fetch courses data from Firebase
    const coursesRef = ref(db, 'courses');
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the courses data to an array of objects
        const coursesArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setCourses(coursesArray);
      }
    });
  }, []);

  const openLink = (link) => {
    if (link) {
      Linking.openURL(link).catch((err) => Alert.alert('Error opening link'))
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AntDesign
        name="left"
        style={{ marginTop: 35, marginBottom: 20 }}
        size={24}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>Learning Contents</Text>
      </View>
      <View style={styles.learningList}>
        {courses?.map((course) => (
          <View key={course.id}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            {course.links?.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.learningItem}
                onPress={() => openLink(link.link)}
              >
                <View style={styles.learningText}>
                  <Text style={styles.learningTitle}>{link.title}</Text>
                  <Text style={styles.learningLink}>{link.link}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Learning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f7f7f7',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primary,
  },
  learningList: {
    marginTop: 20,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  learningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  learningText: {
    flex: 1,
  },
  learningTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  learningLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
