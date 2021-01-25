import {Select} from "@material-ui/core";
import React from "react";

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

export default function FiltersSelect(props) {

  const {filters, currentFilter, setCurrentFilter} = props;
  const handleChange = event => {
    setCurrentFilter({
      "name": event.target.value,
      "settings": filters.getSettings(event.target.value),
      "args": null
    });
  }

  return (
    <Select
      native
      value={currentFilter && currentFilter.name || ""}
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