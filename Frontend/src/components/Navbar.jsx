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
    <header className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between relative">
      {/* Название проекта */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600 hover:bg-blue-100 transition px-3 py-1 rounded-md"
      >
        HardBuilder
      </Link>


      {/* Правая часть: ссылки + аватар + меню */}
      <div className="flex items-center space-x-4 relative">
        {/* Ссылка на избранное */}
        <Link
          to="/favorites"
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 hover:shadow transition"
        >
          <span className="text-lg">⭐</span>
          <span>Избранное</span>
        </Link>


        {/* Ссылка на каталог */}
        <Link
          to="/dashboard"
          className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 hover:shadow transition"
        >
          <span className="text-lg">🛒</span>
          <span>Каталог</span>
        </Link>


        <Link
          to="/saved-builds"
          className="flex items-center gap-1 text-base font-medium text-gray-700 hover:bg-gray-100 px-3 py-1 rounded transition"
        >
          <span className="text-lg">🖥️</span>
          <span>Мои сборки</span>
        </Link>



        {/* Заглушка-аватар */}
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
          HB
        </div>

        {/* Иконка меню */}
        <div className="relative">
          <FaBars
            className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Меню пользователя"
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Профиль
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
