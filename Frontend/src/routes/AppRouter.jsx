import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import FavoritesPage from "../pages/FavoritesPage"; 
import SavedBuilds from "../pages/SavedBuilds"; 
import PrivateRoute from "../components/PrivateRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Домашняя страница — только для авторизованных */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* 🔓 Публичные страницы */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔐 Каталог товаров */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* 🔐 Профиль */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* ✅ 🔐 Избранное */}
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />

        {/* ✅ 🔐 Сохранённые сборки */}
        <Route
          path="/saved-builds"
          element={
            <PrivateRoute>
              <SavedBuilds />
            </PrivateRoute>
          }
        />


        {/* 🔁 Фолбэк на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
