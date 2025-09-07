import { useEffect, useMemo } from "react";

export const FileViewer = ({ fileUrl, onBack }) => {
  const lowerUrl = fileUrl.toLowerCase();

  // Визначаємо тип файлу
  const isPdf =
    lowerUrl.endsWith(".pdf") ||
    lowerUrl.includes("application/pdf") ||
    lowerUrl.includes(".pdf?");
  const isDocx =
    lowerUrl.endsWith(".docx") ||
    lowerUrl.endsWith(".doc") ||
    lowerUrl.includes("application/msword") ||
    lowerUrl.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

  // Якщо сервер повертає HTML із <embed>, дістаємо src
  const resolvedUrl = useMemo(() => {
    if (fileUrl.trim().startsWith("<!doctype html") || fileUrl.trim().startsWith("<html")) {
      try {
        const match = fileUrl.match(/<embed[^>]+src=['"]([^'"]+)['"]/i);
        return match ? match[1] : fileUrl;
      } catch {
        return fileUrl;
      }
    }
    return fileUrl;
  }, [fileUrl]);

  // Google Docs Viewer
  const googleViewerUrl = useMemo(() => {
    return `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(
      resolvedUrl
    )}`;
  }, [resolvedUrl]);

  // Telegram Back Button
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();
      tg.onEvent("backButtonClicked", onBack);
    }
    return () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.offEvent("backButtonClicked", onBack);
      }
    };
  }, [onBack]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ flex: 1 }}>
        {/* PDF і DOCX через Google Docs Viewer */}
        {(isPdf || isDocx) && (
          <iframe
            src={googleViewerUrl}
            width="100%"
            height="100%"
            title="Document Viewer"
            sandbox="allow-scripts allow-same-origin" // 🔹 Забороняє відкриття нових вкладок
            style={{
              border: "none",
              backgroundColor: "#fff",
            }}
          />
        )}

        {/* Непідтримуваний формат */}
        {!isPdf && !isDocx && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#fff",
              backgroundColor: "#282828",
              height: "100%",
            }}
          >
            <p>Файл не підтримується для перегляду</p>
            <a
              href={resolvedUrl}
              style={{
                color: "#0088cc",
                textDecoration: "underline",
                fontWeight: "bold",
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
