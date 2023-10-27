import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { primary, background } from '../color';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Welcome = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const images = [
    require('../assets/slide1.png'),
    require('../assets/slide2.png'),
    require('../assets/slide3.png'),
  ];

  const handlePageChange = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const currentPage = Math.round(offset / windowWidth);
    setCurrentPage(currentPage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePageChange}>
        {images.map((image, index) => (
          <Image key={index} source={image} style={styles.img} />
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentPage ? primary : 'rgba(0, 0, 0, 0.2)',
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.main}>
        {/* <Text style={styles.txt_head}>
          Stay on top of your {'\n'}Profit with us
        </Text>
        <Text style={styles.txt}>
          We are your new financial Advisors {'\n'} to make the best investments
          for {'\n'}you.
        </Text> */}
        <TouchableOpacity
          style={styles.create_account_btn}
          onPress={() => {
            navigation.navigate('SignUp');
          }}>
          <Text style={styles.create_account_txt}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.login_btn}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={styles.login_btn_txt}>Login</Text>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
  },
  img: {
    height: windowHeight * 0.99,
    width: windowWidth,
  },
  txt_head: {
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    marginTop: windowHeight * 0.02,
  },
  txt: {
    fontWeight: '600',
    color: '#4F4F4F',
    marginTop: windowHeight * 0.03,
    marginHorizontal: windowWidth * 0.1,
    textAlign: 'center',
    fontSize: 16,
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  create_account_btn: {
    alignSelf: 'center',
    width: windowWidth * 0.8,
    backgroundColor: primary,
    height: windowHeight * 0.07,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  create_account_txt: {
    color: background,
    fontWeight: '700',
  },
  login_btn: {
    alignSelf: 'center',
  },
  login_btn_txt: {
    color: primary,
    margin: windowHeight * 0.02,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});
