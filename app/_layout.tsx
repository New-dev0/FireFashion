import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
      <HeroUINativeProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#000' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="camera" />
            <Stack.Screen name="home" />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
