import { useState } from "react";
import { Container, TextField, Button, Typography, Paper, CircularProgress } from "@mui/material";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        setMessage("Вход успешен!");
      } else {
        setMessage(data.detail || "Ошибка входа");
      }
    } catch (err) {
      setMessage("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setMessage("");

    if (!username || !password) {
      setMessage("Введите имя пользователя и пароль");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Регистрация успешна! Теперь войдите.");
      } else {
        setMessage(data.detail || "Ошибка регистрации");
      }
    } catch (error) {
      setMessage("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setMessage("Вы вышли из системы.");
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          {token ? "Вы авторизованы" : "Авторизация"}
        </Typography>

        {!token ? (
          <>
            <TextField
              label="Логин"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Пароль"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              style={{ marginTop: 10 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} style={{ color: "#fff" }} /> : "Войти"}
            </Button>

            <Button variant="text" fullWidth onClick={handleRegister} style={{ marginTop: 10 }}>
              Зарегистрироваться
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" style={{ color: "green", marginBottom: 10 }}>
              Вход выполнен успешно!
            </Typography>
            <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
              Выйти
            </Button>
          </>
        )}

        {message && (
          <Typography variant="body2" style={{ color: token ? "green" : "red", marginTop: 10 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default App;
