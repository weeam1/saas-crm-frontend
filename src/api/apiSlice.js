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
      query: ({ path,body }) => ({
        url: path,
        method: "DELETE",
        body
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
  }),
});

export const {
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useDeleteManyInvoicesMutation,
  useDownloadInvoiceMutation,
} = apiSlice;
