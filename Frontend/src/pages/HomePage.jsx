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
      <div className="relative min-h-screen bg-hero text-white">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      ></div>
        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center py-20">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow mb-4">
            Добро пожаловать в <span className="text-purple-400">HardBuilder!</span>
          </h1>
  
          <p className="text-lg text-white/80 mb-6 max-w-xl">
            Собери идеальный ПК, сравнивай цены, выбирай лучшие комплектующие — всё в одном месте.
          </p>
  
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition"
            >
              Собрать компьютер 🛠
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-x1 w-full max-w-md text-left text-white mt-6"
            >
              <label className="block mb-4 font-medium">
                Цель сборки:
                <input
                  type="text"
                  className="w-full mt-1 p-2 rounded bg-white/20 placeholder-gray-300 text-white outline-none"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Например, для игр, учёбы, работы..."
                  required
                />
              </label>
  
              <label className="block mb-4 font-medium">
                Бюджет (₸):
                <input
                  type="number"
                  className="w-full mt-1 p-2 rounded bg-white/20 placeholder-gray-300 text-white outline-none"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Например, 300000"
                  required
                />
              </label>
  
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold transition"
              >
                Получить сборку
              </button>
            </form>
          )}
  
          {gptRaw.length > 0 && (
            <div className="mt-8 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md max-w-2xl text-left text-white">
              <h2 className="text-xl font-semibold text-purple-300 mb-2">GPT-предложение:</h2>
              <ol className="list-decimal list-inside space-y-1 text-white/90">
                {gptRaw.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ol>
            </div>
          )}
  
          {matchedProducts.length > 0 && (
          <div className="mt-10 w-full max-w-6xl">
            <h2 className="text-2xl font-semibold mb-4 text-white">Подходящие товары:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 text-white"
                >
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-300 mb-1">
                    Категория: <span className="italic">{product.category}</span>
                  </p>
                  <p className="text-purple-300 font-bold mb-3">
                    {typeof product.price === "number"
                      ? product.price.toLocaleString() + " ₸"
                      : "Цена не указана"}
                  </p>
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                  >
                    Перейти к товару
                  </a>
                </div>
              ))}
            </div>

            {/* 💰 Сумма и кнопка */}
            <div className="mt-10 text-center">
              <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg">
                <p className="text-lg font-medium text-white">
                  Общая стоимость:
                  <span className="ml-2 text-purple-300 font-bold underline">
                    {totalPrice.toLocaleString()} ₸
                  </span>
                </p>
              </div>

              <div className="mt-4">
                {token ? (
                  <button
                    onClick={handleSaveBuild}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 mt-2 rounded-full shadow-md transition font-semibold"
                  >
                    💾 Сохранить сборку
                  </button>
                ) : (
                  <p className="text-white/80 mt-2">Войдите в аккаунт, чтобы сохранить сборку.</p>
                )}
                {saveStatus === "success" && (
                  <p className="text-green-400 mt-2">Сборка успешно сохранена!</p>
                )}
                {saveStatus === "error" && (
                  <p className="text-red-400 mt-2">Ошибка при сохранении сборки.</p>
                )}
              </div>
            </div>
          </div>
        )}

  
          {unmatched.length > 0 && (
            <div className="mt-10 mb-24 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl max-w-2xl text-white shadow-lg">
              <h3 className="font-semibold text-lg mb-2">Не удалось найти в базе:</h3>
              <ul className="list-disc list-inside">
                {unmatched.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-white/70">
                Вы можете добавить эти компоненты вручную или уточнить описание.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
