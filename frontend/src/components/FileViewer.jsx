export const FileViewer = ({ fileUrl, onBack }) => {
  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
  const isDocx =
    fileUrl.toLowerCase().endsWith(".docx") || fileUrl.toLowerCase().endsWith(".doc");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Верхня панель */}
      <div
        style={{
          padding: "8px",
          backgroundColor: "#1D2733",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={onBack}
          style={{
            backgroundColor: "#50A8EB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "14px",
          }}
        >
          ⬅ Назад
        </button>
        <h3 style={{ marginLeft: "10px", color: '#FFFFFF' }}>Перегляд файлу</h3>
      </div>

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

