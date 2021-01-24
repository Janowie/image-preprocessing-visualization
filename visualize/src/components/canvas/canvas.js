import React from 'react';
import PragueImage from "../../static/prague.jpg";


import './canvas.css';

export default function Canvas(props) {

  const { filtered_image, canvas_dimensions, set_canvas_dimensions } = props;

  const canvas = React.useRef(null);
  const image = React.useRef(null);

  React.useEffect(() => {
    if (filtered_image) {
      draw(filtered_image);
    }
  }, [filtered_image])

  const handleImageLoad = () => {
    if (image.current.width && image.current.height) {
      set_canvas_dimensions({
        height: image.current.height,
        width: image.current.width
      })
    }
  }

  const draw = (pixels) => {
    let ctx = canvas.current.getContext('2d');
    ctx.putImageData(pixels, 0, 0);
  }

  return (
    <React.Fragment>

      <div className="canvas-area">
        <img
          onLoad={handleImageLoad}
          ref={image}
          src={PragueImage}
          alt="Prague"
          style={{"border": "1px solid"}}
        />

        <canvas
          ref={canvas}
          width={canvas_dimensions.width}
          height={canvas_dimensions.height}
          style={{"border": "1px solid", visibility: (canvas_dimensions.width && canvas_dimensions.height ? "visible": "hidden")}}
        />
      </div>
    </React.Fragment>
  )
}
