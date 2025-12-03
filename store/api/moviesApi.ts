import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  duration: number;
  description: string;
  poster?: string;
}

export type CreateMovieDto = Omit<Movie, 'id'>;
export type UpdateMovieDto = Partial<CreateMovieDto>;

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5174/' }),
  tagTypes: ['Movie'],
  endpoints: (builder) => ({
    getMovies: builder.query<Movie[], void>({
      query: () => 'movies',
      providesTags: ['Movie'],
    }),
    getMovie: builder.query<Movie, string>({
      query: (id) => `movies/${id}`,
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
    }),
    addMovie: builder.mutation<Movie, CreateMovieDto>({
      query: (movie) => ({
        url: 'movies',
        method: 'POST',
        body: movie,
      }),
      invalidatesTags: ['Movie'],
    }),
    updateMovie: builder.mutation<Movie, { id: string; movie: UpdateMovieDto }>({
      query: ({ id, movie }) => ({
        url: `movies/${id}`,
        method: 'PATCH',
        body: movie,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Movie', id }, 'Movie'],
    }),
    deleteMovie: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movie'],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieQuery,
  useAddMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = moviesApi;
