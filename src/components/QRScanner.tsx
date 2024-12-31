import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setLinkedData } from '../store/qrSlice';
import {Camera, CameraView} from "expo-camera"; // Adjust the path

export default function QRScanner() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        dispatch(setLinkedData({payload: data})); // Dispatch the QR code data to Redux
        Alert.alert('QR Code Scanned', `Data: ${data}`, [
            { text: 'OK', onPress: () => setScanned(false) },
        ]);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission...</Text>;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing={'back'}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <View style={styles.buttonContainer}>
                    {scanned && (
                        <Button title="Scan Again" onPress={() => setScanned(false)} />
                    )}
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});
