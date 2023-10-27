import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, push, onValue, off, set } from 'firebase/database';
import { primary, background } from '../color';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LearningAdmin = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null); // Selected course for editing
  const [editedTitle, setEditedTitle] = useState(''); // Edited title
  const [editedLink, setEditedLink] = useState(''); // Edited link
  const [editedLinkTitle, setEditedLinkTitle] = useState(''); // Edited link title
  const db = getDatabase();

  useEffect(() => {
    // Fetch courses data from the Firebase Realtime Database
    const coursesRef = ref(db, 'courses');

    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the courses data to an array of objects
        const coursesArray = Object.keys(data).map((key) => ({
          id: key,
          title: data[key].title,
          links: data[key].links || [], // Add links data
        }));
        setCourses(coursesArray);
      } else {
        setCourses([]);
      }
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      off(coursesRef, 'value', unsubscribe);
    };
  }, [db]);

  const addCourse = async () => {
    if (newCourseTitle.trim() === '') {
      return;
    }

    const courseRef = ref(db, 'courses');
    const newCourse = {
      title: newCourseTitle,
      links: [], // Initialize links as an empty array
    };

    try {
      await push(courseRef, newCourse);
      setNewCourseTitle('');
      setIsAddingCourse(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const editCourse = (course) => {
    setSelectedCourse(course);
    setEditedTitle(course.title);
    setEditedLink(''); // Reset edited link when editing
  };

  const addLinkToCourse = async () => {
    if (!selectedCourse || editedLink.trim() === '' || editedLinkTitle.trim() === '') {
      return;
    }

    const courseRef = ref(db, `courses/${selectedCourse.id}`);
    const updatedLinks = [
      ...selectedCourse.links,
      { title: editedLinkTitle, link: editedLink }, // Store title and link as an object
    ];

    try {
      await set(courseRef, { ...selectedCourse, links: updatedLinks });
      setSelectedCourse(null);
      setEditedTitle('');
      setEditedLink('');
      setEditedLinkTitle('');
    } catch (error) {
      console.error('Error adding link to course:', error);
    }
  };

  const deleteCourse = async (courseId) => {
    const courseRef = ref(db, `courses/${courseId}`);

    try {
      // Delete the course from Firebase
      await set(courseRef, null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const deleteLinkFromCourse = async (courseId, linkIndex) => {
    console.log(courseId, linkIndex)
    const courseRef = ref(db, `courses/${courseId}/links/${linkIndex}`);
    try {
      await set(courseRef, null)
    } catch (error) {
      console.log('error: ', error)
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>LearningAdmin</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingCourse(!isAddingCourse)}
        >
          <Text style={styles.addButtonText}>Create Course</Text>
        </TouchableOpacity>
      </View>

      {isAddingCourse && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter course title"
            value={newCourseTitle}
            onChangeText={(text) => setNewCourseTitle(text)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={addCourse}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            {selectedCourse === item ? (
                <View style={styles.editForm}>
                <Text>Course Title:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter course title"
                  value={editedTitle}
                  onChangeText={(text) => setEditedTitle(text)}
                />
                <Text>Link Title:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter link title"
                  value={editedLinkTitle}
                  onChangeText={(text) => setEditedLinkTitle(text)}
                />
                <Text>Link:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter link"
                  value={editedLink}
                  onChangeText={(text) => setEditedLink(text)}
                />
                
                <TouchableOpacity style={styles.addLinkButton} onPress={addLinkToCourse}>
                  <Text style={styles.saveButtonText}>Add Link</Text>
                </TouchableOpacity>
                {item.links.map((link, index) => (
                  <View key={index} style={{ borderWidth: 0.5, margin: 5, borderRadius: 15, paddingHorizontal: 10, paddingVertical: 10 }}>
                  <Text>Title: {link.title}</Text>
                  <Text>Link: {link.link}</Text>
                </View>
                ))}
              </View>
            ) : (
              <>
                <Text style={styles.courseTitle}>{item.title}</Text>
                {item.links.map((link, index) => (
                  <View key={index} style={{borderWidth:0.5, margin:5,borderRadius:15, paddingHorizontal:10, paddingVertical:10, flexDirection:'row', justifyContent:'space-between'}}>
                    <View>
                    <Text>Title: {link.title}</Text>
                    <Text>Link: {link.link}</Text>
                    </View>
                    <TouchableOpacity
                    style={{backgroundColor:'red', paddingVertical:10, borderRadius:15, marginTop:10, paddingHorizontal:10}}
                    onPress={() => deleteLinkFromCourse(item.id, index)}
                  >
                    <Ionicons name='trash' color={'white'} size={24}/>
                    
                  </TouchableOpacity>
                  </View>
                ))}
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editCourse(item)}
                  >
                    <Text style={{color:'white', fontWeight:'bold'}}>Add Link</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteCourse(item.id)}
                  >
                    <Text style={{color:'white', fontWeight:'bold'}}>Delete Course</Text>
                  </TouchableOpacity>
                
                </View>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 16,
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: primary,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addLinkButton: {
    backgroundColor: primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  courseItem: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttons: {
    flexDirection: 'row',
    marginHorizontal:10,
    marginVertical:10,
    alignItems:'center'
  },
  editButton: {
    backgroundColor: '#83c5be',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
    paddingVertical:5
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft:0,
    paddingHorizontal:10
  },
  editForm: {
    flex: 1,
  },
});

export default LearningAdmin;

