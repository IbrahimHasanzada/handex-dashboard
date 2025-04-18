import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NDkwMTA2NiwiZXhwIjoxNzQ0OTg3NDY2fQ.2i5LLK7fsU4lutydD5CzKyzahCIpR7XaNXs1X7LqmoE'
export const handexApi = createApi({
    reducerPath: 'handexApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
    tagTypes: ['Statistics', 'HomeHero', 'Customers', 'Graduates'],
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
        deleteCustomers: builder.mutation({
            query: (id) => ({
                url: `/customers/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
        }),
        addCustomers: builder.mutation({
            query: (params) => ({
                url: `/customers`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: params
            }),
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
        }),
        getProfiles: builder.query({
            query: (model) => `/profiles?model=${model}`,
            providesTags: ['Graduates']
        }),

    }),
})

export const {
    useGetGeneralQuery,
    useAddStatisticsMutation,
    useGetHeroHomeQuery,
    useAddHeroMutation,
    useGetCustomersQuery,
    useUploadFileMutation,
    useDeleteCustomersMutation,
    useAddCustomersMutation,
    useGetProfilesQuery
} = handexApi