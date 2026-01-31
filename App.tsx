import { useEffect } from 'react';
import RootNavigator from './navigation/RootNavigator';
import { useAuthStore } from './features/auth/store/auth.store';

export default function App() {
  const fetchData = useAuthStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <RootNavigator />
  );
}
