import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NDcyOTgyNSwiZXhwIjoxNzQ0ODE2MjI1fQ.ESrqkPgJlP_k46tagiBU5R_mSrAE5Ojb6FF_iannhQw'
export const handexApi = createApi({
    reducerPath: 'handexApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
    tagTypes: ['Statistics', 'HomeHero', 'Customers'],
    endpoints: (builder) => ({
        getGeneral: builder.query({
            query: () => '/general',
            providesTags: ['Statistics']
        }),

        addStatistics: builder.mutation({
            query: (params) => ({
                url: '/general/update',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        getHeroHome: builder.query({
            query: (lang) => `/content/hero?lang=${lang}`,
            providesTags: ['HomeHero']
        }),
        addHero: builder.mutation({
            query: ({ params, id }) => ({
                url: `/content/${id}`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(params)
            }),
        }),
        getCustomers: builder.query({
            query: (lang) => `/customers?lang=${lang}`,
            providesTags: ['Customers']
        }),
        uploadFile: builder.mutation({
            query: (file) => ({
                url: '/upload/image',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: file
            })
        })
    }),
})

export const {
    useGetGeneralQuery,
    useAddStatisticsMutation,
    useGetHeroHomeQuery,
    useAddHeroMutation,
    useGetCustomersQuery,
    useUploadFileMutation
} = handexApi