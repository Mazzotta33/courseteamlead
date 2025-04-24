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
    endpoints: (builder) => ({
        getMyCourses: builder.query({
            query: () => ({
                url: 'courses/mycourses',
                method: 'GET',
            })
        }),
        getAllCourses: builder.query({
            query: () => ({
                url: 'courses',
                method: 'GET',
            })
        }),
        getCourse: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}`,
                method: 'GET',
            })
        }),
        isRegistered: builder.query({
            query: (id) => ({
                url: `courses/${id}/checkregister`,
                method: 'GET',
            })
        }),
        getCoursePreview: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}/foruser`,
                method: 'GET',
            })
        }),
        registerUser: builder.mutation({
            query: (courseId) => ({
                url: `courses/register?courseId=${courseId}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }),
        getProfile: builder.query({
            query: () => ({
                url: 'account/userinfo',
                method: 'GET',
            })
        }),
    })
});

export const { useGetMyCoursesQuery, useGetAllCoursesQuery, useGetCourseQuery, useIsRegisteredQuery,
useGetCoursePreviewQuery, useRegisterUserMutation, useGetProfileQuery} = myCoursesGetApi;