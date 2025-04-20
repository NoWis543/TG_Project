import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage("");
    if (!username || !password || !confirm) {
      setMessage("Все поля обязательны");
      return;
    }

    if (password !== confirm) {
      setMessage("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Регистрация успешна! Войдите.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.detail || "Ошибка регистрации");
      }
    } catch {
      setMessage("Ошибка сети");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/images/bg-gradient.jpg')] bg-cover bg-center">
      <div className="bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Добро пожаловать!
        </h2>
        <p className="text-sm text-center text-gray-700 mb-6">
          Пожалуйста зарегистрируйтесь, а если имеется аккаунт —{" "}
          <span
            className="text-[#a21caf] hover:text-white underline underline-offset-2 cursor-pointer transition"
            onClick={() => navigate("/login")}
          >
            нажмите войти
          </span>
        </p>

        <input
          className="w-full border border-gray-300 p-2 rounded mb-4 bg-white/70 placeholder-gray-600 text-gray-800"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            className="w-full border border-gray-300 p-2 rounded pr-10 bg-white/70 placeholder-gray-600 text-gray-800"
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative mb-4">
          <input
            className="w-full border border-gray-300 p-2 rounded pr-10 bg-white/70 placeholder-gray-600 text-gray-800"
            type={showConfirm ? "text" : "password"}
            placeholder="Подтвердите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 text-gray-600 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold transition"
          onClick={handleRegister}
        >
          Зарегистрироваться
        </button>

        <p className="mt-4 text-center text-sm text-gray-900">
          Уже есть аккаунт?{" "}
          <span
            className="text-[#a21caf] hover:text-white underline underline-offset-2 cursor-pointer transition"
            onClick={() => navigate("/login")}
          >
            Войти
          </span>
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
