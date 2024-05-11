import { useAppcontext } from "../context/appContext";
import { useEffect } from "react";
import Loading from "./Loading";
import Patient from "./Patient";
import Wrapper from "../assets/wrappers/JobsContainer";

function PatientsContainer({ refreshPatients, setRefreshPatients }) {
  const { getPatients, patients, isLoading, numOfPages, totalPatients } =
    useAppcontext();

  useEffect(() => {
    getPatients();
  }, [refreshPatients]);
  useEffect(() => {
    if (refreshPatients) {
      setRefreshPatients(false);
    }
  }, [refreshPatients, setRefreshPatients]);

  if (isLoading) {
    return <Loading center />;
  }

  if (!patients || patients.length === 0) {
    return (
      <Wrapper>
        <h2>No Patients to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalPatients} Patient{patients.length > 1 ? "s" : ""} found
      </h5>
      <div className="jobs">
        {patients.map((patient) => (
          <Patient key={patient._id} {...patient} />
        ))}
      </div>
    </Wrapper>
  );
}

export default PatientsContainer;
