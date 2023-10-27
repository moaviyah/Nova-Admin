import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Alert, ScrollView, KeyboardAvoidingView, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { background, primary } from '../color';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { CalendarList } from 'react-native-calendars';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function SignUp({ navigation }) {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [referral, setReferral] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState()
    const [country, setCountry] = useState()
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const showDobPicker = () => {
        setShowDatePicker(true);
    };
    const hideDobPicker = () => {
        setShowDatePicker(false);
    };
    const auth = getAuth();
    const db = getDatabase();
    const countries = [
        { label: 'Afghanistan', value: 'Afghanistan' },
        { label: 'Albania', value: 'Albania' },
        { label: 'Algeria', value: 'Algeria' },
        { label: 'Andorra', value: 'Andorra' },
        { label: 'Angola', value: 'Angola' },
        { label: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
        { label: 'Argentina', value: 'Argentina' },
        { label: 'Armenia', value: 'Armenia' },
        { label: 'Australia', value: 'Australia' },
        { label: 'Austria', value: 'Austria' },
        { label: 'Azerbaijan', value: 'Azerbaijan' },
        { label: 'Bahamas', value: 'Bahamas' },
        { label: 'Bahrain', value: 'Bahrain' },
        { label: 'Bangladesh', value: 'Bangladesh' },
        { label: 'Barbados', value: 'Barbados' },
        { label: 'Belarus', value: 'Belarus' },
        { label: 'Belgium', value: 'Belgium' },
        { label: 'Belize', value: 'Belize' },
        { label: 'Benin', value: 'Benin' },
        { label: 'Bhutan', value: 'Bhutan' },
        { label: 'Bolivia', value: 'Bolivia' },
        { label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
        { label: 'Botswana', value: 'Botswana' },
        { label: 'Brazil', value: 'Brazil' },
        { label: 'Brunei', value: 'Brunei' },
        { label: 'Bulgaria', value: 'Bulgaria' },
        { label: 'Burkina Faso', value: 'Burkina Faso' },
        { label: 'Burundi', value: 'Burundi' },
        { label: 'Cabo Verde', value: 'Cabo Verde' },
        { label: 'Cambodia', value: 'Cambodia' },
        { label: 'Cameroon', value: 'Cameroon' },
        { label: 'Canada', value: 'Canada' },
        { label: 'Central African Republic', value: 'Central African Republic' },
        { label: 'Chad', value: 'Chad' },
        { label: 'Chile', value: 'Chile' },
        { label: 'China', value: 'China' },
        { label: 'Colombia', value: 'Colombia' },
        { label: 'Comoros', value: 'Comoros' },
        { label: 'Congo (Brazzaville)', value: 'Congo (Brazzaville)' },
        { label: 'Congo (Kinshasa)', value: 'Congo (Kinshasa)' },
        { label: 'Costa Rica', value: 'Costa Rica' },
        { label: 'Croatia', value: 'Croatia' },
        { label: 'Cuba', value: 'Cuba' },
        { label: 'Cyprus', value: 'Cyprus' },
        { label: 'Czech Republic', value: 'Czech Republic' },
        { label: 'Denmark', value: 'Denmark' },
        { label: 'Djibouti', value: 'Djibouti' },
        { label: 'Dominica', value: 'Dominica' },
        { label: 'Dominican Republic', value: 'Dominican Republic' },
        { label: 'East Timor (Timor-Leste)', value: 'East Timor (Timor-Leste)' },
        { label: 'Ecuador', value: 'Ecuador' },
        { label: 'Egypt', value: 'Egypt' },
        { label: 'El Salvador', value: 'El Salvador' },
        { label: 'Equatorial Guinea', value: 'Equatorial Guinea' },
        { label: 'Eritrea', value: 'Eritrea' },
        { label: 'Estonia', value: 'Estonia' },
        { label: 'Eswatini', value: 'Eswatini' },
        { label: 'Ethiopia', value: 'Ethiopia' },
        { label: 'Fiji', value: 'Fiji' },
        { label: 'Finland', value: 'Finland' },
        { label: 'France', value: 'France' },
        { label: 'Gabon', value: 'Gabon' },
        { label: 'Gambia', value: 'Gambia' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Germany', value: 'Germany' },
        { label: 'Ghana', value: 'Ghana' },
        { label: 'Greece', value: 'Greece' },
        { label: 'Grenada', value: 'Grenada' },
        { label: 'Guatemala', value: 'Guatemala' },
        { label: 'Guinea', value: 'Guinea' },
        { label: 'Guinea-Bissau', value: 'Guinea-Bissau' },
        { label: 'Guyana', value: 'Guyana' },
        { label: 'Haiti', value: 'Haiti' },
        { label: 'Honduras', value: 'Honduras' },
        { label: 'Hungary', value: 'Hungary' },
        { label: 'Iceland', value: 'Iceland' },
        { label: 'India', value: 'India' },
        { label: 'Indonesia', value: 'Indonesia' },
        { label: 'Iran', value: 'Iran' },
        { label: 'Iraq', value: 'Iraq' },
        { label: 'Ireland', value: 'Ireland' },
        { label: 'Israel', value: 'Israel' },
        { label: 'Italy', value: 'Italy' },
        { label: 'Ivory Coast', value: 'Ivory Coast' },
        { label: 'Jamaica', value: 'Jamaica' },
        { label: 'Japan', value: 'Japan' },
        { label: 'Jordan', value: 'Jordan' },
        { label: 'Kazakhstan', value: 'Kazakhstan' },
        { label: 'Kenya', value: 'Kenya' },
        { label: 'Kiribati', value: 'Kiribati' },
        { label: 'Kosovo', value: 'Kosovo' },
        { label: 'Kuwait', value: 'Kuwait' },
        { label: 'Kyrgyzstan', value: 'Kyrgyzstan' },
        { label: 'Laos', value: 'Laos' },
        { label: 'Latvia', value: 'Latvia' },
        { label: 'Lebanon', value: 'Lebanon' },
        { label: 'Lesotho', value: 'Lesotho' },
        { label: 'Liberia', value: 'Liberia' },
        { label: 'Libya', value: 'Libya' },
        { label: 'Liechtenstein', value: 'Liechtenstein' },
        { label: 'Lithuania', value: 'Lithuania' },
        { label: 'Luxembourg', value: 'Luxembourg' },
        { label: 'North Macedonia', value: 'North Macedonia' },
        { label: 'Madagascar', value: 'Madagascar' },
        { label: 'Malawi', value: 'Malawi' },
        { label: 'Malaysia', value: 'Malaysia' },
        { label: 'Maldives', value: 'Maldives' },
        { label: 'Mali', value: 'Mali' },
        { label: 'Malta', value: 'Malta' },
        { label: 'Marshall Islands', value: 'Marshall Islands' },
        { label: 'Mauritania', value: 'Mauritania' },
        { label: 'Mauritius', value: 'Mauritius' },
        { label: 'Mexico', value: 'Mexico' },
        { label: 'Micronesia', value: 'Micronesia' },
        { label: 'Moldova', value: 'Moldova' },
        { label: 'Monaco', value: 'Monaco' },
        { label: 'Mongolia', value: 'Mongolia' },
        { label: 'Montenegro', value: 'Montenegro' },
        { label: 'Morocco', value: 'Morocco' },
        { label: 'Mozambique', value: 'Mozambique' },
        { label: 'Myanmar (Burma)', value: 'Myanmar (Burma)' },
        { label: 'Namibia', value: 'Namibia' },
        { label: 'Nauru', value: 'Nauru' },
        { label: 'Nepal', value: 'Nepal' },
        { label: 'Netherlands', value: 'Netherlands' },
        { label: 'New Zealand', value: 'New Zealand' },
        { label: 'Nicaragua', value: 'Nicaragua' },
        { label: 'Niger', value: 'Niger' },
        { label: 'Nigeria', value: 'Nigeria' },
        { label: 'North Korea', value: 'North Korea' },
        { label: 'Norway', value: 'Norway' },
        { label: 'Oman', value: 'Oman' },
        { label: 'Pakistan', value: 'Pakistan' },
        { label: 'Palau', value: 'Palau' },
        { label: 'Palestine', value: 'Palestine' },
        { label: 'Panama', value: 'Panama' },
        { label: 'Papua New Guinea', value: 'Papua New Guinea' },
        { label: 'Paraguay', value: 'Paraguay' },
        { label: 'Peru', value: 'Peru' },
        { label: 'Philippines', value: 'Philippines' },
        { label: 'Poland', value: 'Poland' },
        { label: 'Portugal', value: 'Portugal' },
        { label: 'Qatar', value: 'Qatar' },
        { label: 'Romania', value: 'Romania' },
        { label: 'Russia', value: 'Russia' },
        { label: 'Rwanda', value: 'Rwanda' },
        { label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
        { label: 'Saint Lucia', value: 'Saint Lucia' },
        { label: 'Saint Vincent and the Grenadines', value: 'Saint Vincent and the Grenadines' },
        { label: 'Samoa', value: 'Samoa' },
        { label: 'San Marino', value: 'San Marino' },
        { label: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
        { label: 'Saudi Arabia', value: 'Saudi Arabia' },
        { label: 'Senegal', value: 'Senegal' },
        { label: 'Serbia', value: 'Serbia' },
        { label: 'Seychelles', value: 'Seychelles' },
        { label: 'Sierra Leone', value: 'Sierra Leone' },
        { label: 'Singapore', value: 'Singapore' },
        { label: 'Slovakia', value: 'Slovakia' },
        { label: 'Slovenia', value: 'Slovenia' },
        { label: 'Solomon Islands', value: 'Solomon Islands' },
        { label: 'Somalia', value: 'Somalia' },
        { label: 'South Africa', value: 'South Africa' },
        { label: 'South Korea', value: 'South Korea' },
        { label: 'South Sudan', value: 'South Sudan' },
        { label: 'Spain', value: 'Spain' },
        { label: 'Sri Lanka', value: 'Sri Lanka' },
        { label: 'Sudan', value: 'Sudan' },
        { label: 'Suriname', value: 'Suriname' },
        { label: 'Sweden', value: 'Sweden' },
        { label: 'Switzerland', value: 'Switzerland' },
        { label: 'Syria', value: 'Syria' },
        { label: 'Taiwan', value: 'Taiwan' },
        { label: 'Tajikistan', value: 'Tajikistan' },
        { label: 'Tanzania', value: 'Tanzania' },
        { label: 'Thailand', value: 'Thailand' },
        { label: 'Timor-Leste', value: 'Timor-Leste' },
        { label: 'Togo', value: 'Togo' },
        { label: 'Tonga', value: 'Tonga' },
        { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
        { label: 'Tunisia', value: 'Tunisia' },
        { label: 'Turkey', value: 'Turkey' },
        { label: 'Turkmenistan', value: 'Turkmenistan' },
        { label: 'Tuvalu', value: 'Tuvalu' },
        { label: 'Uganda', value: 'Uganda' },
        { label: 'Ukraine', value: 'Ukraine' },
        { label: 'United Arab Emirates', value: 'United Arab Emirates' },
        { label: 'United Kingdom', value: 'United Kingdom' },
        { label: 'United States', value: 'United States' },
        { label: 'Uruguay', value: 'Uruguay' },
        { label: 'Uzbekistan', value: 'Uzbekistan' },
        { label: 'Vanuatu', value: 'Vanuatu' },
        { label: 'Vatican City', value: 'Vatican City' },
        { label: 'Venezuela', value: 'Venezuela' },
        { label: 'Vietnam', value: 'Vietnam' },
        { label: 'Yemen', value: 'Yemen' },
        { label: 'Zambia', value: 'Zambia' },
        { label: 'Zimbabwe', value: 'Zimbabwe' },
    ];

    const generateUniqueCode = () => {
        const characters = '0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    };

    const userData = {
        name: fullName,
        email: email,
        password: password,
        balance: 0,
        plan: 0,
        earned: 0,
        referredBy: referral,
        dateOfBirth: dateOfBirth,
        country: country,
        firstRefferalPayment: false,
        refferalEarning: 0
    };

    const handleSignUp = (email, password, displayName, referralId) => {
        if (!fullName || !email || !password || !dateOfBirth || !country || !referral) {
            Alert.alert('All fields are mandatory');
        } else {
            const username = generateUniqueCode();
            console.log(username);
            const referralRef = ref(db, `users/${referralId}`);

            get(referralRef)
                .then((referralSnapshot) => {
                    if (referralSnapshot.exists()) {
                        // Create the user
                        createUserWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                const user = userCredential.user;
                                console.log('User created:', user.uid);
                                updateProfile(user, { displayName: username })
                                    .then(() => {
                                        console.log('Display name updated:', displayName);
                                        const userTimestamp = dateOfBirth ? dateOfBirth.getTime() : null; // Convert date to timestamp
                                        set(ref(db, `users/${username}`), { ...userData, dateOfBirth: userTimestamp })
                                            .then(() => {
                                                console.log('User information saved successfully.');
                                                navigation.navigate('Dashboard');
                                                setEmail('');
                                                setPassword('');
                                                setFullName('');
                                            })
                                            .catch((error) => {
                                                console.error('Error saving user information: ', error);
                                            });

                                        set(ref(db, `users/${referral}/referrals/${username}`), {
                                            profit: 0,
                                            approved: false
                                        });
                                    })
                                    .catch((error) => {
                                        console.log('Error updating display name:', error);
                                        const errMsg = error.message.split(':')[1];
                                        setError(errMsg);
                                        setError(error);
                                    });
                            })
                            .catch((error) => {
                                console.log('Error creating user:', error);
                                const errMsg = error.message.split(':')[1];
                                setError(errMsg);
                            });
                    } else {
                        setError('Referral ID is invalid. Please enter a valid referral ID.');
                        console.log(error);
                    }
                })
                .catch((error) => {
                    console.error('Error checking referral ID: ', error);
                });
        }
    };


    // const handleSignUp =()=>{
    //     createUserWithEmailAndPassword(auth, email, password)
    // }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.top}>
                    <Ionicons name='chevron-back-sharp' style={styles.icon} size={26} onPress={() => { navigation.goBack(); }} />
                    <Text style={styles.main_heading}>Create an account</Text>
                    <Text style={styles.second_heading}>Invest with us & earn profit regularly</Text>
                </View>
                <KeyboardAvoidingView style={styles.main}>

                    <TextInput placeholder='Full name*' placeholderTextColor={'#828282'} style={styles.input} onChangeText={(text) => { setFullName(text) }} value={fullName} />
                    <TextInput
                        placeholder="Referral"
                        placeholderTextColor="#828282"
                        style={styles.input}
                        onChangeText={(text) => {
                            setReferral(text);
                        }}
                        value={referral}
                    />
                    {/* <TouchableOpacity onPress={showDobPicker} style={{}}> 
                        <View style={[styles.input, {paddingVertical:7}]}>
                            <Text style={{color:'grey'}}> Date of Birth</Text>
                            <Text>{dateOfBirth ? formatDate(dateOfBirth) : 'Select'}</Text>
                        </View>
                    </TouchableOpacity> */}
                    <Pressable onPress={() => showDobPicker()}>
                        <TextInput
                            placeholder="Date of Birth"
                            placeholderTextColor="#828282"
                            style={styles.input}
                            onChangeText={(text) => {
                                setDateOfBirth(text);
                            }}
                            value={dateOfBirth ? dateOfBirth.toDateString() : ''} // Format Date to a string
                            editable={false}
                        />
                    </Pressable>
                    {showDatePicker && (
                        <DateTimePicker
                            mode='date'
                            display='spinner'
                            value={dateOfBirth || new Date()} // Convert the dateOfBirth to a Date object or use a default Date
                            onChange={({ type }, date) => {
                                if (type === 'set') {
                                    setDateOfBirth(date);
                                    console.log(date)
                                    hideDobPicker();
                                } else {
                                    hideDobPicker();
                                }
                            }}
                        />
                    )}

                    {/* {showDatePicker && (
                        <DatePicker
                            style={styles.input}
                            date={dateOfBirth}
                            value={dateOfBirth}
                            mode="date"
                            format="DD\\MM\\YYYY"
                            minDate="01-01-1900"
                            maxDate={new Date()}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            showIcon={false}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0,
                                },
                            }}
                            
                            onChange={(date) => {
                                console.log(date.nativeEvent.timestamp)
                                toggleDatePicker(); // Close the date picker
                                setDateOfBirth(date);
                            }}
                        />
                    )} */}

                    <View style={[styles.input, {}]}>
                        <Picker
                            selectedValue={country}
                            onValueChange={(itemValue) => setCountry(itemValue)}
                            style={{}}
                            itemStyle={{}}
                        >
                            {countries.map((country) => (
                                <Picker.Item
                                    label={country.label}
                                    value={country.value}
                                    key={country.value}
                                />
                            ))}
                        </Picker>
                    </View>


                    <TextInput placeholder='Email address*' placeholderTextColor={'#828282'} style={styles.input} onChangeText={(text) => { setEmail(text) }} value={email} autoCapitalize="none" />
                    <View style={styles.passwordInput}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#828282"
                            style={styles.passwordField}
                            secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 5 }}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={24}
                                color="#000"
                            />
                        </TouchableOpacity>
                    </View>
                    {error ? <Text style={{ color: 'red', alignSelf: 'center' }}>{error}</Text> : null}
                    <View style={styles.termsContainer}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setTermsAccepted(!termsAccepted)}
                        >
                            {termsAccepted ? (
                                <Ionicons name="checkbox" size={24} color={primary} />
                            ) : (
                                <Ionicons name="checkbox-outline" size={24} color={"grey"} />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                            By creating an account, you must accept the terms and conditions
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.btn}
                        onPress={() => {
                            if (termsAccepted) {
                                handleSignUp(email, password, fullName, referral);
                            } else {
                                Alert.alert('Please accept the terms and conditions to create an account.');
                            }
                        }}
                    >
                        <Text style={styles.btn_txt} >
                            Create account
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.login_txt} onPress={() => { navigation.navigate('Login') }}>
                        Already have an account?
                    </Text>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: background
    },
    icon: {
        marginVertical: 30,
        marginHorizontal: 10
    },
    main_heading: {
        fontSize: 28,
        textAlign: "center",
        fontWeight: '700'
    },
    second_heading: {
        fontSize: 18,
        textAlign: 'center',
        color: '#4F4F4F',
        fontWeight: '500',
        margin: windowHeight * 0.01
    },
    main: {
        marginTop: windowHeight * 0.05
    },
    input: {
        height: windowHeight * 0.08,
        marginHorizontal: windowHeight * 0.04,
        marginVertical: windowHeight * 0.015,
        borderWidth: 1,
        borderColor: '#828282',
        borderRadius: 10,
        paddingHorizontal: 15
    },
    btn: {
        height: windowHeight * 0.08,
        width: windowWidth * 0.85,
        alignSelf: 'center',
        backgroundColor: '#31A062',
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    btn_txt: {
        color: '#fff',
        fontSize: 18,
        fontWeight: "600"
    },
    login_txt: {
        color: '#31A062',
        fontSize: 18,
        marginTop: windowHeight * 0.05,
        textAlign: 'center',
        fontWeight: "600"
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: windowHeight * 0.08,
        marginHorizontal: windowHeight * 0.04,
        marginVertical: windowHeight * 0.015,
        borderWidth: 1,
        borderColor: '#828282',
        borderRadius: 10,
        padding: 15,
    },
    passwordField: {
        flex: 1,
        fontSize: 16,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },

    checkbox: {
        marginRight: 10,
    },

    termsText: {
        color: 'grey',
    },


});