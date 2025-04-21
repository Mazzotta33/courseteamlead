import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const coursesApi = createApi({
    reducerPath: 'coursesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5231/api',
        prepareHeaders: (headers, {getState}) => {
            const token = getState().auth.token;
            console.log("Token from state:", token);
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: () => ({
                url: 'course',
                method: 'GET',
            })
        })
    })
});

export const { useGetCoursesQuery } = coursesApi;