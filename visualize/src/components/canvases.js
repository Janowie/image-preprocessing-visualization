import React from "react";
import {dot} from "mathjs";
import Mario from "../static/mario_bg.png";

export default function Canvases(props) {

  const canvas = React.useRef(null);
  const canvas_output = React.useRef(null);

  const [state, setState] = React.useState({
    "ctx": null,
    "ctx_output": null,
  })

  // Initialize state
  React.useEffect(() => {
    if (canvas && canvas_output) {
      props.state.image.crossOrigin = 'anonymous';
      props.state.image.src = Mario;
      props.state.image.onload = () => {

        initCanvases();

        setState({
          ...state,
          "ctx": canvas.current.getContext("2d"),
          "ctx_output": canvas_output.current.getContext("2d")
        });

        // console.log(canvas.current.height, canvas.current.width);
        // props.setCanvasDims(640,640);
      }
    }
  }, [canvas, canvas_output])

  React.useEffect(() => {
    if (state.ctx) {
      drawKernel(0, 0);
    }
  }, [state.ctx])

  React.useEffect(() => {
    if (
      props.state.interval == null && props.state.pixel_size > 0
    ) {
      initCanvases();
    }
  }, [props.state.pixel_size, props.state.background_color])

  React.useEffect(() => {
    if (props.tick_counter) {
      if (props.tick_counter.x === 0 && props.tick_counter.y === 0) {
        initCanvases();
      }
      draw();
    }
  })

  React.useEffect(() => {
    if (props.state.reset) {
      initCanvases();
      draw();
    }
  }, [props.state.reset])

  // ###########################################################################################
  // ## METHODS
  // ###########################################################################################

  const drawLine = (ctx, f_x, f_y, t_x, t_y) => {
    ctx.beginPath();
    ctx.moveTo(f_x, f_y);
    ctx.lineTo(t_x, t_y);
    ctx.strokeStyle = 'rgba(182,182,182,0.5)';
    if (props.state.pixel_size < 3)
      ctx.strokeStyle = 'rgba(182,182,182,0.01)';
    ctx.stroke();
  }

  const drawPixels = (canvas) => {
    let ctx = canvas.getContext("2d");
    for (let row = 0; row < canvas.height; row += props.state.pixel_size) {
      drawLine(ctx, 0, row, canvas.width, row);
      drawLine(ctx, row, 0, row, canvas.height);
    }
  }

  const drawBackgroundImage = (canvas) => {

    let ctx = canvas.getContext("2d");
    let offset = props.state.pixel_size;

    // Draw background
    ctx.fillStyle = props.state.background_color;
    ctx.fillRect(0, 0, 1000, 1000);

    // Draw image
    ctx.drawImage(props.state.image, offset, offset, canvas.height-offset*2, canvas.width-offset*2);
    drawPixels(canvas);

  }

  const initCanvases = () => {
    drawBackgroundImage(canvas.current);
    let ctx_output = canvas_output.current.getContext('2d');
    // Draw background
    ctx_output.fillStyle = props.state.background_color;
    ctx_output.fillRect(0, 0, 1000, 1000);
    drawPixels(canvas_output.current);
  }

  const getPixel = (x, y) => {
    if (state.ctx) {
      let pixel = state.ctx.getImageData(x, y, 1, 1);
      let data = pixel.data;

      return data;
    }
    return [];
  }

  const drawOutputPixel = (x, y, color) => {
    if (state.ctx_output) {
      state.ctx_output.fillStyle = color;
      state.ctx_output.fillRect(x, y, props.state.pixel_size, props.state.pixel_size);
    }
  }

  const split_channels = (values) => {
    let r = [];
    let g = [];
    let b = [];
    let a = [];

    for (let i = 0; i < values.length; i++) {
      r.push(values[i][0]);
      g.push(values[i][1]);
      b.push(values[i][2]);
      a.push(values[i][3]);
    }

    return [r, g, b, a];
  }

  const filter_conv = (x, y, values) => {

    let kernel = props.kernel;
    let v = split_channels(values);

    let color = "rgba(255,255,255,0)";
    try {
      color = `rgba(${dot(v[0], kernel)},${dot(v[1], kernel)},${dot(v[2], kernel)},255)`;
    }
    catch (err) {
      // ERROR !
    }
    return color;
  }

  const drawKernel = (x, y) => {

    let border_width = 1;
    let size = props.state.kernel_size * props.state.pixel_size - border_width;
    let dot_size = 2;

    state.ctx.fillStyle = "rgba(44, 62, 80,0.5)";
    state.ctx.fillRect(x, y, size, size);
    state.ctx.strokeStyle = "rgba(241, 196, 15,1.0)";
    state.ctx.strokeRect(x, y, size, size);

    for (let j = 0; j < props.state.kernel_size; j++) {
      for (let i = 0; i < props.state.kernel_size; i++) {
        if (i === 1 && j === 1) {
          dot_size = 6
        }
        else {
          dot_size = 2
        }
          state.ctx.fillRect((x + props.state.pixel_size / 2) + props.state.pixel_size * i - dot_size/2, (y + props.state.pixel_size / 2) + props.state.pixel_size * j - dot_size/2, dot_size, dot_size);
      }
    }
  }

  const getKernelValues = (x, y) => {
    let values = [];
    for (let j = 0; j < props.state.kernel_size; j++) {
      for (let i = 0; i < props.state.kernel_size; i++) {
        values.push(getPixel((x + props.state.pixel_size / 2) + props.state.pixel_size * i, (y + props.state.pixel_size / 2) + props.state.pixel_size * j))
      }
    }
    return values;
  }

  const draw = () => {

    if (!state.ctx) {
      return null;
    }

    let x = props.tick_counter.x * props.state.pixel_size;
    let y = props.tick_counter.y * props.state.pixel_size;

    // Original canvas
    drawBackgroundImage(canvas.current);
    let values = getKernelValues(x, y);
    drawKernel(x, y);

    // Output canvas
    drawOutputPixel(x + props.state.pixel_size, y + props.state.pixel_size, filter_conv(x, y, values));

  }

  return (
    <div className="row mb-5">
      <div className="col-lg-6 col-md-12 col-sm-12">
        <h3> Original </h3>
        <canvas
          ref={canvas}
          width="640"
          height="640"
        >
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
      <div className="col-lg-6 col-md-12 col-sm-12">
        <h3> Filtered </h3>
        <canvas
          ref={canvas_output}
          width="640"
          height="640"
        >
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
    </div>

  )
}