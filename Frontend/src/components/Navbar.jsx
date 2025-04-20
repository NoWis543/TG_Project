import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="w-full px-6 py-3 flex items-center justify-between relative z-50 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-white shadow-md">
      {/* Название проекта с градиентом */}
      <Link
        to="/"
        className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent"
      >
        HardBuilder
      </Link>

      {/* Ссылки */}
      <div className="flex items-center space-x-5 relative">
        <Link
          to="/favorites"
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 text-white font-medium transition"
        >
          <span>❤️</span>
          <span>Избранное</span>
        </Link>

        <Link
          to="/dashboard"
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 text-white font-medium transition"
        >
          <span>🛒</span>
          <span>Каталог</span>
        </Link>

        <Link
          to="/saved-builds"
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 text-white font-medium transition"
        >
          <span>🖥️</span>
          <span>Мои сборки</span>
        </Link>

        {/* Аватар */}
        <div className="w-9 h-9 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-sm">
          HB
        </div>

        {/* Меню пользователя */}
        <div className="relative">
          <FaBars
            className="text-xl text-white hover:text-purple-300 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Меню пользователя"
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-gradient-to-br from-purple-800 via-purple-900 to-black text-white border border-white/20 rounded shadow-lg z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-700/50"
              >
                Профиль
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/40"
              >
                Выйти из аккаунта
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
