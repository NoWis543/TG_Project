import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { setFavorites, toggleFavorite } from "../store/slices/favoritesSlice";
import { FaHeart } from "react-icons/fa";
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

      dispatch(toggleFavorite(product));
    } catch (err) {
      console.error("❌ Не удалось удалить из избранного:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[url('/images/bg-stars2.jpg')] bg-cover bg-center text-white">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>
        <div className="relative z-10 px-6 py-16">
          <h2 className="text-4xl font-bold text-center text-purple-400 mb-10">
            Избранное <span className="animate-pulse">❤️</span>
          </h2>

          {favorites.length === 0 ? (
            <p className="text-center text-white/80">Пока ничего нет в избранном.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 relative"
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
                          dispatch(toggleFavorite(product));
                        } else {
                          toast.error("Ошибка при удалении");
                        }
                      } catch (err) {
                        toast.error("Сервер не отвечает");
                      }
                    }}
                    title="Убрать из избранного"
                    className="absolute top-3 right-3 text-xl cursor-pointer hover:scale-125 active:scale-95 transition"
                  >
                    <FaHeart className="text-red-500 animate-pulse" />
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-300">
                      Категория: <span className="italic">{product.category}</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-bold text-lg">
                      {typeof product.price === "number"
                        ? product.price.toLocaleString() + " ₸"
                        : "Цена не указана"}
                    </span>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition"
                    >
                      Перейти к товару
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FavoritesPage;
