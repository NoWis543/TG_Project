import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { setFavorites, toggleFavorite } from "../store/slices/favoritesSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

function FavoritesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/favorites/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Не удалось загрузить избранное");
        return res.json();
      })
      .then((data) => dispatch(setFavorites(data)))
      .catch((err) => console.error("❌ Ошибка загрузки избранного:", err));
  }, [dispatch]);

  const handleRemove = async (product) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/favorites/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Ошибка при удалении с сервера");
      }
  
      dispatch(toggleFavorite(product)); // Удаляем локально после успешного ответа
    } catch (err) {
      console.error("❌ Не удалось удалить из избранного:", err);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Избранное ❤️</h2>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">Пока ничего нет в избранном.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 relative"
              >
                <div
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    try {
                      const res = await fetch(`http://127.0.0.1:8000/favorites/${product.id}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (res.ok) {
                        toast.error("Удалено из избранного");
                        // 🔄 Удаляем из Redux
                        dispatch(toggleFavorite(product));
                      } else {
                        toast.error("Ошибка при удалении");
                      }
                    } catch (err) {
                      toast.error("Сервер не отвечает");
                    }
                  }}
                  title="Убрать из избранного"
                  className="absolute top-3 right-3 text-xl cursor-pointer transition-transform transform hover:scale-125 active:scale-95"
                >
                  <FaHeart className="text-red-500 animate-pulse" />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Категория: <span className="italic">{product.category}</span>
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-blue-600">
                    {typeof product.price === "number"
                      ? product.price.toLocaleString() + " ₸"
                      : "Цена не указана"}
                  </span>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    Перейти к товару
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FavoritesPage;
