// src/Redux/api/testApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const testApi = createApi({
    reducerPath: 'testApi',
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
    endpoints: (builder) => ({
        createTests: builder.mutation({
            query: ({ lessonId, testsData }) => ({
                url: `tests/lesson/${lessonId}`,
                method: 'POST',
                body: testsData,
            }),
        }),
        getLessonTest: builder.query({
            query: (lessonId) => ({
                url: `tests/lesson/${lessonId}`,
                method: 'GET'
            })
        }),
        submitTestResult: builder.mutation({
            query: ({lessonId, params}) => ({ // Ожидаем объект с параметрами запроса (score, testId)
                url: `tests/lesson/${lessonId}/submitresult`,
                method: 'POST',
                params: params, // <-- Отправляем данные как query-параметры
                // Тело запроса (body) не требуется согласно новому Swagger скриншоту
                // body: undefined, // Можно явно указать undefined или просто не включать свойство body
            }),
        })

    }),
});

export const { useCreateTestsMutation ,
    useGetLessonTestQuery,
    useSubmitTestResultMutation} = testApi;