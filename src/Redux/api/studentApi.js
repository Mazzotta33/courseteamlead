import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const myCoursesGetApi = createApi({
    reducerPath: 'myCoursesGetApi',
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
    tagTypes: ['MyCourses', 'AllCourses', 'Course', 'RegistrationStatus', 'CoursePreview', 'CourseUsers', 'CourseProgress', 'PlatformStats'],
    endpoints: (builder) => ({
        getMyCourses: builder.query({
            query: () => ({
                url: 'courses/mycourses',
                method: 'GET',
            }),
            providesTags: ['MyCourses'],
        }),
        getAllCourses: builder.query({
            query: () => ({
                url: 'courses',
                method: 'GET',
            }),
            providesTags: ['AllCourses'],
        }),
        getCourse: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}`,
                method: 'GET',
            }),
            invalidatesTags: ['Course'],
        }),
        isRegistered: builder.query({
            query: (id) => ({
                url: `courses/${id}/checkregister`,
                method: 'GET',
            }),
            invalidatesTags: ['RegistrationStatus'],
        }),
        getCoursePreview: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}/foruser`,
                method: 'GET',
            }),
            invalidatesTags: ['CoursePreview'],
        }),
        registerUser: builder.mutation({
            query: (courseId) => ({
                url: `courses/register?courseId=${courseId}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            providesTags: ['RegistrationStatus'],
        }),
        deleteUser: builder.mutation({
            query: ({courseId, telegramUsername}) => ({
                url: `courses/unregister`,
                method: 'DELETE',
                params: { courseId, telegramUsername },
            }),
            providesTags: ['RegistrationStatus'],
        }),

    })
});

export const { useGetMyCoursesQuery,
    useGetAllCoursesQuery,
    useGetCourseQuery,
    useIsRegisteredQuery,
    useGetCoursePreviewQuery,
    useRegisterUserMutation,
    useDeleteUserMutation} = myCoursesGetApi;