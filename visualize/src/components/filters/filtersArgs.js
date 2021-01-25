import React from "react";
import {Input} from "@material-ui/core";


export default function FiltersArgs (props) {
  const { currentFilter, setCurrentFilterArgs } = props;

  React.useEffect(() => {
    if (currentFilter && !currentFilter.args && currentFilter.settings.args) {
      currentFilter.settings.args.map(arg => {
        let fakeEvent = {
          target: {
            value: arg.value
          }
        }
        handleChange(fakeEvent, arg);
      })
    }
  }, [currentFilter])

  const handleChange = (e, arg) => {
    setCurrentFilterArgs({name: arg.name, value: e.target.value})
  }

  const getValue = (arg) => {
    if (currentFilter && currentFilter.args && currentFilter.args[arg.name]) {
      return currentFilter.args[arg.name].value;
    }
    return arg.value;
  }

  if (currentFilter && currentFilter.settings.args) {
    return (
      currentFilter.settings.args.map(arg => (
        <Input
          {...arg}
          value={getValue(arg)}
          onChange={e => handleChange(e, arg)}
          key={`${arg.name}_${arg.type}`}
        />
      ))
    )
  }
  else {
    return null;
  }

}