import React, { useEffect, useState } from "react";
import { Alert, FormRow, Logo } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppcontext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};
function Register() {
  const [value, setvalue] = useState(initialState);
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    showAlert,
    displayAlert,
    RegisterUSer,
    loginUser,
    approvedLogin,
  } = useAppcontext();

  function togglefunction() {
    setvalue({ ...value, isMember: !value.isMember });
  }

  function handleChange(e) {
    setvalue({ ...value, [e.target.name]: e.target.value });
  }
  const onSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      isMember,
      registrationNumber,
      role,
      lastName,
      location,
    } = value;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = {
      name,
      email,
      password,
      registrationNumber,
      role: "user",
      lastName,
      location,
    };

    if (isMember) {
      loginUser(currentUser);
    } else {
      RegisterUSer(currentUser);
    }
  };
  useEffect(() => {
    if (user) {
      if (!approvedLogin) {
        navigate("/approvalMessage");
        return;
      }
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{value.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {!value.isMember && (
          <>
            <FormRow
              type="text"
              name="name"
              value={value.name}
              handleChange={handleChange}
              labelText="Name"
            />
            <FormRow
              type="text"
              name="lastName"
              value={value.lastName}
              handleChange={handleChange}
              labelText="Last Name"
            />
            <FormRow
              type="text"
              name="registrationNumber"
              value={value.registrationNumber}
              handleChange={handleChange}
              labelText="Registration Number"
            />
            <FormRow
              type="text"
              name="location"
              value={value.location}
              handleChange={handleChange}
              labelText="Location"
            />
            <label className="form-label">Role</label>
            <select
              name="role"
              value={value.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}
        <FormRow
          type="email"
          name="email"
          value={value.email}
          handleChange={handleChange}
          labelText="Email"
        />
        <FormRow
          type="password"
          name="password"
          value={value.password}
          handleChange={handleChange}
          labelText="Password"
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Submit
        </button>
        <p>
          {value.isMember ? "Not a member yet?" : "Alerady a member?"}
          <button type="button" onClick={togglefunction} className="member-btn">
            {value.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}

export default Register;
