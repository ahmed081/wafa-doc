import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux'; // Import Provider
import MainScreen from './src/screens/MainScreen';
import QRScanner from './src/components/QRScanner';
import store from "./src/store/store";

const Stack = createStackNavigator();

export default function App() {
    return (
        // Wrap the app with the Redux Provider
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Main">
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="QRScanner" component={QRScanner} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
