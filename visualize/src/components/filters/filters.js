import React from 'react';
import {FormControl, InputLabel, Select, Input } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {FiltersManager} from './FiltersManager.js';
import FiltersArgs from './filtersArgs.js';
import FiltersSelect from './filtersSelect.js';


export const Filters = props => {

  const { canvas_dimensions, set_filtered_image } = props;
  const [state, setState] = React.useState({
    filtersManager: null,
    currentFilter: null
  });
  const image = document.querySelector(".App .canvas-area > img");

  React.useEffect(() => {
    if (state.filtersManager) {
      state.filtersManager.setCanvasDimensions(canvas_dimensions);
    }
  }, [canvas_dimensions])

  React.useEffect(() => {
    if (state.filtersManager == null) {
      setState({
        ...state,
        filtersManager: new FiltersManager()
      })
    }
  }, [state.filters]);

  const handleClick = () => {
    if (state.currentFilter) {
      filter(state.currentFilter.name, state.currentFilter.args);
    }
    else {
      alert("No filter selected!");
    }
  }

  const updateState = (key, value) => {
    setState({
      ...state,
      [key]: value
    })
  }

  const updateFilterArg = data => {
    updateState("currentFilter", {
          ...state.currentFilter,
          args: {
            ...state.currentFilter.args,
            [data.name]: data.value
          }
        })
  }

  const filter = (filter, args) => {
    if (state.filtersManager && image) {
      let filtered_image = state.filtersManager.runFilter(image, filter, args)
      set_filtered_image(filtered_image);
    }
  }

  return (
    <div>

      <h1>Filters</h1>

      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-age-native-simple">Filters</InputLabel>
        <FiltersSelect
          currentFilter={state.currentFilter}
          setCurrentFilter={data => updateState('currentFilter', data)}
          filters={state.filtersManager}
        />
      </FormControl>

      <FiltersArgs
        currentFilter={state.currentFilter}
        setCurrentFilterArgs={updateFilterArg}
      />

      <Button
        variant="contained"
         color="primary"
        onClick={handleClick}
      >Apply filter</Button>
    </div>

  )
}
