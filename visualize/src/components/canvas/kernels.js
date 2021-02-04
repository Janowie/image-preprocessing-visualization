import React from "react";

export default function KernelSettings(props) {

  const [kernel, setKernel] = React.useState(null)

  React.useEffect(() => {

    if (kernel === null) {
      if (props.kernel.length) {
        setKernel(props.kernel);
      }
      else {
        let new_kernel = []
        for (let i = 0; i < Math.pow(props.kernel_size, 2); i++) {
          new_kernel.push(0);
        }
        setKernel(new_kernel);
      }
    }

  })


  const handleChange = (e, index) => {
    let new_kernel = kernel;
    new_kernel[index] = parseFloat(e.target.value);
    props.setKernel(new_kernel);
    setKernel(new_kernel);
  }

  return (
    <div className="form-group pt-3">
      <br/>
      <p>Kernel</p>
      {
        (kernel &&
      kernel.map((val, index) => {
        if (index > 0 && index % props.kernel_size === 0)
          return (
            <React.Fragment
              key={`kernel_input_fragment_${index.toString()}`}
            >
              <br key={`kernel_input_br_${index.toString()}`}/>
              <input
                key={`kernel_input_${index.toString()}`}
                name={`kernel_input_${index.toString()}`}
                type="text"
                value={val || 0}
                onChange={(e) => handleChange(e, index)}
                size="3" />
            </React.Fragment>
          )
        else
          return (
            <input
              key={`kernel_input_${index.toString()}`}
              name={`kernel_input_${index.toString()}`}
              type="text"
              value={val || 0}
              onChange={(e) => handleChange(e, index)}
              size="3" />
          )
      })
        )}

    </div>
  )
}