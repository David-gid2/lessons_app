import "../css/Main.css";
import polygon from "../assets/polygon.png";

export const Main = ({ lessons, onFileClick }) => {
  const lesson = lessons;

  return (
    <div className="app">
      <div className="c1">
        <h2>День {lesson.day}</h2>
        <div className="c2">
          <h1>{lesson.tittle}</h1>

          {lesson.files.map((file) => (
            <div className="box" key={file.id}>
              <div className="Img">
                <img src={file.icon_url} alt={file.tittle} className="brain" />
              </div>
              <div className="text">
                <p>{file.tittle}</p>
              </div>
              <div
                className="left-box"
                onClick={() => onFileClick(file.file_url)} // 👈 передаємо напряму URL
              >
                <img className="poligon" src={polygon} alt="polygon" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

