import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Movie, useDeleteMovieMutation } from '../store/api/moviesApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToFavorites,
  removeFromFavorites,
  selectIsFavorite,
} from '../store/slices/favoritesSlice';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(movie.id));
  const [deleteMovie] = useDeleteMovieMutation();

  const toggleFavorite = (e: any) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(movie.id));
    } else {
      dispatch(addToFavorites(movie.id));
    }
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    Alert.alert('Filmi Sil', `"${movie.title}" filmini silmek istediğinize emin misiniz?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMovie(movie.id).unwrap();
          } catch (error) {
            Alert.alert('Hata', 'Film silinemedi');
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/movie/${movie.id}`)}
      className="mx-4 mb-5"
      activeOpacity={0.7}>
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
              style={{ width: CARD_WIDTH, height: 200 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{ width: CARD_WIDTH, height: 200 }}
              className="items-center justify-center bg-gray-100">
              <Ionicons name="image-outline" size={60} color="#D1D5DB" />
            </View>
          )}

          <TouchableOpacity
            onPress={toggleFavorite}
            className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full bg-white/95"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
            }}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#FF3B30' : '#8E8E93'}
            />
          </TouchableOpacity>

          <View className="absolute left-3 top-3 flex-row items-center rounded-full bg-[#007AFF] px-3 py-1.5">
            <Ionicons name="star" size={12} color="#FFFFFF" />
            <Text className="ml-1 text-xs font-bold text-white">{movie.rating}</Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="mb-2 text-lg font-bold text-gray-900" numberOfLines={1}>
            {movie.title}
          </Text>

          <View className="mb-3 flex-row items-center">
            <Text className="mr-3 text-sm text-gray-500">{movie.year}</Text>
            <View className="mr-3 h-1 w-1 rounded-full bg-gray-300" />
            <Text className="mr-3 text-sm text-gray-500">{movie.genre}</Text>
            <View className="mr-3 h-1 w-1 rounded-full bg-gray-300" />
            <Text className="text-sm text-gray-500">{movie.duration} dk</Text>
          </View>

          <Text className="mb-4 text-sm leading-5 text-gray-600" numberOfLines={2}>
            {movie.description}
          </Text>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                router.push(`/movie/add?id=${movie.id}`);
              }}
              className="flex-1 flex-row items-center justify-center rounded-xl bg-[#007AFF] py-3"
              activeOpacity={0.8}>
              <Ionicons name="pencil" size={16} color="white" />
              <Text className="ml-2 text-sm font-semibold text-white">Düzenle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="h-12 w-12 items-center justify-center rounded-xl bg-[#FF3B30]"
              activeOpacity={0.8}>
              <Ionicons name="trash" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
