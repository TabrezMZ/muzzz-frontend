import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = `${import.meta.env.API_BASE_URL}/playlists`;

export const playlistApi = createApi({
  reducerPath: 'playlistApi',
  baseQuery: fetchBaseQuery({
    baseUrl, // env variable for base URL
    // Include token in headers for authenticated requests
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', token);
      return headers;
    },
  }),
  tagTypes: ['Playlist'],
  endpoints: (builder) => ({
  getPlaylists: builder.query({
    query: () => '/',
    providesTags: ['Playlist'],
  }),
  getPlaylistById: builder.query({
    query: (id: string) => `/${id}`,
    providesTags: (_result, _err, id) => [{ type: 'Playlist', id }],
  }),
  createPlaylist: builder.mutation({
    query: (data) => ({
      url: '/',
      method: 'POST',
      body: data,
    }),
    invalidatesTags: ['Playlist'],
  }),
  updatePlaylist: builder.mutation({
    query: ({ id, data }) => ({
      url: `/${id}`,
      method: 'PUT',
      body: data,
    }),
    invalidatesTags: ['Playlist'],
  }),
  deletePlaylist: builder.mutation({
    query: (id) => ({
      url: `/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: ['Playlist'],
  }),
}),
});

export const {
  useGetPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useGetPlaylistByIdQuery,
} = playlistApi;
