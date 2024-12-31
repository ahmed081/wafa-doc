import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QRState {
    linkedData: QRCodePayload | null; // Stores data from the scanned QR code
    isLinked: boolean; // Tracks if the app is linked with the web app
}

const initialState: QRState = {
    linkedData: null,
    isLinked: false,
};

const qrSlice = createSlice({
    name: 'qr',
    initialState,
    reducers: {
        // Action to set linked data after a QR code is scanned
        setLinkedData(state, action: PayloadAction<QRCodePayload>) {
            state.linkedData = action.payload;
            state.isLinked = true;
        },
        // Action to clear linked data (e.g., unlink the app)
        clearLinkedData(state) {
            state.linkedData = null;
            state.isLinked = false;
        },
    },
});

export const { setLinkedData, clearLinkedData } = qrSlice.actions;

export default qrSlice.reducer;
