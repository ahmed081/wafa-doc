import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Adjust the path based on your structure

export default function MainScreen({ navigation }: { navigation: any }) {
    // Access Redux state
    const linkedData = useSelector((state: RootState) => state.qr.linkedData);
    const isLinked = useSelector((state: RootState) => state.qr.isLinked);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Main Screen</Text>
            {isLinked ? (
                <Text style={styles.text}>Linked Data: {linkedData}</Text>
            ) : (
                <Text style={styles.text}>No linked data. Scan a QR code to link!</Text>
            )}
            <Button
                title="Go to QR Scanner"
                onPress={() => navigation.navigate('QRScanner')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        marginBottom: 24,
    },
});
