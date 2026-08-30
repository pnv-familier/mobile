import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './navigation/RootNavigator';
import { useAuthStore } from './features/auth/store/auth.store';
import './i18n';

export default function App() {
  const fetchData = useAuthStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
