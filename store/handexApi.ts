import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NTgzNzM4NiwiZXhwIjoxNzQ1OTIzNzg2fQ.-jmZuUOSMgAX2L2-ahSyz-AnYkuoIFBBmH7QR1xNMdc'
export const handexApi = createApi({
    reducerPath: 'handexApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.drafts.az/api' }),
    tagTypes: ['Statistics', 'HomeHero', 'Customers', 'Graduates', 'General', 'News'],
    endpoints: (builder) => ({
        getGeneral: builder.query({
            query: () => '/general',
            providesTags: ['Statistics']
        }),
        general: builder.mutation({
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
        updateCustomers: builder.mutation({
            query: ({ params, id }) => ({
                url: `/customers/${id}`,
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
        getNews: builder.query({
            query: (lang) => `/news?lang=${lang}`,
            providesTags: ['News']
        }),
        addNews: builder.mutation({
            query: (params) => ({
                url: `/news`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/news/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
        }),
        getNewsById: builder.query({
            query: ({ id, language }) => `/news/${id}?lang=${language}`,
            providesTags: ['News']
        }),
        updateNews: builder.mutation({
            query: ({ params, id }) => ({
                url: `/news/${id}`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),

    }),
})

export const {
    useGetGeneralQuery,
    useGeneralMutation,
    useGetHeroHomeQuery,
    useAddHeroMutation,
    useGetCustomersQuery,
    useUploadFileMutation,
    useDeleteCustomersMutation,
    useAddCustomersMutation,
    useGetProfilesQuery,
    useAddProfilesMutation,
    useDeleteProfilesMutation,
    useUpdateProfilesMutation,
    useUpdateCustomersMutation,
    useAddNewsMutation,
    useGetNewsQuery,
    useDeleteNewsMutation,
    useGetNewsByIdQuery,
    useUpdateNewsMutation
} = handexApi