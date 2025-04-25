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
            query: ({ courseId, params, lessonData }) => ({
                url: `courses/${courseId}/lessons`,
                method: 'POST',
                body: lessonData,
                params: params,
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
        }),
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}/allusersprogress`,
                method: 'GET',
            })
        }),
        deleteLesson: builder.mutation({
            query: ({courseId, lessonId}) => ({
                url: `courses/${courseId}/lessons/${lessonId}`,
                method: 'DELETE',
            })
        }),
        deleteCourse: builder.mutation({
            query: (courseId) =>({
                url: `courses/${courseId}`,
                method: 'DELETE'
            })
        }),
        getAdminCoursesProgress: builder.query({
           query: () => ({
               url: `courses/admincoursesprogress`,
               method: 'GET',
           })
        }),
        isAdminOfCourse: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}/checkadmin`,
                method: 'GET',
            })
        }),
        downloadCourseProgress: builder.query({
            query: (courseId) => ({
                url: `courses/${courseId}/usersprogress/download`,
                method: 'GET',
                responseHandler: async (response) => {
                    if (!response.ok) {
                        try {
                            const errorBody = await response.json();
                            throw new Error(`HTTP error ${response.status}: ${errorBody.message || JSON.stringify(errorBody)}`);
                        } catch (e) {
                            const errorText = await response.text();
                            throw new Error(`HTTP error ${response.status}: ${errorText}`);
                        }
                    }
                    return response.text();
                },
            }),
        })

    })
});

export const { useGetCoursesQuery, useCreateCourseMutation,
    useCreateLessonMutation, useGetUsersQuery, useGetLessonsQuery,
useGetSoloLessonQuery, useGetPlatformProgressQuery} = coursesGetApi;