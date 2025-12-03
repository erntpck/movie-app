import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  StatusBar,
} from 'react-native';
import { useGetMoviesQuery } from '../../store/api/moviesApi';
import { MovieCard } from '../../components/MovieCard';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, selectSearchQuery } from '../../store/slices/filterSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { data: movies, isLoading, error, refetch } = useGetMoviesQuery();
  const searchQuery = useSelector(selectSearchQuery);
  const searchInputRef = useRef<TextInput>(null);

  const filteredMovies = useMemo(() => {
    if (!movies) return [];

    if (searchQuery) {
      return movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return movies;
  }, [movies, searchQuery]);

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
    searchInputRef.current?.blur();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F2F2F7]">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F2F2F7] p-6">
        <View
          className="items-center rounded-3xl bg-white p-8"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}>
          <Ionicons name="cloud-offline-outline" size={60} color="#8E8E93" />
          <Text className="mt-4 text-center text-xl font-bold text-gray-900">Bağlantı Hatası</Text>
          <Text className="mt-2 text-center text-gray-500">Sunucuya bağlanılamadı</Text>
          <TouchableOpacity onPress={refetch} className="mt-6 rounded-xl bg-[#007AFF] px-6 py-3">
            <Text className="font-semibold text-white">Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F2F2F7]">
      <StatusBar barStyle="dark-content" />

      <SafeAreaView edges={['top']} className="bg-white">
        <View className="px-6 pb-4 pt-3">
          <Text className="mb-1 text-4xl font-bold text-gray-900">Filmler</Text>
          <Text className="text-base text-gray-500">{filteredMovies.length} film</Text>
        </View>

        <View className="px-4 pb-4">
          <View className="flex-row items-center rounded-xl bg-[#F2F2F7] px-4 py-3">
            <Ionicons name="search" size={20} color="#8E8E93" />
            <TextInput
              ref={searchInputRef}
              className="ml-3 flex-1 text-base text-gray-900"
              placeholder="Film ara..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={(text) => dispatch(setSearchQuery(text))}
              returnKeyType="search"
              blurOnSubmit={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard movie={item} />}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View className="items-center justify-center px-6 pt-20">
            <View
              className="mb-6 rounded-full bg-white p-8"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              }}>
              <Ionicons name="film-outline" size={60} color="#8E8E93" />
            </View>
            <Text className="mb-2 text-2xl font-bold text-gray-900">
              {searchQuery ? 'Film Bulunamadı' : 'Film Yok'}
            </Text>
            <Text className="mb-8 text-center text-gray-500">
              {searchQuery ? 'Aramanıza uygun film yok' : 'İlk filminizi ekleyin'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                onPress={() => router.push('/movie/add')}
                className="flex-row items-center rounded-full bg-[#007AFF] px-8 py-4">
                <Ionicons name="add" size={24} color="white" />
                <Text className="ml-2 text-base font-semibold text-white">Film Ekle</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#007AFF" />
        }
      />

      <View className="absolute bottom-6 right-6" style={{ zIndex: 999 }}>
        <TouchableOpacity
          onPress={() => router.push('/movie/add')}
          className="h-16 w-16 items-center justify-center rounded-full bg-[#007AFF]"
          activeOpacity={0.8}
          style={{
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
