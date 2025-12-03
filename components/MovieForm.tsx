import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Movie,
  CreateMovieDto,
  useAddMovieMutation,
  useUpdateMovieMutation,
} from '../store/api/moviesApi';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MovieFormProps {
  movie?: Movie;
  isEdit?: boolean;
}

export const MovieForm: React.FC<MovieFormProps> = ({ movie, isEdit = false }) => {
  const [formData, setFormData] = useState<CreateMovieDto>({
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    rating: 0,
    duration: 0,
    description: '',
    poster: '',
  });

  const [addMovie, { isLoading: isAdding }] = useAddMovieMutation();
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();

  useEffect(() => {
    if (movie && isEdit) {
      setFormData({
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        rating: movie.rating,
        duration: movie.duration,
        description: movie.description,
        poster: movie.poster || '',
      });
    }
  }, [movie, isEdit]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Eksik Bilgi', 'Film adı gereklidir');
      return;
    }
    if (!formData.genre.trim()) {
      Alert.alert('Eksik Bilgi', 'Film türü gereklidir');
      return;
    }
    if (!formData.year || formData.year < 1800 || formData.year > new Date().getFullYear() + 5) {
      Alert.alert(
        'Hatalı Bilgi',
        'Geçerli bir yıl giriniz (1800-' + (new Date().getFullYear() + 5) + ')'
      );
      return;
    }
    if (!formData.rating || formData.rating < 0 || formData.rating > 10) {
      Alert.alert('Hatalı Bilgi', 'Puan 0-10 arasında olmalıdır');
      return;
    }
    if (!formData.duration || formData.duration < 1) {
      Alert.alert('Hatalı Bilgi', 'Geçerli bir süre giriniz (dakika)');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Eksik Bilgi', 'Film açıklaması gereklidir');
      return;
    }

    try {
      if (isEdit && movie) {
        await updateMovie({ id: movie.id, movie: formData }).unwrap();
        Alert.alert('Başarılı! ✅', 'Film güncellendi', [
          { text: 'Tamam', onPress: () => router.back() },
        ]);
      } else {
        await addMovie(formData).unwrap();
        Alert.alert('Başarılı! ✅', 'Film eklendi', [
          { text: 'Tamam', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Form submit error:', error);
      Alert.alert('Hata ❌', 'İşlem başarısız. Sunucu bağlantısını kontrol edin.');
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F2F2F7]">
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="p-6">
          <View className="mb-5">
            <Text className="mb-2 text-base font-semibold text-gray-900">Film Adı *</Text>
            <View className="flex-row items-center rounded-xl bg-white px-4 py-4">
              <Ionicons name="film-outline" size={20} color="#8E8E93" />
              <TextInput
                className="ml-3 flex-1 text-base text-gray-900"
                placeholder="Örn: The Shawshank Redemption"
                placeholderTextColor="#C7C7CC"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
            </View>
          </View>

          <View className="mb-5 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-2 text-base font-semibold text-gray-900">Yıl *</Text>
              <View className="flex-row items-center rounded-xl bg-white px-4 py-4">
                <Ionicons name="calendar-outline" size={20} color="#8E8E93" />
                <TextInput
                  className="ml-3 flex-1 text-base text-gray-900"
                  placeholder="2024"
                  placeholderTextColor="#C7C7CC"
                  value={formData.year ? formData.year.toString() : ''}
                  onChangeText={(text) => {
                    const parsed = parseInt(text);
                    setFormData({ ...formData, year: isNaN(parsed) ? 0 : parsed });
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="mb-2 text-base font-semibold text-gray-900">Tür *</Text>
              <View className="flex-row items-center rounded-xl bg-white px-4 py-4">
                <Ionicons name="pricetag-outline" size={20} color="#8E8E93" />
                <TextInput
                  className="ml-3 flex-1 text-base text-gray-900"
                  placeholder="Drama"
                  placeholderTextColor="#C7C7CC"
                  value={formData.genre}
                  onChangeText={(text) => setFormData({ ...formData, genre: text })}
                />
              </View>
            </View>
          </View>

          <View className="mb-5 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-2 text-base font-semibold text-gray-900">Puan (0-10) *</Text>
              <View className="flex-row items-center rounded-xl bg-white px-4 py-4">
                <Ionicons name="star-outline" size={20} color="#8E8E93" />
                <TextInput
                  className="ml-3 flex-1 text-base text-gray-900"
                  placeholder="8.5"
                  placeholderTextColor="#C7C7CC"
                  value={formData.rating ? formData.rating.toString() : ''}
                  onChangeText={(text) => {
                    const parsed = parseFloat(text);
                    setFormData({ ...formData, rating: isNaN(parsed) ? 0 : parsed });
                  }}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="mb-2 text-base font-semibold text-gray-900">Süre (dk) *</Text>
              <View className="flex-row items-center rounded-xl bg-white px-4 py-4">
                <Ionicons name="time-outline" size={20} color="#8E8E93" />
                <TextInput
                  className="ml-3 flex-1 text-base text-gray-900"
                  placeholder="120"
                  placeholderTextColor="#C7C7CC"
                  value={formData.duration ? formData.duration.toString() : ''}
                  onChangeText={(text) => {
                    const parsed = parseInt(text);
                    setFormData({ ...formData, duration: isNaN(parsed) ? 0 : parsed });
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-base font-semibold text-gray-900">
              Poster URL (Opsiyonel)
            </Text>
            <View className="flex-row items-center rounded-xl bg-white px-4 py-4">
              <Ionicons name="image-outline" size={20} color="#8E8E93" />
              <TextInput
                className="ml-3 flex-1 text-base text-gray-900"
                placeholder="https://example.com/poster.jpg"
                placeholderTextColor="#C7C7CC"
                value={formData.poster}
                onChangeText={(text) => setFormData({ ...formData, poster: text })}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-base font-semibold text-gray-900">Açıklama *</Text>
            <View className="rounded-xl bg-white px-4 py-3">
              <TextInput
                className="min-h-[100px] text-base text-gray-900"
                placeholder="Film hakkında kısa bir açıklama..."
                placeholderTextColor="#C7C7CC"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity
            className="mb-3 items-center rounded-xl bg-[#007AFF] py-4"
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {isEdit ? 'Güncelle' : 'Kaydet'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center rounded-xl bg-gray-200 py-4"
            onPress={() => router.back()}
            disabled={isLoading}
            activeOpacity={0.8}>
            <Text className="text-base font-semibold text-gray-900">İptal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
