import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchUsers from '../screens/SearchUsers';
import User from '../screens/User';

const Stack = createNativeStackNavigator();

class UserMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="SearchUsers" component={SearchUsers} options={{ headerShown: false }} />
                <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }
}

export default UserMenu;