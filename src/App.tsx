import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="p-4">
          <h1 className="text-xl font-bold">Tapzy Mobile</h1>
          <p className="text-gray-500 mt-2">Backend connected. Build your UI here.</p>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
