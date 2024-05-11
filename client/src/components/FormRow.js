import React from "react";

function FormRow(props) {
  const { type, name, value, handleChange, labelText } = props;
  return (
    <div className="form-row">
      <label
        className="form-label"
        style={{ color: "black", fontSize: "18px" }}
      >
        {labelText}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
}

export default FormRow;
