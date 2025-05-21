import { configureStore } from '@reduxjs/toolkit';
import { handexApi } from './handexApi';
import authReducer from './authSlices';

export const store = configureStore({
    reducer: {
        [handexApi.reducerPath]: handexApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(handexApi.middleware),
});



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch