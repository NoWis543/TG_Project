import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { XMarkIcon } from "@heroicons/react/24/solid";

function SavedBuilds() {
  const [builds, setBuilds] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBuild, setSelectedBuild] = useState(null);

  const auth = useSelector((state) => state.auth);
  const token = auth.token;

  const fetchBuilds = async () => {
    try {
      const res = await fetch("http://localhost:8000/builds/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Ошибка при загрузке сборок.");
      }

      const data = await res.json();
      setBuilds(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchBuilds();
  }, [token]);

  const handleDeleteBuild = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить сборку?")) return;
    try {
      const res = await fetch(`http://localhost:8000/builds/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBuilds((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("Ошибка при удалении сборки.");
      }
    } catch (err) {
      console.error("Ошибка при удалении:", err);
      alert("Ошибка при удалении сборки.");
    }
  };

  const openModal = (build) => setSelectedBuild(build);
  const closeModal = () => setSelectedBuild(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-blue-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Мои сборки</h1>

        {error && <p className="text-red-600">{error}</p>}

        {builds.length === 0 && !error ? (
          <p className="text-gray-600">Вы ещё не сохранили ни одной сборки.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build) => (
              <div
                key={build.id}
                onClick={() => openModal(build)}
                className="bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-xl transition-all cursor-pointer relative hover:scale-[1.02]"
              >
                <h2 className="text-lg font-semibold text-blue-700 mb-1">{build.name}</h2>
                <p className="text-green-700 font-medium text-sm mb-3">
                  Общая стоимость: {build.total_price.toLocaleString()} ₸
                </p>
                <ul className="text-left list-disc list-inside text-sm text-gray-700 space-y-1">
                  {build.components.slice(0, 3).map((item, idx) => (
                    <li key={idx}>
                      {item.name} <span className="text-gray-400">({item.category})</span>
                    </li>
                  ))}
                  {build.components.length > 3 && (
                    <li className="text-gray-400 italic">
                      ...ещё {build.components.length - 3}
                    </li>
                  )}
                </ul>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBuild(build.id);
                }}
                  className="absolute top-2 right-3 bg-gray-90 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full p-1 shadow transition duration-150"
                  title="Удалить сборку"
                  aria-label="Удалить сборку"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBuild && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl relative">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              {selectedBuild.name}
            </h3>
            <ul className="space-y-2 text-sm">
              {selectedBuild.components.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">🛒</span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition transform hover:scale-110"
                title="Закрыть окно"
                aria-label="Закрыть окно"
            >
            <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SavedBuilds;
