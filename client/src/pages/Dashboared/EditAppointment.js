import React from "react";
import { FormRow, FormRowSelect, Alert } from "../../components";
import { useAppcontext } from "../../context/appContext";

import Wrapper from "../../assets/wrappers/DashboardFormPage";

function EditAppointment() {
  const {
    name,
    lastName,
    age,
    date,

    notes,
    department,
    departmentOptions,
    bed,
    isLoading,
    handleChange,
    displayAlert,
    showAlert,
    clearValuesAppointment,
    typeOptions,
    type,
    phoneNumber,
    EditAppointment,
  } = useAppcontext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !lastName || !age || !date || !phoneNumber) {
      console.log("champs vide");
      displayAlert();
      return;
    }
    EditAppointment();
    console.log("appointment Edit succes!");
  };
  const handleAppointmentInput = (e) => {
    const { name, value } = e.target;
    handleChange({ name, value });
  };
  return (
    <Wrapper>
      <form className="form">
        <h3 style={{ color: "black" }}>Edit Appointment</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            labelText="name"
            type="text"
            name="name"
            value={name}
            handleChange={handleAppointmentInput}
          />
          <FormRow
            labelText="Last Name"
            type="text"
            name="lastName"
            value={lastName}
            handleChange={handleAppointmentInput}
          />
          <FormRow
            labelText="Age"
            type="number"
            name="age"
            value={age}
            handleChange={handleAppointmentInput}
          />
          <FormRow
            labelText="Date"
            type="datetime-local"
            name="date"
            value={date}
            handleChange={handleAppointmentInput}
          />

          <FormRowSelect
            labelText="type"
            name="type"
            value={type}
            handleChange={handleAppointmentInput}
            list={typeOptions}
          />
          <FormRow
            labelText="Bed"
            name="bed"
            value={bed}
            handleChange={handleAppointmentInput}
          />
          <FormRowSelect
            labelText="Department"
            name="department"
            value={department}
            handleChange={handleAppointmentInput}
            list={departmentOptions}
          />
          <FormRow
            labelText="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            handleChange={handleAppointmentInput}
          />
          <FormRow
            labelText="Note"
            name="notes"
            value={notes}
            handleChange={handleAppointmentInput}
          />
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Submit
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValuesAppointment();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
}

export default EditAppointment;
