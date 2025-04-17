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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.ok) {
          const data = await res.json();
          dispatch(setFavorites(data));
        } else {
          console.warn("Не удалось загрузить избранное");
        }
      } catch (err) {
        console.error("Ошибка загрузки избранного:", err);
      }
    };
  
    fetchFavorites();
  }, []);
  
  
  

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

    return filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
  
    try {
      const token = localStorage.getItem("token");
  
      if (isFav) {
        await fetch(`http://127.0.0.1:8000/favorites/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      console.error("Favorites error:", error);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-center text-3xl font-bold mb-6">Каталог товаров 📦</h2>

        <div className="flex flex-wrap justify-center gap-4 items-center mb-8">
          <select
            value={selected}
            onChange={(e) => handleFilter(e.target.value)}
            className="border rounded px-4 py-2"
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
            className="w-full sm:w-[320px] px-5 py-2 rounded-full border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <div className="flex gap-2">
            <button
              onClick={() => handleSort(true)}
              className="border px-3 py-2 rounded hover:bg-blue-100 text-blue-600 text-lg"
              title="Сортировать по возрастанию"
            >
              <FaChevronUp />
            </button>
            <button
              onClick={() => handleSort(false)}
              className="border px-3 py-2 rounded hover:bg-blue-100 text-blue-600 text-lg"
              title="Сортировать по убыванию"
            >
              <FaChevronDown />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 relative"
            >
              <div
                onClick={() => handleToggleFavorite(product)}
                title={isFavorite(product.id) ? "Убрать из избранного" : "Добавить в избранное"}
                className="absolute top-3 right-3 text-xl cursor-pointer transition-transform transform hover:scale-125 active:scale-95"
              >
                {isFavorite(product.id) ? (
                  <FaHeart className="text-red-500 animate-pulse" />
                ) : (
                  <FaRegHeart className="text-gray-400 hover:text-red-400 transition-colors" />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  Категория: <span className="italic">{product.category}</span>
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-blue-600">
                {typeof product.price === "number" ? product.price.toLocaleString() + " ₸" : "Цена не указана"}

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

        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          <button
            className="px-3 py-1 rounded border hover:bg-gray-100"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>

          <button
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1 rounded border ${
              currentPage === 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            1
          </button>

          {Array.from({ length: 3 }, (_, i) => {
            const page = currentPage - 1 + i;
            if (page > 1 && page < totalPages)
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {page}
                </button>
              );
            return null;
          })}

          {totalPages > 1 && (
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages ? "bg-blue-500 text-white" : ""
              }`}
            >
              {totalPages}
            </button>
          )}

          <button
            className="px-3 py-1 rounded border hover:bg-gray-100"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
