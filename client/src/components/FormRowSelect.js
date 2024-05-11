import React from "react";

function FormRowSelect({ labelText, name, value, handleChange, list }) {
  return (
    <div className="form-row">
      <label
        htmlFor="genre"
        className="form-label"
        style={{ color: "black", fontSize: "18px" }}
      >
        {labelText || name}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="form-select"
      >
        {list.map((currentItem, index) => {
          return (
            <option key={index} value={currentItem}>
              {currentItem}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default FormRowSelect;
