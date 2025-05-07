import { configureStore } from '@reduxjs/toolkit';
import { handexApi } from './handexApi';

export const store = configureStore({
    reducer: {
        [handexApi.reducerPath]: handexApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(handexApi.middleware),
});



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch