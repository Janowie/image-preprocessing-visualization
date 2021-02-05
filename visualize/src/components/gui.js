import React from "react";
import Canvases from "./canvases";
import KernelSettings from "./kernels";

import './canvas.css';


export default function GUI(props) {

  let tick_counter = null;
  let interval = null;

  const [state, setState] = React.useState({
    "interval": null,
    "kernel_size": 3,
    "kernel": [ // Initialized with a gaussian blur
        1/16, 1/8, 1/16,
        1/8, 1/4, 1/8,
        1/16, 1/8, 1/16
    ],
    "pixel_size": 20,
    "fps": 100,
    "image": new Image(),
    "background_color": "#e74c3c",
    "canvas_height": 640,
    "canvas_width": 640,
    "tick_counter": {
        "x": 0,
        "y": 0
    },
    "reset": false
  });

  const tick = () => {

    // // Wait until interval initialized
    // if (interval === null) {
    //   return null;
    // }

    if (!tick_counter) {
      tick_counter = {
        "x": 0,
        "y": 0
      }
    }

    let ticks_per_row = Math.floor(state.canvas_width / state.pixel_size) - state.kernel_size; // 2*Math.floor(state.kernel_size/2);
    let num_rows = Math.floor(state.canvas_height / state.pixel_size) - state.kernel_size;

    // Stop at the end
    if (tick_counter.y == num_rows && tick_counter.x == ticks_per_row) {
      stopTick();
      return null;
    }

    // Update position
    if (tick_counter.x < ticks_per_row) {
      tick_counter.x += 1;
    }
    else {
      tick_counter.x = 0;
      // Set y
      if (tick_counter.y < num_rows) {
        tick_counter.y += 1;
      }
    }

    setState({
      ...state,
      "tick_counter": tick_counter,
      "interval": interval
    })

  }

  const reset = () => {
    tick_counter = null;
    setState({
      ...state,
      "interval": null,
      "tick_counter": {
        "x": 0,
        "y": 0
      },
      "reset": true
    })
  }

  const stopTick = () => {
    // Stop animation - set tick_counter
    clearInterval(state.interval);
    setState({
      ...state,
      "interval": null,
      "reset": false
    })
  }

  const toggleAnimation = () => {
    if (state.interval == null) {
      // Reset tick counter
      if (state.tick_counter)
        tick_counter = state.tick_counter;
      interval = setInterval(() => tick(), state.fps);
      setState({
        ...state,
        "interval": interval,
        "reset": false
      })
    }
    else
      stopTick();
  }

  const handleClick = () => {
    if (state.canvas_width && state.canvas_height) {
      toggleAnimation();
    }
  }

  const handleChange = (key, value) => {
    setState({
      ...state,
      [key]: value
    })
  }

  return (
    <section className="container mario-canvas">

      <h1 className="mt-3 mb-4">Filter visualization</h1>

      <article className="controls mb-5">

        <h3>Settings</h3>

        <div className="row">
          <div className="col-lg-6">
            <KernelSettings
              key="kernel_settings"
              kernel_size={state.kernel_size}
              kernel={state.kernel}
              setKernel={(val) => handleChange("kernel", val)}
            />
          </div>
          <div className="col-lg-6">
            <div className="row">

              <div className="form-group pt-3 col-lg-4">
                <label htmlFor="background_color" className="form-label">Background color: </label>
                <input type="color" className="form-control" id="background_color"
                       value={state.background_color}
                       onChange={e => handleChange(e.target.id, e.target.value)}
                />
              </div>

              <div className="form-group pt-3 col-lg-4">
                <label htmlFor="pixel_size" className="form-label">Pixel size: </label>
                <input type="number" className="form-control" id="pixel_size"
                       value={state.pixel_size}
                       onChange={e =>
                         handleChange(e.target.id, parseInt(e.target.value))
                       }
                />
              </div>

              <div className="form-group pt-3 col-lg-4">
                <label htmlFor="speed" className="form-label">Speed: </label>

                <select
                  value={state.fps}
                  onChange={e => handleChange("fps", parseInt(e.target.value))}
                  className="form-control"
                  id="speed"
                >
                  <option value="500">Slow</option>
                  <option value="100">Normal</option>
                  <option value="16">Fast</option>
                  <option value="0">Ultra fast</option>
                </select>

              </div>

            </div>


            <button
              className="btn btn-primary mt-4 btn-lg"
              onClick={handleClick}
              style={{
                "backgroundColor": state.background_color
              }}
            >
              {(state.interval ? "Stop!" : "GO!")}
            </button>

            {(state.interval === null &&
            <button
              className="btn btn-outline-primary mt-4 btn-lg d-inline-block ml-3 "
              onClick={reset}
              style={{
                "borderColor": state.background_color,
                "color": state.background_color
              }}
            >
              Reset
            </button>)}
          </div>
        </div>





      </article>

      <Canvases
        key="canvases"
        state={state}
        kernel={state.kernel}
        tick_counter={state.tick_counter}
        // setCanvasDims={(h, w) => {
        //   handleChange("canvas_height", 640);
        //   handleChange("canvas_width", 640);
        // }}
      />


    </section>
  )
}