import { createSlice } from "@reduxjs/toolkit";

export type Languages = 'en'|'hi'|'pn'|'mr'|'te'|'kn'

const initialState: Languages = 'en'

const languageSlice = createSlice({
    name:'Language',
    initialState,
    reducers:{
        setLanguage(state, actions) {
            state = actions.payload;
            return state;
        }
    }

})

export const {setLanguage} = languageSlice.actions;
export default languageSlice.reducer;