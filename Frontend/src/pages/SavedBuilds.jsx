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

      if (!res.ok) throw new Error("Ошибка при загрузке сборок.");

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
      <div className="relative min-h-screen bg-hero text-white">
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        ></div>

        <div className="relative z-10 p-6">
          <h1 className="text-3xl font-extrabold text-center text-purple-300 mb-8 drop-shadow">
            Мои сборки
          </h1>

          {error && <p className="text-red-400 text-center">{error}</p>}

          {builds.length === 0 && !error ? (
            <p className="text-white/80 text-center">Вы ещё не сохранили ни одной сборки.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {builds.map((build) => (
                <div
                  key={build.id}
                  onClick={() => openModal(build)}
                  className="bg-white/10 border border-white/20 backdrop-blur-md p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer relative hover:-translate-y-1"
                >
                  <h2 className="text-lg font-semibold text-purple-300 mb-2">
                    {build.name}
                  </h2>
                  <p className="text-pink-400 font-bold text-sm mb-3">
                    Общая стоимость: {build.total_price.toLocaleString()} ₸
                  </p>
                  <ul className="text-left list-disc list-inside text-sm text-white/90 space-y-1">
                    {build.components.slice(0, 3).map((item, idx) => (
                      <li key={idx}>
                        {item.name}{" "}
                        <span className="text-gray-300">({item.category})</span>
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
                    className="absolute top-2 right-3 bg-white/10 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-full p-1 transition"
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
      </div>

      {selectedBuild && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
            <h3 className="text-xl font-bold text-purple-300 mb-4">
              {selectedBuild.name}
            </h3>
            <ul className="space-y-2 text-sm max-h-96 overflow-y-auto pr-2">
              {selectedBuild.components.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5">🛒</span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition transform hover:scale-110"
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
