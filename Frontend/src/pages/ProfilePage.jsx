import Navbar from "../components/Navbar";

function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Профиль пользователя</h2>

          {/* Заглушка: аватар */}
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl mx-auto mb-4">
            HB
          </div>

          {/* Изменение аватарки */}
          <div className="text-center mb-6">
            <label className="cursor-pointer text-blue-600 hover:underline">
              Загрузить новую аватарку
              <input type="file" className="hidden" />
            </label>
          </div>

          <div className="flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition">
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
