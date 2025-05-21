"use client"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const handexApi = createApi({
    reducerPath: 'handexApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.drafts.az/api',
        prepareHeaders: (headers, { getState, endpoint, type, url }: any) => {
            if (type === 'query' || endpoint === '/auth/login') {
                return headers
            }
            const token = getState().auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ['Statistics', 'HomeHero', 'Customers', 'Graduates', 'General', 'News', 'Blog', 'Service', 'Projects', 'Meta'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (params) => ({
                url: '/auth/login',
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(params)
            }),
        }),
        getGeneral: builder.query({
            query: () => '/general',
            providesTags: ['Statistics']
        }),
        general: builder.mutation({
            query: (params) => ({
                url: '/general/update',
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        getHero: builder.query({
            query: ({ slug, lang }) => `/content/${slug}?lang=${lang}`,
        }),
        addHero: builder.mutation({
            query: ({ params, id }) => ({
                url: `/content/${id}`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(params)
            }),
        }),
        addContent: builder.mutation({
            query: (params) => ({
                url: '/content',
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(params)
            }),
        }),
        updateContent: builder.mutation({
            query: ({ params, id }) => ({
                url: `/content/${id}`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(params)
            }),
        }),
        deleteContent: builder.mutation({
            query: (id) => ({
                url: `/content/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                },
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
            }),
        }),
        addCustomers: builder.mutation({
            query: (params) => ({
                url: `/customers`,
                method: 'POST',
                headers: {
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
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        uploadFile: builder.mutation({
            query: (file) => ({
                url: '/upload/single',
                method: 'POST',
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
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        deleteProfiles: builder.mutation({
            query: (id) => ({
                url: `/profiles/${id}`,
                method: 'DELETE',
            })
        }),
        getNews: builder.query({
            query: ({ lang, page }) => `/news?lang=${lang}&page=${page}`,
            providesTags: ['News']
        }),
        addNews: builder.mutation({
            query: (params) => ({
                url: `/news`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/news/${id}`,
                method: 'DELETE',
            }),
        }),
        getNewsBySlug: builder.query({
            query: ({ slug, language }) => `/news/${slug}?lang=${language}`,
            providesTags: ['News']
        }),
        updateNews: builder.mutation({
            query: ({ params, id }) => ({
                url: `/news/${id}`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        getBlogs: builder.query({
            query: ({ lang, page }) => `/blogs?lang=${lang}&page=${page}`,
            providesTags: ['Blog']
        }),
        addBlogs: builder.mutation({
            query: (params) => ({
                url: `/blogs`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        deleteBlogs: builder.mutation({
            query: (id) => ({
                url: `/blog/${id}`,
                method: 'DELETE',
            }),
        }),
        getBlogsBySlug: builder.query({
            query: ({ slug, language }) => `/blogs/${slug}?lang=${language}`,
            providesTags: ['Blog']
        }),
        updateBlogs: builder.mutation({
            query: ({ params, id }) => ({
                url: `/blogs/${id}`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        getService: builder.query({
            query: ({ lang, page }) => `/service?lang=${lang}&page=${page}`,
            providesTags: ['Service']
        }),
        addService: builder.mutation({
            query: (params) => ({
                url: `/service`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `/service/${id}`,
                method: 'DELETE',
            }),
        }),
        getServiceBySlug: builder.query({
            query: ({ slug, language }) => `/service/${slug}?lang=${language}`,
            providesTags: ['Service']
        }),
        updateService: builder.mutation({
            query: ({ params, id }) => ({
                url: `/service/${id}`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        getProjects: builder.query({
            query: ({ lang, page }) => `/project?lang=${lang}&page=${page}`,
            providesTags: ['Projects']
        }),
        addProjects: builder.mutation({
            query: (params) => ({
                url: `/project`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        deleteProjects: builder.mutation({
            query: (id) => ({
                url: `/project/${id}`,
                method: 'DELETE',
            }),
        }),
        getProjectsBySlug: builder.query({
            query: ({ slug, language }) => `/project/${slug}?lang=${language}`,
            providesTags: ['Projects']
        }),
        updateProjects: builder.mutation({
            query: ({ params, id }) => ({
                url: `/project/${id}`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        addSectionAbout: builder.mutation({
            query: (params) => ({
                url: `/section`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        getAbout: builder.query({
            query: (language) => `/about?lang=${language}`,
        }),
        updateAbout: builder.mutation({
            query: (params) => ({
                url: `/about/update`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        editSections: builder.mutation({
            query: ({ params, id }) => ({
                url: `/section/${id}`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        deleteSections: builder.mutation({
            query: (id) => ({
                url: `/section/${id}`,
                method: 'DELETE',
            }),
        }),
        addMeta: builder.mutation({
            query: (params) => ({
                url: `/meta`,
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: params
            }),
        }),
        getMeta: builder.query({
            query: ({ language, slug }) => `/meta/${slug}?lang=${language}`,
            providesTags: ['Meta']

        }),
        deleteMeta: builder.mutation({
            query: (id) => ({
                url: `/meta/${id}`,
                method: 'DELETE',
            }),
        }),

    }),
})

export const {
    useGetGeneralQuery,
    useGeneralMutation,
    useGetHeroQuery,
    useAddHeroMutation,
    useAddContentMutation,
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
    useGetNewsBySlugQuery,
    useUpdateNewsMutation,
    useLoginMutation,
    useAddBlogsMutation,
    useDeleteBlogsMutation,
    useGetBlogsBySlugQuery,
    useGetBlogsQuery,
    useUpdateBlogsMutation,
    useGetServiceQuery,
    useAddServiceMutation,
    useDeleteServiceMutation,
    useGetServiceBySlugQuery,
    useUpdateServiceMutation,
    useAddProjectsMutation,
    useGetProjectsBySlugQuery,
    useGetProjectsQuery,
    useDeleteProjectsMutation,
    useUpdateProjectsMutation,
    useDeleteContentMutation,
    useUpdateContentMutation,
    useAddSectionAboutMutation,
    useGetAboutQuery,
    useUpdateAboutMutation,
    useDeleteSectionsMutation,
    useAddMetaMutation,
    useGetMetaQuery,
    useDeleteMetaMutation,
    useEditSectionsMutation

} = handexApi