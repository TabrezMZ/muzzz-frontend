import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authSlice from '../features/auth/authSlice';
import { playlistApi } from '../features/playlist/playlistApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [playlistApi.reducerPath]: playlistApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, playlistApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
