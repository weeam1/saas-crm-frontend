

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { constant } from "constant";

export const expensesSlice = createApi({
  reducerPath: 'expensesApi',
  baseQuery: fetchBaseQuery({
   baseUrl: `${constant["baseUrl"]}api/expenses`,
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Expenses'],
  endpoints: (builder) => ({
    fetchExpenses: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `?${queryString}`;
      },
    }),
    createExpense: builder.mutation({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
    }),
  }),
});

export const {
  useFetchExpensesQuery,
  useCreateExpenseMutation,
} = expensesSlice;
