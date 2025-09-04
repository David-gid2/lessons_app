import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import { Main } from "./components/Main";

export const App = () => {
  const [user, setUser] = useState(null);        // Зберігаємо дані користувача з Telegram
  const [startParam, setStartParam] = useState(null); // Зберігаємо start_param
  const [answer, setAnswer] = useState(null);    // Відповідь від сервера
  const [error, setError] = useState(null);      // Помилка при запиті

  // Отримуємо дані з Telegram WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      // Отримуємо користувача
      setUser(tg.initDataUnsafe?.user || null);

      // Отримуємо start_param
      if (tg.initDataUnsafe?.start_param) {
        setStartParam(tg.initDataUnsafe.start_param);
      }

      // Розгортаємо додаток на весь екран
      tg.expand();
    }
  }, []);

  // Функція відправки даних на бекенд
  const sendData = async () => {
    try {
      const response = await axios.post(
        "/api/lesson/get_lesson", // Заміни на свій бекенд
        {
          tg_id: user?.id,
          link_id: startParam,
        }
      );

      // Зберігаємо відповідь від сервера
      setAnswer(response.data);
      setError(null);
    } catch (err) {
      console.error("Error sending data:", err);
      setError("Не вдалося отримати дані з сервера");
    }
  };

  // Викликаємо запит, коли є user і startParam
  useEffect(() => {
    if (user && startParam) {
      sendData();
    }
  }, [user, startParam]);



  return (
    <div className="App">
      <Main initData={startParam}/>
      {answer ? (
        <pre>{JSON.stringify(answer, null, 2)}</pre>
      ) : (
        <p>Завантаження даних...</p>
      )}

    </div>
    
  )
};
// дописати логіку для відрисовки даних на сторінці Main.jsx 
// створити веб перегеляд для файлів word, pdf які будуть в посиланню
// та здати проект в блищий час 