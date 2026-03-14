import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { constant } from "constant";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${constant["baseUrl"]}api`,
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Items"],
  endpoints: (builder) => ({
    fetchItems: builder.query({
      query: ({ path, params }) => {
        const queryString = new URLSearchParams(params).toString();
        return `${path}?${queryString}`;
      },
      providesTags: (result, error, { path, params }) => {
        const queryString = new URLSearchParams(params).toString();
        const cacheKey = `${path}?${queryString}`;

        if (result && Array.isArray(result)) {
          return [
            ...result.map(({ id }) => ({ type: "Items", id })),
            { type: "Items", id: cacheKey },
          ];
        }

        if (result && typeof result === "object" && result.data) {
          return [
            ...(Array.isArray(result.data)
              ? result.data.map(({ id }) => ({ type: "Items", id }))
              : []),
            { type: "Items", id: cacheKey },
          ];
        }

        return [{ type: "Items", id: cacheKey }];
      },
      keepUnusedDataFor: 10, // 10 seconds
    }),

    createItem: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "POST",
        body,
      }),
    }),

    // PUT request
    updateItem: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "PUT",
        body,
      }),
    }),

    // DELETE request
    deleteItem: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "DELETE",
        body,
      }),
    }),

    deleteManyInvoices: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Invoices"],
    }),

    downloadInvoice: builder.mutation({
      query: ({ invoiceNo }) => ({
        url: `/invoices/download/${invoiceNo}`,
        method: "POST",
        responseHandler: (response) => response.blob(),
      }),
    }),
    // createLeadQualification: builder.mutation({
    //   query: ({ leadId, createdBy, body }) => ({
    //     url: `/lead/qualifications`,
    //     method: "POST",
    //     params: {
    //       lead: leadId,
    //       createdBy,
    //     },
    //     body,
    //   }),
    // }),
    createLeadQualification: builder.mutation({
      query: ({ leadId, createdBy, body }) => ({
        url: `/lead/qualifications`,
        method: "POST",
        params: { lead: leadId, createdBy },
        body,
      }),
      // Invalidate the tag for this lead so getLeadQualification refetches
      invalidatesTags: (result, error, { leadId }) => [
        { type: "Items", id: leadId },
      ],
    }),

    // getLeadQualification: builder.query({
    //   query: ({ leadId, createdBy }) => ({
    //     url: `/lead/qualifications`,
    //     method: "GET",
    //     params: { lead: leadId, createdBy },
    //   }),
    //   transformResponse: (response) => response.doc, // returns array
    //   providesTags: (result, error, { leadId }) => [
    //     { type: "Items", id: leadId },
    //   ],
    // }),
    getLeadQualification: builder.query({
      query: ({ leadId, createdBy }) => ({
        url: `/lead/qualifications/lead/${leadId}`,
        method: "GET",
        // params: { lead: leadId },
      }),
      transformResponse: (response) => response.doc, // returns array
      providesTags: (result, error, { leadId }) => [
        { type: "Items", id: leadId },
      ],
    }),
    updateLeadQualification: builder.mutation({
      query: ({ qualificationId, leadId, createdBy, body }) => ({
        url: `/lead/qualifications/${qualificationId}`,
        method: "PUT",
        params: {
          lead: leadId,
          createdBy,
        },
        body,
      }),
      invalidatesTags: (result, error, { leadId }) => [
        { type: "Items", id: leadId },
      ],
    }),
    fetchItemsV2: builder.query({
      query: ({ path, params }) => {
        const queryString = new URLSearchParams(params).toString();
        return `${path}?${queryString}`;
      },
      keepUnusedDataFor: 0,
    }),
    downloadFile: builder.query({
      query: ({ path }) => ({
        url: path,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useDeleteManyInvoicesMutation,
  useDownloadInvoiceMutation,
  useCreateLeadQualificationMutation,
  useGetLeadQualificationQuery,
  useUpdateLeadQualificationMutation,
  useLazyFetchItemsV2Query,
  useDownloadFileQuery,
} = apiSlice;
