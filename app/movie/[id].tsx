import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useGetMovieQuery, useDeleteMovieMutation } from '../../store/api/moviesApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToFavorites,
  removeFromFavorites,
  selectIsFavorite,
} from '../../store/slices/favoritesSlice';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: movie, isLoading, error } = useGetMovieQuery(id);
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();

  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(id));

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites(id));
    }
  };

  const handleDelete = () => {
    Alert.alert('Filmi Sil', `"${movie?.title}" filmini silmek istediğinize emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMovie(id).unwrap();
            router.back();
          } catch (error) {
            Alert.alert('Hata', 'Film silinemedi');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F2F2F7]">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F2F2F7] p-6">
        <Ionicons name="alert-circle" size={60} color="#8E8E93" />
        <Text className="mt-4 text-lg font-semibold text-gray-900">Film bulunamadı</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F2F2F7]">
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#007AFF',
          headerBackTitle: 'Filmler',
          headerRight: () => (
            <TouchableOpacity onPress={toggleFavorite} className="mr-2">
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? '#FF3B30' : '#007AFF'}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="m-4">
          <View
            className="overflow-hidden rounded-3xl bg-white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}>
            <View className="relative">
              {movie.poster ? (
                <Image
                  source={{ uri: movie.poster }}
                  style={{ width: width - 32, height: 320 }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{ width: width - 32, height: 320 }}
                  className="items-center justify-center bg-gray-100">
                  <Ionicons name="image-outline" size={80} color="#D1D5DB" />
                </View>
              )}

              <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-[#007AFF] px-4 py-2">
                <Ionicons name="star" size={16} color="#FFFFFF" />
                <Text className="ml-1 text-base font-bold text-white">{movie.rating}</Text>
              </View>
            </View>

            <View className="p-5">
              <Text className="mb-3 text-2xl font-bold text-gray-900">{movie.title}</Text>

              <View className="mb-4 flex-row items-center">
                <Text className="mr-3 text-base text-gray-500">{movie.year}</Text>
                <View className="mr-3 h-1 w-1 rounded-full bg-gray-300" />
                <Text className="mr-3 text-base text-gray-500">{movie.genre}</Text>
                <View className="mr-3 h-1 w-1 rounded-full bg-gray-300" />
                <Text className="text-base text-gray-500">{movie.duration} dk</Text>
              </View>

              <Text className="mb-2 text-lg font-bold text-gray-900">Hikaye</Text>

              <Text className="mb-5 text-base leading-6 text-gray-600">{movie.description}</Text>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => router.push(`/movie/add?id=${movie.id}`)}
                  className="flex-1 flex-row items-center justify-center rounded-xl bg-[#007AFF] py-4"
                  activeOpacity={0.8}>
                  <Ionicons name="pencil" size={18} color="white" />
                  <Text className="ml-2 text-base font-semibold text-white">Düzenle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  disabled={isDeleting}
                  className="h-14 w-14 items-center justify-center rounded-xl bg-[#FF3B30]"
                  activeOpacity={0.8}>
                  {isDeleting ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Ionicons name="trash" size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
