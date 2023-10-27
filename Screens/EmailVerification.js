import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';


const EmailVerification = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <AntDesign name='left' style={{ marginTop: 35, marginBottom: 20 }} size={24} onPress={() => navigation.goBack()} />
        </View>

    )
}

export default EmailVerification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 15
    }
})