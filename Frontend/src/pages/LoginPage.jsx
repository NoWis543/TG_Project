import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/slices/authSlice";

function LoginPage() {
  const dispatch = useDispatch();
  const { token, isAuth } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(login({ token: data.access_token }));
        setMessage("Вход успешен!");
      } else {
        setMessage(data.detail || "Ошибка входа");
      }
    } catch {
      setMessage("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setMessage("");
    if (!username || !password) {
      setMessage("Введите имя пользователя и пароль");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Регистрация успешна! Теперь войдите.");
      } else {
        setMessage(data.detail || "Ошибка регистрации");
      }
    } catch {
      setMessage("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setMessage("Вы вышли из системы.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isAuth ? "Вы авторизованы" : "Авторизация"}
        </h2>

        {!isAuth ? (
          <>
            <input
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "..." : "Войти"}
            </button>
            <button
              className="w-full text-sm text-blue-600 mt-4 hover:underline"
              onClick={handleRegister}
            >
              Зарегистрироваться
            </button>
          </>
        ) : (
          <>
            <p className="text-green-600 mb-4 text-center text-sm">Вход выполнен успешно!</p>
            <button
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </>
        )}

        {message && (
          <p className={`mt-4 text-center text-sm ${isAuth ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
