import { useEffect } from "react";

export const FileViewer = ({ fileUrl, onBack }) => {
  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
  const isDocx =
    fileUrl.toLowerCase().endsWith(".docx") || fileUrl.toLowerCase().endsWith(".doc");

  useEffect(() => {
    // Включаємо кнопку назад у Telegram
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.BackButton.show(); // Показати кнопку назад
      tg.onEvent("backButtonClicked", onBack); // Викликати onBack при натисканні
    }

    return () => {
      // При виході з компонента прибираємо підписку
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.offEvent("backButtonClicked", onBack);
      }
    };
  }, [onBack]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Верхня панель без кнопки назад */}
      

      {/* Контент */}
      <div style={{ flex: 1 }}>
        {isPdf && (
          <iframe
            src={fileUrl}
            width="100%"
            height="100%"
            title="PDF Viewer"
            style={{ border: "none" }}
          />
        )}

        {isDocx && (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              fileUrl
            )}`}
            width="100%"
            height="100%"
            title="Word Viewer"
            style={{ border: "none" }}
          />
        )}

        {!isPdf && !isDocx && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
            }}
          >
            <p>Файл не підтримується для перегляду</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#0088cc",
                textDecoration: "underline",
              }}
            >
              Завантажити файл
            </a>
          </div>
        )}
      </div>
    </div>
  );
};


