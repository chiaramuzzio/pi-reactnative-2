import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import { auth } from "../firebase/config";
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Post from '../screens/Post';
import UserMenu from './UserMenu';

const Tab = createBottomTabNavigator();

class HomeMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (!user) {
                this.props.navigation.navigate("Login");
            }
        });
        this.setState({ loading: false });
    }

    render() {
        return (
            <Tab.Navigator screenOptions={{ tabBarShowLabel: false, headerShown: false }}>
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{ tabBarIcon: () => <Feather name="home" size={24} color="black" /> }}
                />
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{ tabBarIcon: () => <Feather name="user" size={24} color="black" /> }}
                />
                <Tab.Screen
                    name="Users"
                    component={UserMenu}
                    options={{ tabBarIcon: () => <Feather name="users" size={24} color="black" /> }}
                />
                <Tab.Screen
                    name="Post"
                    component={Post}
                    options={{ tabBarIcon: () => <Feather name="feather" size={24} color="black" /> }}
                />
              
            </Tab.Navigator>
        );
    }
}

export default HomeMenu;