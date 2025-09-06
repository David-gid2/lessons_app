import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import { Main } from "./components/Main";
import { FileViewer } from "./components/FileViewer";
import { NoLessonPage } from "./components/NoLessonPage";

export const App = () => {
  const [user, setUser] = useState(null);
  const [startParam, setStartParam] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState(null); // 👈 тут зберігаємо саме посилання

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      setUser(tg.initDataUnsafe?.user || null);
      if (tg.initDataUnsafe?.start_param) {
        setStartParam(tg.initDataUnsafe.start_param);
      }
      tg.expand();
    }
  }, []);

  const sendData = async () => {
  try {
    const response = await axios.post("/api/lesson/get_lesson", {
      tg_id: user?.id,
      link_id: startParam,
    });

    setAnswer(response.data);
    setError(null);
  } catch (err) {
    console.error("Error sending data:", err);

    // якщо 404 або інша серверна помилка
    if (err.response && err.response.status === 404) {
      setAnswer(null); // немає даних
      setError(null);  // щоб не показувати текст помилки
    } else {
      setError("Не вдалося отримати дані з сервера");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user && startParam) {
      sendData();
    }
  }, [user, startParam]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  const hasLesson =
    answer?.lesson && Array.isArray(answer.lesson.files) && answer.lesson.files.length > 0;

  return (
    <div className="App">
      {selectedUrl ? (
        <FileViewer fileUrl={selectedUrl} onBack={() => setSelectedUrl(null)} />
      ) : hasLesson ? (
        <Main lessons={answer.lesson} onFileClick={setSelectedUrl} />
      ) : (
        <NoLessonPage />
      )}
    </div>
  );
};

