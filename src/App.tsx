import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import NavLayout from "./layouts/NavLayout.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
