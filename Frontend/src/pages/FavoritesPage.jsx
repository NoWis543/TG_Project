import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

function FavoritesPage() {
  const favorites = useSelector((state) => state.favorites.items);

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
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-1">
                  Категория: <span className="italic">{product.category}</span>
                </p>
                <p className="text-blue-600 font-bold mb-3">{product.price} ₸</p>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Перейти к товару
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FavoritesPage;
