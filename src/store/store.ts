import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import qrReducer from './qrSlice';
import rootSaga from "../saga/sagas"; // Adjust the path

// Initialize Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create the store
const store = configureStore({
    reducer: {
        qr: qrReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
