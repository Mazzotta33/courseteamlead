import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const coursesGetApi = createApi({
    reducerPath: 'coursesGetApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5231/api',
        prepareHeaders: (headers, {getState}) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: () => ({
                url: 'courses/mycourses',
                method: 'GET',
            })
        }),
        createCourse: builder.mutation({
            query: (courseData) => ({
                url: 'courses',
                method: 'POST',
                body: courseData,
            }),
        }),
        createLesson: builder.mutation({
            // Теперь принимаем все три: courseId, params, lessonData
            query: ({ courseId, params, lessonData }) => ({
                url: `courses/${courseId}/lessons`,
                method: 'POST',
                body: lessonData, // Отправляем FormData в теле
                params: params,   // <-- ВОТ ЧТО НУЖНО ДОБАВИТЬ, чтобы отправить query-параметры
            }),
        }),
        getUsers: builder.query({
            query: (id) => ({
                url: `courses/${id}/users`,
                method: 'GET'
            })
        }),
        getLessons: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}/lessons`,
                method: 'GET'
            })
        }),
        getSoloLesson: builder.query({
            query: ({courseId, lessonId}) => ({
                url: `courses/${courseId}/lessons/${lessonId}`,
                method: 'GET',
            })
        }),
        getPlatformProgress: builder.query({
            query: () => ({
                url: `courses/platformprogress`,
                method: 'GET',
            })
        })

    })
});

export const { useGetCoursesQuery, useCreateCourseMutation,
    useCreateLessonMutation, useGetUsersQuery, useGetLessonsQuery,
useGetSoloLessonQuery, useGetPlatformProgressQuery} = coursesGetApi;