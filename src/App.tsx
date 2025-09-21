import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import NavLayout from "./layouts/NavLayout.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <ProtectedRoute>
                <NavLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
