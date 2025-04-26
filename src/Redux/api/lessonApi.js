import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const lessonApi = createApi({
    reducerPath: 'lessonApi',
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
        createLesson: builder.mutation({
            query: ({ courseId, params, lessonData }) => ({
                url: `courses/${courseId}/lessons`,
                method: 'POST',
                body: lessonData,
                params: params,
            }),
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
        deleteLesson: builder.mutation({
            query: ({courseId, lessonId}) => ({
                url: `courses/${courseId}/lessons/${lessonId}`,
                method: 'DELETE',
            })
        }),
    })
});

export const {
    useCreateLessonMutation,
    useGetLessonsQuery,
    useGetSoloLessonQuery,
    useDeleteLessonMutation,} = lessonApi;