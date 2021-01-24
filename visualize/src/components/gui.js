import React from 'react';
import Canvas from './canvas/canvas.js';
import {Filters} from './filters/filters';

export default function GUI(props) {

  const [state, setState] = React.useState({
    filtered_image: null,
    canvas_dimensions: {}
  });

  const updateState = (key, value) => {
    setState({
      ...state,
      [key]: value
    })
  }

  return (
    <div>
      <Filters
        canvas_dimensions={state.canvas_dimensions}
        set_filtered_image={data => updateState('filtered_image', data)}
      />
      <Canvas
        canvas_dimensions={state.canvas_dimensions}
        filtered_image={state.filtered_image}
        set_canvas_dimensions={data => updateState('canvas_dimensions', data)}
      />
    </div>
  )
}