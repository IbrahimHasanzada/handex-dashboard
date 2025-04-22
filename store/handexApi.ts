import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NTMyMjYxMSwiZXhwIjoxNzQ1NDA5MDExfQ.gjL33fuFYnYWRf7TqBUWANm6nS746aQWBK2GgjDWQMI'
export const handexApi = createApi({
    reducerPath: 'handexApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.drafts.az/api' }),
    tagTypes: ['Statistics', 'HomeHero', 'Customers', 'Graduates', 'General'],
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
                url: '/upload/single',
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
        addProfiles: builder.mutation({
            query: (params) => ({
                url: `/profiles`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        updateProfiles: builder.mutation({
            query: ({ params, id }) => ({
                url: `/profiles/${id}`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        deleteProfiles: builder.mutation({
            query: (id) => ({
                url: `/profiles/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
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
    useGetProfilesQuery,
    useAddProfilesMutation,
    useDeleteProfilesMutation,
    useUpdateProfilesMutation
} = handexApi