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
                url: 'course/mycourses',
                method: 'GET',
            })
        }),
        createCourse: builder.mutation({
            query: (courseData) => ({
                url: 'course',
                method: 'POST',
                body: courseData,
            }),
        }),
        createLesson: builder.mutation({
            query: ({ courseId, lessonData }) => ({
                url: `courses/${courseId}/lessons`,
                method: 'POST',
                body: lessonData,
            }),
        }),
        getUsers: builder.query({
            query: (id) => ({
                url: `course/${id}/users`,
                method: 'GET'
            })
        }),
        getLessons: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}/lessons`,
                method: 'GET'
            })
        })
    })
});

export const { useGetCoursesQuery, useCreateCourseMutation,
    useCreateLessonMutation, useGetUsersQuery, useGetLessonsQuery} = coursesGetApi;
