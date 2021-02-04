import React from "react";
import PragueImage from "../../static/mario.png";

const drawMario = (canvas) => {

  var ctx = canvas.getContext("2d");

  var marioArray=[
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0],
    [0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0],
    [0,0,0,3,3,3,1,1,1,0,1,0,0,0,0,0],
    [0,0,3,1,3,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,3,1,3,3,1,1,1,1,3,1,1,1,0,0],
    [0,0,3,3,1,1,1,1,1,3,3,3,3,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,2,2,2,4,2,2,4,2,0,0,0,0,0,0],
    [0,2,2,2,2,4,2,2,4,2,2,2,0,0,0,0],
    [2,2,2,2,2,4,4,4,4,2,2,2,2,0,0,0],
    [1,1,1,2,4,1,4,4,1,4,2,1,1,0,0,0],
    [1,1,1,1,4,4,4,4,4,4,1,1,1,0,0,0],
    [1,1,1,4,4,4,4,4,4,4,4,1,1,0,0,0],
    [0,0,0,4,4,4,4,4,4,4,4,0,0,0,0,0],
    [0,0,4,4,4,4,4,0,4,4,4,4,0,0,0,0],
    [0,4,4,4,4,4,4,0,4,4,4,4,4,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

  ]
  //starting position
  let offset = 32;
  var xPos = 0 + offset;
  var yPos = 0 + offset;

  for(var i=0; i < marioArray.length; i++){

    for(var r=0; r < marioArray[i].length; r++ ){
      ctx.fillRect(xPos, yPos, 32, 32);
      //black
     if(marioArray[i][r]===0){
       ctx.fillStyle = "#000000";
     }
     //flesh
      if(marioArray[i][r]===1){
       ctx.fillStyle = "#FFCC66";
     }
     //red
      if(marioArray[i][r]===2){
       ctx.fillStyle = "#FF0000";
     }
     //brown
     if(marioArray[i][r]===3){
       ctx.fillStyle = "#663300";
     }
     //blue
     if(marioArray[i][r]===4){
       ctx.fillStyle = "#66CCFF";
     }
    //move over 32px
    xPos+=32
    }//end internal for loop
    //once ctx reaches end on canvas reset xPos to 0
    xPos=0 + offset;
    //move down 32px
    yPos+=32;
  }//end for loop

  return ctx.getImageData(0, 0, 400, 400);

}

export default function Kernel(props) {
  const canvas = React.useRef(null);
  const canvas_output = React.useRef(null);

  let tick_counter = {
    "x": 0,
    "y": 0
  }

  const [state, setState] = React.useState({
    "ctx": null,
    "ctx_output": null,
    "canvas_size": 0,
    "interval": null,
    "kernel_size": 3,
    "pixel_size": 32,
    "fps": 500,
  })

  // Initialize state
  React.useEffect(() => {
    if (canvas && canvas_output) {
      drawMario(canvas.current);
      setState({
        ...state,
        "ctx": canvas.current.getContext("2d"),
        "ctx_output": canvas_output.current.getContext("2d")
      });
    }
  }, [canvas, canvas_output])


  // ###########################################################################################
  // ## METHODS
  // ###########################################################################################

  const tick = () => {
    let num_ticks = (canvas.current.width * canvas.current.height) / (state.pixel_size * state.pixel_size)
    if (tick_counter <= num_ticks) {
      tick_counter += 1;
      draw(tick_counter);
    }
  }

  const pickColor = (x, y) => {
    if (state.ctx) {
      let pixel = state.ctx.getImageData(x, y, 1, 1);
      let data = pixel.data;

      // const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
      // return rgba;

      return data;
    }
    return [];
  }

  const drawOutputPixel = (x, y, color) => {
    if (state.ctx_output) {
      state.ctx_output.fillRect(x, y, state.pixel_size, state.pixel_size);
      state.ctx_output.fillStyle = color;
    }
  }

  const filter_threshold_ticked = (x, y) => {
    let threshold = 100

    let pixelColor = pickColor(x, y);

    // console.log("filter pixel color", pixelColor, pixelColor[0], pixelColor[1], pixelColor[2], pixelColor[3]);

    // let v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    if (pixelColor.length) {
      return `rgba(${pixelColor[0]}, ${pixelColor[1]}, ${pixelColor[2]}, ${pixelColor[3]})`;
    }
    else
      return "rgb(0,0,0)"
  }

  const getCoords = tick => {
    let x = ((tick -1)  * state.pixel_size) % canvas.current.width;

    let ticks_per_row = Math.floor(canvas.current.width / state.pixel_size);
    let row = Math.trunc( (tick-1) / ticks_per_row);

    // Make sure the filter does not go away from the picture
    if (tick % (ticks_per_row - state.kernel_size) === 0) {
      x = 0;
      row += 1;
    }

    let y = row * state.pixel_size;

    return {"x": x, "y": y}
  }

  const draw = (tick) => {

    if (!state.ctx) {
      return null;
    }

    drawMario(canvas.current);

    let size = state.kernel_size * state.pixel_size - 1;
    const {x, y} = getCoords(tick);

    // Mriezka

    for (let j = 0; j < state.kernel_size; j++) {
      for (let i = 0; i < state.kernel_size; i++) {
        state.ctx.strokeRect((x + state.pixel_size / 2) + state.pixel_size * i, (y + state.pixel_size / 2) + state.pixel_size * j, 1, 1);
      }
    }

    drawOutputPixel(x, y, filter_threshold_ticked(x, y));

    state.ctx.strokeStyle = "#ff0000";
    state.ctx.strokeRect(x, y, size, size);
  }

  const toggleAnimation = () => {
    if (state.interval == null) {
      // Reset tick counter
      tick_counter = state.tick_counter || 0;
      let interval = setInterval(() => tick(), state.fps);
      setState({
        ...state,
        "interval": interval
      })
    }
    else {
      // Stop animation - set tick_counter
      clearInterval(state.interval);
      setState({
        ...state,
        "interval": null,
        "tick_counter": tick_counter
      })
    }
  }

  const handleClick = () => {
    if (canvas.current.width && canvas.current.height) {
      toggleAnimation();
    }
  }


  return (
    <div className="mario-canvas">

      <button className="btn btn-primary" onClick={handleClick}>Start / stop animation</button>

      <div className="row">
        <div className="col-lg-6 col-md-12 col-sm-12">
          <h3> Original </h3>
          <canvas
            ref={canvas}
            width="576"
            height="640"
          />
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12">
          <h3> Filtered </h3>
          <canvas
            ref={canvas_output}
            width="576"
            height="640"
          />
        </div>
      </div>

    </div>
  )
}