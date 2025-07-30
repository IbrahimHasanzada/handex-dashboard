import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    model: "home"
}


const modelSlice = createSlice({
    name: "model",
    initialState,
    reducers: {
        changeModel: (state, action) => {
            state.model = action.payload
        }
    }
})

export const { changeModel } = modelSlice.actions

export const modelReducer = modelSlice.reducer