import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import '../global.css';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#007AFF',
          headerTitleStyle: {
            fontWeight: '600',
            color: '#000000',
          },
          headerShadowVisible: false,
          headerBackTitle: 'Geri',
          contentStyle: {
            backgroundColor: '#F2F2F7',
          },
        }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: true,
            headerBackTitle: 'Filmler',
            title: 'Film Detayı',
          }}
        />
        <Stack.Screen
          name="movie/add"
          options={({ route }) => ({
            headerShown: true,
            presentation: 'modal',
            title: (route.params as any)?.id ? 'Filmi Düzenle' : 'Yeni Film',
          })}
        />
      </Stack>
    </Provider>
  );
}
