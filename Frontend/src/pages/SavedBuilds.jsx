import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

function SavedBuilds() {
  const [builds, setBuilds] = useState([]);
  const [error, setError] = useState(null);

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
    if (token) {
      fetchBuilds();
    }
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
                className="bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-lg transition-all relative"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">{build.name}</h2>
                <p className="text-green-700 font-medium mb-4">
                  Общая стоимость: {build.total_price.toLocaleString()} ₸
                </p>
                <ul className="text-left list-disc list-inside text-sm text-gray-700 space-y-1">
                  {build.components.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{item.name}</span>{" "}
                      <span className="text-gray-500">({item.category})</span> —{" "}
                      {item.price?.toLocaleString()} ₸
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDeleteBuild(build.id)}
                  className="absolute top-2 right-3 text-red-600 hover:text-red-800 text-sm"
                  title="Удалить сборку"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SavedBuilds;
