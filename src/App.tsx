import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import NavLayout from "./layouts/NavLayout.tsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<NavLayout />}>
        <Route index path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
