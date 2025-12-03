import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetMovieQuery } from '../../store/api/moviesApi';
import { MovieForm } from '../../components/MovieForm';

export default function AddMovieScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const movieId = params.id;

  const { data: movie, isLoading } = useGetMovieQuery(movieId!, {
    skip: !movieId,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F2F2F7]">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <MovieForm movie={movie} isEdit={!!movieId} />;
}
