import React from 'react';
import {FormControl, InputLabel, Select} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {FiltersManager} from './FiltersManager.js';


const FiltersOptions = props => {
  const {filters} = props;

  if (filters) {
    return (
      Object.getOwnPropertyNames(filters)
        .filter(p => p.indexOf("filter") > -1)
        .map(p => (
          <option value={p} key={p}>
            {(p
              .substr(7, p.length)
              .replaceAll("_", " "))}
          </option>
        ))
    )
  }
  else {
    return <option value={null}></option>
  }
}

const FiltersSelect = props => {

  const {filters, currentFilter, setCurrentFilter} = props;
  const handleChange = event => {
    setCurrentFilter(event.target.value);
  }

  return (
    <Select
      native
      value={currentFilter || ""}
      onChange={handleChange}
      label="Filter"
      inputProps={{
        name: 'filter',
        id: 'outlined-filter-native-simple',
      }}
    >
      <option value={null}>Select filter</option>
      <FiltersOptions filters={filters}/>
    </Select>
  )

}


export const Filters = props => {

  const { canvas_dimensions, set_filtered_image } = props;
  const [state, setState] = React.useState({
    filters: null,
    currentFilter: null
  });
  const image = document.querySelector(".App .canvas-area > img");

  React.useEffect(() => {
    if (state.filters) {
      state.filters.setCanvasDimensions(canvas_dimensions);
    }
  }, [canvas_dimensions])

  React.useEffect(() => {
    if (state.filters == null) {
      setState({
        ...state,
        filters: new FiltersManager()
      })
    }
  }, [state.filters]);

  const handleClick = () => {
    if (state.currentFilter) {
      filter(state.currentFilter, null);
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

  const filter = (filter, args) => {
    if (state.filters && image) {
      let filtered_image = state.filters.runFilter(image, filter, args)
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
          filters={state.filters}
        />
      </FormControl>

      <Button
        variant="contained"
         color="primary"
        onClick={handleClick}
      >Apply filter</Button>
    </div>

  )
}
