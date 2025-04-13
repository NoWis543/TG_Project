import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* здесь позже добавим другие страницы */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
