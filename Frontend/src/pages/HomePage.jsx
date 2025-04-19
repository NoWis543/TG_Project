import { useState } from "react";
import { useSelector } from "react-redux"; // ✅ Добавлено
import Navbar from "../components/Navbar";

function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("");
  const [gptRaw, setGptRaw] = useState([]);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [unmatched, setUnmatched] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null); // ✅ Добавлено

  const auth = useSelector((state) => state.auth); // ✅ Из Redux
  const token = auth.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = `Собери ПК для цели: ${goal}, в пределах бюджета: ${budget} ₸`;

    try {
      const res = await fetch(
        `http://localhost:8000/build_pc?prompt=${encodeURIComponent(prompt)}&budget=${budget}`
      );
      const data = await res.json();
      setGptRaw(data.gpt_raw || []);
      setMatchedProducts(data.products || []);
      setTotalPrice(data.total_price || 0);
      setUnmatched(data.unmatched || []);
      setSaveStatus(null); // сброс при новом поиске
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  const handleSaveBuild = async () => {
    try {
      const res = await fetch("http://localhost:8000/builds/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `Сборка для цели: ${goal}`,
          total_price: totalPrice,
          components: matchedProducts, // 💡 массив товаров
        }),
      });
  
      if (res.ok) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      setSaveStatus("error");
    }
  };
  
  

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-4">
          Добро пожаловать в <span className="text-indigo-600">HardBuilder!</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Собери идеальный ПК, сравнивай цены, выбирай лучшие комплектующие — всё в одном месте.
        </p>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Собрать компьютер 🛠
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <label className="block mb-2 font-medium text-gray-700">
              Цель сборки:
              <input
                type="text"
                className="w-full mt-1 border rounded px-3 py-2"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Например, для игр, учёбы, работы..."
                required
              />
            </label>
            <label className="block mb-4 font-medium text-gray-700">
              Бюджет (₸):
              <input
                type="number"
                className="w-full mt-1 border rounded px-3 py-2"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Например, 300000"
                required
              />
            </label>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Получить сборку
            </button>
          </form>
        )}

        {gptRaw.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded shadow-md max-w-2xl text-left">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">GPT-предложение:</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-800">
              {gptRaw.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ol>
          </div>
        )}

        {matchedProducts.length > 0 && (
          <div className="mt-10 w-full max-w-5xl">
            <h2 className="text-2xl font-semibold mb-4">Подходящие товары:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1"
                >
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-1">
                    Категория: <span className="italic">{product.category}</span>
                  </p>
                  <p className="text-blue-600 font-bold mb-3">
                    {typeof product.price === "number"
                      ? product.price.toLocaleString() + " ₸"
                      : "Цена не указана"}
                  </p>
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

            <div className="text-lg font-semibold mt-6 text-right pr-2 text-green-700">
              Общая стоимость: {totalPrice.toLocaleString()} ₸
            </div>

            <div className="text-center mt-6">
              {token ? (
                <button
                  onClick={handleSaveBuild}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Сохранить сборку 💾
                </button>
              ) : (
                <p className="text-gray-500">Войдите в аккаунт, чтобы сохранить сборку.</p>
              )}
              {saveStatus === "success" && (
                <p className="text-green-600 mt-2">Сборка успешно сохранена!</p>
              )}
              {saveStatus === "error" && (
                <p className="text-red-600 mt-2">Ошибка при сохранении сборки.</p>
              )}
            </div>
          </div>
        )}

        {unmatched.length > 0 && (
          <div className="mt-10 bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg max-w-2xl">
            <h3 className="font-semibold text-lg mb-2">Не удалось найти в базе:</h3>
            <ul className="list-disc list-inside">
              {unmatched.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              Вы можете добавить эти компоненты вручную или уточнить описание.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
