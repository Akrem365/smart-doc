import React from "react";

function FormRowAppointment({ labelText, name, value, handleChange, list }) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="form-select"
      >
        {list.map(
          (
            item // Utilisez item au lieu de currentItem
          ) => (
            <option key={item.value} value={item.value}>
              {item.text}
            </option>
          )
        )}
      </select>
    </div>
  );
}

export default FormRowAppointment;
