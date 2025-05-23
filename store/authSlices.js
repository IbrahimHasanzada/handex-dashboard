import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const initialState = {
    token: Cookies.get('token') || null,
    isAuthenticated: !!Cookies.get('token'),
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            state.token = payload
            state.isAuthenticated = !!payload
            if (payload) {
                Cookies.set('token', payload, { expires: 1 })
            } else {
                Cookies.remove('token')
            }
        },
    },
})

export const { setCredentials } = authSlice.actions
export default authSlice.reducer