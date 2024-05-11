import React, { useEffect, useState } from "react";
import {
  FormRow,
  FormRowSelect,
  FormRowAppointment,
  Alert,
} from "../../components";
import { useAppcontext } from "../../context/appContext";

import Wrapper from "../../assets/wrappers/DashboardFormPage";
function AddAppointment() {
  const {
    name,
    lastName,
    age,
    date,
    time,
    type,
    note,
    AppointmentOptions,
    defaultAppointment,
    isLoading,
    clearValues,
    handleChange,
    displayAlert,
    getPatients,
    patients,
    phoneNumber,
  } = useAppcontext();
  useEffect(() => {
    getPatients();
  }, []);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  console.log(patients);
  const handlePatientSelect = (patientId) => {
    const selectedPatient = patients.find(
      (patient) => patient._id === patientId
    );
    if (selectedPatient) {
      console.log("Selected patient:", selectedPatient);
      handleChange({ name: "name", value: selectedPatient.name });
      handleChange({ name: "lastName", value: selectedPatient.lastName });
      handleChange({ name: "age", value: selectedPatient.age });
    }
  };
  const handleSelectChange = (e) => {
    setSelectedPatientId(e.target.value);
    handlePatientSelect(Number(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !lastName || !age || !date || !time || !type || !note) {
      displayAlert();
      return;
    }
  };
  const handleAppointmentInput = (e) => {
    const { name, value } = e.target;
    handleChange({ name, value });
  };
  return (
    <Wrapper>
      <form className="form">
        <h3>Add Appointment</h3>
        <div className="form-center">
          <FormRowAppointment
            labelText="Patient"
            name="patient"
            value={selectedPatientId}
            handleChange={handleSelectChange}
            list={patients.map((patient) => ({
              value: patient._id,
              text: `${patient.name} ${patient.lastName}`,
            }))}
          />
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
            type="Date"
            name="date"
            value={date}
            handleChange={handleAppointmentInput}
          />
          <FormRow
            labelText="Time"
            type="text"
            name="time"
            value={time}
            handleChange={handleAppointmentInput}
          />
          <FormRowSelect
            labelText="Type"
            name="type"
            value={type}
            handleChange={handleAppointmentInput}
            list={AppointmentOptions}
          />
          <FormRow
            labelText="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            handleChange={handleAppointmentInput}
          />
          <FormRow
            labelText="Note"
            name="note"
            value={note}
            handleChange={handleAppointmentInput}
          />
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Add
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
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

export default AddAppointment;
