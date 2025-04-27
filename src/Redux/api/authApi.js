// src/Redux/api/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5231/api',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['UserInfo', 'Users'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'account/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['UserInfo'],
        }),
        registerAdmin: builder.mutation({
            query: (newAdmin) => ({
                url: 'account/register',
                method: 'POST',
                body: newAdmin,
            }),
            invalidatesTags: ['Users'],
        }),
        getUserInfo: builder.query({
            query: () => ({
                url: `account/userinfo`,
                method: 'GET'
            }),
            providesTags: ['UserInfo'],
        }),
        telegramAuth: builder.mutation({
            query: (initDataString) => ({
                url: `account/telegramAuth`,
                method: 'POST',
                body: JSON.stringify(initDataString),
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
            invalidatesTags: ['UserInfo'],
        }),
        loadPhoto: builder.mutation({
            query: (arg) => ({
                url: `account/loadprofilephoto`,
                method: 'POST',
                body: arg,
            }),
            responseHandler: async (response) => {
                // Если ответ успешный (статус 2xx), читаем тело как текст
                if (response.ok) {
                    console.log("AuthApi responseHandler: Successful response, reading as text.");
                    return response.text(); // Читаем тело как простой текст (путь к фото)
                } else {
                    // Если ответ НЕ успешный (ошибка), пытаемся прочитать тело как JSON (типично для ошибок API)
                    // Если JSON не парсится, читаем как текст
                    console.log("AuthApi responseHandler: Error response, attempting JSON then text.");
                    try {
                        const errorBody = await response.json();
                        // Если парсинг JSON успешен, выбрасываем ошибку с сообщением из JSON или полным телом
                        console.error("AuthApi responseHandler: Parsed error body as JSON:", errorBody);
                        throw new Error(errorBody.message || JSON.stringify(errorBody));
                    } catch (e) {
                        // Если парсинг JSON провалился, читаем тело как текст и выбрасываем ошибку
                        const errorText = await response.text();
                        console.error("AuthApi responseHandler: Failed to parse error body as JSON, reading as text:", errorText);
                        throw new Error(errorText || `HTTP error ${response.status}`); // Выбрасываем ошибку с текстом или статусом
                    }
                }
            },
            invalidatesTags: ['UserInfo'],
        })
    }),
});

export const { useLoginMutation,
    useRegisterUserMutation,
    useRegisterAdminMutation,
    useGetUserInfoQuery,
    useTelegramAuthMutation,
    useLoadPhotoMutation} = authApi;
