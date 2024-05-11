import { FormRow, FormRowSelect, Alert } from "../../components";

import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useAppcontext } from "../../context/appContext";
function AddPatient() {
  const {
    isLoading,
    showAlert,
    displayAlert,
    name,
    lastName,
    age,
    genreOptions,
    genre,
    antecedent,
    antecedentOptions,
    isEditing,
    handleChange,
    clearValues,
    createPatient,
    editPatient,
    bed,
    department,
    departmentOptions,
    phoneNumber,
  } = useAppcontext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !lastName || !age || !phoneNumber) {
      displayAlert();
      return;
    }
    if (isEditing) {
      editPatient();
      return;
    }
    createPatient();
    console.log("patient created");
  };

  const handlePatientInput = (e) => {
    const { name, value } = e.target;
    handleChange({ name, value });
  };
  return (
    <Wrapper>
      <form className="form">
        <h3 style={{ color: "black" }}>
          {isEditing ? "edit patient" : "add patient"}
        </h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            labelText="name"
            type="text"
            name="name"
            value={name}
            handleChange={handlePatientInput}
          />
          <FormRow
            labelText="Last Name"
            type="text"
            name="lastName"
            value={lastName}
            handleChange={handlePatientInput}
          />
          <FormRow
            labelText="Age"
            type="number"
            name="age"
            value={age}
            handleChange={handlePatientInput}
          />
          <FormRowSelect
            name="genre"
            value={genre}
            handleChange={handlePatientInput}
            list={genreOptions}
          />
          <FormRowSelect
            name="antecedent"
            value={antecedent}
            handleChange={handlePatientInput}
            list={antecedentOptions}
          />
          <FormRow
            labelText="phone number"
            type="number"
            name="phoneNumber"
            value={phoneNumber}
            handleChange={handlePatientInput}
          />
          <FormRow
            labelText="bed"
            type="number"
            name="bed"
            value={bed}
            handleChange={handlePatientInput}
          />
          <FormRowSelect
            name="department"
            value={department}
            handleChange={handlePatientInput}
            list={departmentOptions}
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

export default AddPatient;
