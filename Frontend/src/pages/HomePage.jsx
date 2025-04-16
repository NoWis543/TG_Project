import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4">
          Добро пожаловать в <span className="text-indigo-600">HardBuilder</span>!
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl max-w-2xl">
          Собери идеальный ПК, сравнивай цены, выбирай лучшие комплектующие —
          всё в одном месте.
        </p>

        <div className="mt-8">
          <a
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Перейти в каталог
          </a>
        </div>
      </div>
    </>
  );
}

export default HomePage;
