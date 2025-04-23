// src/Redux/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import { authApi } from '../api/authApi';
import { coursesGetApi } from '../api/coursesApi';
import {testApi} from "../api/testApi.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [coursesGetApi.reducerPath]: coursesGetApi.reducer,
        [testApi.reducerPath]: testApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            coursesGetApi.middleware,
            testApi.middleware),
});
