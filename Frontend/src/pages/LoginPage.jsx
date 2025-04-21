import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const { token, isAuth } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        navigate("/"); 
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
  

  const handleLogout = () => {
    dispatch(logout());
    setMessage("Вы вышли из системы.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-auth">
      <div className="bg-gradient-to-br from-[#e1c9f0] to-[#d4b1f5] backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isAuth ? "Вы авторизованы" : "Авторизация"}
        </h2>
  
        {!isAuth ? (
          <>
            <input
              className="w-full border border-gray-300 p-2 rounded mb-4 bg-white/70 placeholder-gray-600"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
  
            <div className="relative mb-4">
              <input
                className="w-full border border-gray-300 p-2 rounded pr-10 bg-white/70 placeholder-gray-600"
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
  
            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "..." : "Войти"}
            </button>
  
            <p className="text-sm text-center mt-4 text-black/80">
              Нет аккаунта?{" "}
              <span
                className="text-[#a21caf] hover:text-white font-semibold underline cursor-pointer transition"
                onClick={() => navigate("/register")}
              >
                Зарегистрируйтесь
              </span>
            </p>
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
