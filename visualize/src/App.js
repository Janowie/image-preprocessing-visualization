import './App.css';
import Mario from "./static/mario.png";

// Component imports
import GUI from "./components/gui.js";

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-light bg-light container-paddings">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img
              src={Mario}
              width="30"
              height="30"
              className="d-inline-block align-top"
              style={{
                "marginRight": "15px"
              }}
              alt="Mario"/>
                Visualize
          </a>
        </div>
      </nav>

      <GUI />
    </div>
  );
}

export default App;
