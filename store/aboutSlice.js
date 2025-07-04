import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: []
}

const aboutSlice = createSlice({
    name: 'about',
    initialState,
    reducers: {
        addToAbout: (state, action) => {
            state.data.pop()
            state.data.push(action.payload)
        }
    }
})

export const { addToAbout } = aboutSlice.actions

export const aboutReducer = aboutSlice.reducer