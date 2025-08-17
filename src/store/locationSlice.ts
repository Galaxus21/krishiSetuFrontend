import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    latitude: 0,
    longitude: 0
}

const locationSlice = createSlice({
    name:'Location',
    initialState,
    reducers:{
        setLocation(state, actions) {
            state = actions.payload;
            return state;
        }
    }

})

export const {setLocation} = locationSlice.actions;
export default locationSlice.reducer;