import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Transactions from './Transactions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Account from './Account';
import { background, primary } from '../color';

const Tab = createBottomTabNavigator();

const Dashboard = () => {
  return (
      <Tab.Navigator
      initialRouteName='Home'
        screenOptions={{
          activeTintColor: primary, // Primary color for active tab
          inactiveTintColor: 'gray', // Default color for inactive tab
          style: {
            backgroundColor: background, // Background color for the tab bar
          },
          
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarActiveTintColor:primary,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Requests"
          component={Transactions}
          options={{
            tabBarActiveTintColor:primary,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="md-wallet" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarActiveTintColor:primary,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
  
  );
};

export default Dashboard;
