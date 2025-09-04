import "../css/Main.css";


import polygon from "../assets/polygon.png";
import brainImg from "../assets/Brain.png";
import helpingImg from "../assets/Helping.png";


export const Main = (props) => {

  return (
    <div className="app">
      <div className="c1">
        <h2>День 1</h2>
        <div className="c2">
          <h1>Матеріал до 1 дня</h1>
          <div className="box">
            <div className="Img">
              <img src={brainImg} alt="Brain" className="brain" />
            </div>
            <div className="text"><p>{props.initData}</p></div>
            <div className="left-box">
              <img className="poligon" src={polygon} alt="polygon" />
            </div>
          </div>
          <div className="box">
            <div className="Img">
              <img src={helpingImg} alt="Brain" className="brain" />
            </div>
            <div className="text"><p>{props.hash}</p></div>
            <div className="left-box">
              <img className="poligon" src={polygon} alt="polygon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  
)};