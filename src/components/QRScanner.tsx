import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setLinkedData } from '../store/qrSlice';
import { Camera, CameraView } from 'expo-camera'; // Adjust the path
import { RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';

export default function QRScanner() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Not connected');
    const dispatch = useDispatch();

    const peerConnection = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        return () => {
            peerConnection.current?.close();
        };
    }, []);

    const setupPeerConnection = () => {
        peerConnection.current = new RTCPeerConnection();

        // Handle ICE candidates
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Mobile ICE Candidate:', event.candidate);
            }
        };

        peerConnection.current.onconnectionstatechange = () => {
            const state = peerConnection.current?.connectionState;
            setConnectionStatus(state || 'Unknown');
            console.log('Connection state changed:', state);
        };
    };

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        setScanned(true);

        try {
            const offer = JSON.parse(data); // Parse the SDP offer from the QR code
            setupPeerConnection();

            // Set the remote description (offer from the web app)
            const remoteDesc = new RTCSessionDescription(offer);
            await peerConnection.current?.setRemoteDescription(remoteDesc);

            // Create an SDP answer
            const answer = await peerConnection.current?.createAnswer();
            await peerConnection.current?.setLocalDescription(answer);

            // Dispatch the answer SDP to Redux (optional, for further use)
            dispatch(setLinkedData({ payload: JSON.stringify(answer) }));

            Alert.alert('Connection Established', `Answer sent to peer`, [
                { text: 'OK', onPress: () => setScanned(false) },
            ]);
        } catch (error) {
            console.error('Error handling QR code:', error);
            Alert.alert('Error', 'Invalid QR code data');
        }
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
                    <Text style={styles.statusText}>Status: {connectionStatus}</Text>
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
        alignItems: 'center',
    },
    statusText: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
    },
});
