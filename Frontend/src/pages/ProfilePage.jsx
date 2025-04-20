import Navbar from "../components/Navbar";

function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-hero text-white">
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        ></div>
  
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-sm text-center text-white">
            <h2 className="text-2xl font-bold mb-6">Профиль пользователя</h2>
  
            <div className="w-24 h-24 mx-auto rounded-full bg-blue-300 flex items-center justify-center text-xl font-bold text-blue-900 shadow-md">
              НВ
            </div>
  
            <p className="mt-4 text-blue-200 text-sm underline cursor-pointer hover:text-white transition">
              Загрузить новую аватарку
            </p>
  
            <button
              disabled
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </>
  );
  
}

export default ProfilePage;
