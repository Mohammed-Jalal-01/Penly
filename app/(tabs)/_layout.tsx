import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="search" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="archive" />
      <Stack.Screen name="trash" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}