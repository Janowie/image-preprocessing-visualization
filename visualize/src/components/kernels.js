import React from "react";


const createInput = (value, index, handleChange, handleBlur) => {
  return (
    <div
      className="col-4 mb-2"
      key={`kernel_input_div_${index}`}
    >
      <input
        key={`kernel_input_${index}`}
        type="text"
        className="form-control"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  )
}


export default function KernelSettings(props) {

  const handleChange = (index, e) => {
    let new_values = [...props.kernel];
    new_values[index] = e.target.value;
    props.setKernel(new_values);
    // Focus back on input
    e.target.focus();
  }

  const handleBlur = (index, e) => {
    let new_values = [...props.kernel];
    new_values[index] = parseFloat(e.target.value);
    props.setKernel(new_values);
  }

  return (
    <div
      className="form-group pt-3 row kernel_settings"
    >
      <p>Kernel:</p>
      {props.kernel.map((val, index) => createInput(
        val,
        index,
        e => handleChange(index, e),
        e => handleBlur(index, e)
      ))}
    </div>
  )
}