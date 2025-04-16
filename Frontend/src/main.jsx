import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { Toaster } from "react-hot-toast"; // ✅ подключаем Toaster
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <>
        <App />
        <Toaster position="top-right" reverseOrder={false} /> {/* ✅ уведомления */}
      </>
    </Provider>
  </React.StrictMode>
);
