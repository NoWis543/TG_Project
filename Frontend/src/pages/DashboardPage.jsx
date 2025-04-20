import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FaChevronUp, FaChevronDown, FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite, setFavorites } from "../store/slices/favoritesSlice";
import toast from "react-hot-toast";

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("Все категории");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setSortedProducts(data);
        const cats = Array.from(new Set(data.map((p) => p.category)));
        setCategories(cats);
      });
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/favorites/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(setFavorites(data));
        }
      } catch (err) {
        console.error("Ошибка загрузки избранного:", err);
      }
    };

    fetchFavorites();
  }, [dispatch]);

  const handleFilter = (category) => {
    setCurrentPage(1);
    setSelected(category);
  };

  const handleSort = (asc) => {
    const sorted = [...getFilteredAndSearched()].sort((a, b) => {
      const priceA = typeof a.price === "number" ? a.price : 0;
      const priceB = typeof b.price === "number" ? b.price : 0;
      return asc ? priceA - priceB : priceB - priceA;
    });
    setSortedProducts(sorted);
  };

  const getFilteredAndSearched = () => {
    const filtered =
      selected === "Все категории"
        ? products
        : products.filter((p) => p.category === selected);

    return filtered.filter((p) => {
      const name = p.name.toLowerCase();
      const terms = searchQuery.toLowerCase().split(" ").filter(Boolean);
      return terms.every((term) => name.includes(term));
    });
  };

  useEffect(() => {
    setSortedProducts(getFilteredAndSearched());
  }, [selected, searchQuery, products]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(start, start + itemsPerPage);

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  const handleToggleFavorite = async (product) => {
    const isFav = isFavorite(product.id);
    const token = localStorage.getItem("token");

    try {
      if (isFav) {
        await fetch(`http://127.0.0.1:8000/favorites/${product.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.error("Удалено из избранного");
      } else {
        await fetch("http://127.0.0.1:8000/favorites/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });
        toast.success("Добавлено в избранное");
      }

      dispatch(toggleFavorite(product));
    } catch (error) {
      toast.error("Ошибка при работе с избранным");
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

        <div className="relative z-10 p-6">
          <h2 className="text-center text-4xl font-bold mb-10 text-purple-300 drop-shadow">
            Каталог товаров 📦
          </h2>

          <div className="flex flex-wrap justify-center gap-4 items-center mb-10">
          <select
            value={selected}
            onChange={(e) => handleFilter(e.target.value)}
            className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 shadow-md backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 [&>option]:text-black"
          >


              <option>Все категории</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-[320px] px-5 py-2 rounded-full bg-white/20 text-white placeholder-gray-300 outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleSort(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition"
                title="Сортировать по возрастанию"
              >
                <FaChevronUp />
              </button>
              <button
                onClick={() => handleSort(false)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition"
                title="Сортировать по убыванию"
              >
                <FaChevronDown />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-5 shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 relative"
              >
                <div
                  onClick={() => handleToggleFavorite(product)}
                  title={
                    isFavorite(product.id)
                      ? "Убрать из избранного"
                      : "Добавить в избранное"
                  }
                  className="absolute top-3 right-3 text-xl cursor-pointer hover:scale-125 transition"
                >
                  {isFavorite(product.id) ? (
                    <FaHeart className="text-red-500 animate-pulse" />
                  ) : (
                    <FaRegHeart className="text-white/60" />
                  )}
                </div>

                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-300 mb-1">
                  Категория: <span className="italic">{product.category}</span>
                </p>
                <p className="text-purple-300 font-bold text-lg mb-3">
                  {typeof product.price === "number"
                    ? product.price.toLocaleString() + " ₸"
                    : "Цена не указана"}
                </p>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition text-sm"
                >
                  Перейти к товару
                </a>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          <div className="flex justify-center items-center gap-2 mt-12 flex-wrap text-white">
            <button
              className="px-3 py-1 rounded border border-white/30 hover:bg-white/10"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {[...Array(totalPages).keys()].map((i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                Math.abs(currentPage - page) <= 2
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "border-white/30 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}

            <button
              className="px-3 py-1 rounded border border-white/30 hover:bg-white/10"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
