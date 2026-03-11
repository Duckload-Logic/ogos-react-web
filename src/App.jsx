import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context";
import { routes } from "./routes";

const QUERY_CLIENT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const QUERY_CLIENT_GC_TIME = 1000 * 60 * 60; // 1 hour

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CLIENT_STALE_TIME,
      cacheTime: QUERY_CLIENT_GC_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
