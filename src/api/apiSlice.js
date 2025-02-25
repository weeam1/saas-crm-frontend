import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { constant } from 'constant';

export const apiSlice = createApi({
	// Unique key for the API slice in the Redux store
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		// Set the base url with dynamic api local and live
		baseUrl: `${constant['baseUrl']}api`,
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
	// Add tag for caching and invalidation
	tagTypes: ['Items'],
	endpoints: (builder) => ({
		// GET request with params and caching
		fetchItems: builder.query({
			query: ({ path, params }) => {
				const queryString = new URLSearchParams(params).toString();
				return `${path}?${queryString}`; // Appends query params to the URL
			},
			providesTags: (result, error, { path, params }) => {
				const queryString = new URLSearchParams(params).toString();
				const cacheKey = `${path}?${queryString}`;

				if (result && Array.isArray(result)) {
					return [
						...result.map(({ id }) => ({ type: 'Items', id })),
						{ type: 'Items', id: cacheKey },
					];
				}

				if (result && typeof result === 'object' && result.data) {
					return [
						...(Array.isArray(result.data)
							? result.data.map(({ id }) => ({ type: 'Items', id }))
							: []),
						{ type: 'Items', id: cacheKey },
					];
				}

				return [{ type: 'Items', id: cacheKey }];
			},
		}),

		// POST request
		createItem: builder.mutation({
			query: ({ path, body }) => ({
				url: path,
				method: 'POST',
				body,
			}),
		}),
		// PUT request
		updateItem: builder.mutation({
			query: ({ path, body }) => ({
				url: path,
				method: 'PUT',
				body,
			}),
		}),
		// DELETE request
		deleteItem: builder.mutation({
			query: ({ path }) => ({
				url: path,
				method: 'DELETE',
			}),
		}),
	}),
});

export const {
	useFetchItemsQuery,
	useCreateItemMutation,
	useUpdateItemMutation,
	useDeleteItemMutation,
} = apiSlice;
