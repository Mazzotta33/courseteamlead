// src/Redux/api/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5231/api', // ← укажи свой бэкенд
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'account/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        registerUser: builder.mutation({
            query: (newUser) => ({
                url: 'account/registeruser',
                method: 'POST',
                body: newUser,
            }),
        }),
        registerAdmin: builder.mutation({
            query: (newAdmin) => ({
                url: 'account/registeradmin',
                method: 'POST',
                body: newAdmin,
            }),
        }),
        getMe: builder.query({
            query: () => '/me',
        }),
    }),
});

export const { useLoginMutation, useRegisterUserMutation, useRegisterAdminMutation } = authApi;
