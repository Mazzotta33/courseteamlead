// src/Redux/api/testApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Определяем новый API для работы с тестами
export const testApi = createApi({
    // Уникальный путь в состоянии Redux для редьюсера этого API
    reducerPath: 'testApi',
    // Базовый URL для всех запросов в этом API
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5231/api', // Предполагаем, что базовый URL тот же
        prepareHeaders: (headers, { getState }) => {
            // Получаем токен аутентификации из состояния authSlice
            const token = getState().auth.token;
            if (token) {
                // Добавляем токен в заголовок Authorization
                headers.set('authorization', `Bearer ${token}`);
            }
            // RTK Query автоматически установит Content-Type: application/json для запросов с телом,
            // если body является объектом или массивом. Явно устанавливать его не нужно.
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Мутация для создания тестов
        createTests: builder.mutation({
            query: ({ lessonId, testsData }) => ({
                url: `tests/lesson/${lessonId}`, // Эндпоинт из Swagger UI
                method: 'POST',
                body: testsData, // Массив объектов вопросов в формате, ожидаемом бэкендом
            }),
            // Здесь можно добавить invalidatesTags или providesTags для управления кэшем тестов, если это необходимо.
            // invalidatesTags: ['Tests'], // Пример
        }),

    }),
});

export const { useCreateTestsMutation } = testApi;