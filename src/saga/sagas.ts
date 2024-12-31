import { all, takeEvery, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {setLinkedData} from "../store/qrSlice";

// Define the payload type for the action


// Worker saga: handles QR code data
function* handleQRCodeScanned(action: PayloadAction<QRCodePayload>) {
    try {
        console.log('Linking with web app using:', action.payload);

        // Simulate a side effect or API call here
        // Example: yield call(api.linkWithWebApp, action.payload);

        // Optionally, dispatch another action or update the state
        yield put(setLinkedData(action.payload));
    } catch (error) {
        console.error('Error handling QR code:', error);
        // Handle the error (e.g., dispatch a failure action)
    }
}

// Watcher saga: listens for `setLinkedData` actions
function* watchQRCodeScanned() {
    yield takeEvery('qr/setLinkedData', handleQRCodeScanned);
}

// Root saga: combines all sagas
export default function* rootSaga() {
    yield all([
        watchQRCodeScanned(),
        // Add more watchers here as needed
    ]);
}
