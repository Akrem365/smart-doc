import { useState } from "react";
import { FormRow, Alert } from "../../components";
import "../../assets/wrappers/stats.css";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useAppcontext } from "../../context/appContext";

function Profile() {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppcontext();
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [lastName, setlastName] = useState(user?.lastName);
  const [location, setLocation] = useState(user?.location);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !location || !lastName) {
      displayAlert();
      return;
    }
    updateUser({ name, email, lastName, location });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3 style={{ color: "black" }}>Profile</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            labelText="name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <FormRow
            type="text"
            name="lastName"
            labelText="Last Name"
            value={lastName}
            handleChange={(e) => setlastName(e.target.value)}
          />
          <FormRow
            type="email"
            name="email"
            labelText="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <FormRow
            type="text"
            name="location"
            labelText="Location"
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please wait.." : "Save Changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
}

export default Profile;
