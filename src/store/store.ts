import { configureStore } from "@reduxjs/toolkit";
import locationReducer from './locationSlice';
import languageReducer from './languageSlice';

const store = configureStore({
    reducer: {
        location: locationReducer,
        language: languageReducer,
    }
})

export type StoreSelector = ReturnType<typeof store.getState>

export default store;