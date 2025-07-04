import { configureStore } from '@reduxjs/toolkit';
import { handexApi } from './handexApi';
import authReducer from './authSlices';
import { aboutReducer } from './aboutSlice';
export const store = configureStore({
    reducer: {
        [handexApi.reducerPath]: handexApi.reducer,
        auth: authReducer,
        about: aboutReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(handexApi.middleware),
});



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch