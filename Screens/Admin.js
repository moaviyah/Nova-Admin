import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { background } from '../color';

const Admin = ({ navigation }) => {
    const buttons = [
        { title: 'Manage Requests', icon: 'inbox', color: '#007bff', action: () => navigation.navigate('ManageRequests') },
        { title: 'Manage Plans', icon: 'calendar', color: '#3a5a40', action: () => navigation.navigate('ManagePlans') },
        { title: 'Manage All Users', icon: 'user', color: '#4caf50', action: () => navigation.navigate('ManageUsers') },
        { title: 'Manage Approved Users', icon: 'check', color: '#370617', action: () => navigation.navigate('ManageApprovedUsers') },
        { title: 'Manage Investments', icon: 'linechart', color: '#ff9800', action: () => navigation.navigate('ManageInvestments') },
        { title: 'Document Verification', icon: 'filetext1', color: '#f44336', action: () => navigation.navigate('AdminDocumentVerification') },
        { title: 'Learning Admin', icon: 'book', color: '#9c27b0', action: () => navigation.navigate('LearningAdmin') },
        { title: 'Manage Wallet Addresses', icon: 'wallet', color: '#e91e63', action: () => navigation.navigate('ManageWalletAddresses') },
        { title: 'User Agreement', icon: 'filetext1', color: '#2196F3', action: () => navigation.navigate('ManageUserAgreement') },
        { title: 'Privacy Policy', icon: 'lock', color: '#673AB7', action: () => navigation.navigate('ManagePrivacyPolicy') },
        { title: 'About Us', icon: 'info', color: '#FFC107', action: () => navigation.navigate('ManageAboutUs') },
        { title: 'Manage Pop-Ups', icon: 'notification', color: '#3c6e71', action: () => navigation.navigate('ManagePopUp') },
        { title: 'One Time Referral Percentage', icon: 'linechart', color: '#161a1d', action: () => navigation.navigate('OneTimePercentage') },
        { title: 'Manage Support Links', icon: 'customerservice', color: '#FF5722', action: () => navigation.navigate('ManageSupportLinks') },
        { title: 'Completed Contracts', icon: 'check', color: '#370617', action: () => navigation.navigate('CompletedContracts') },

    ];

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 30, }}>
                {/* <AntDesign name='left' style={{}} size={24} onPress={() => navigation.goBack()} /> */}
                <Text style={{ fontSize: 22, marginLeft: 10 }}>Admin Dashboard</Text>
            </View>
            <FlatList
                data={buttons}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: item.color }]}
                        onPress={item.action}
                    >
                        <AntDesign name={item.icon} size={24} color="#fff" />
                        <Text style={styles.buttonText}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        backgroundColor: background
    },
    button: {
        width: 170,
        height: 150,
        margin: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign:'center',
    },
});

export default Admin;
