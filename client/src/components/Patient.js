import moment from "moment";
import { useAppcontext } from "../context/appContext";
import Wrapper from "../assets/wrappers/Job";
import PatientInfo from "./PatientInfo";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { GiCandleLight } from "react-icons/gi";
import { FaTransgender } from "react-icons/fa";
import { MdPermDeviceInformation } from "react-icons/md";
import { FaCalendar } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import green from "../assets/images/done-icon.png";
import red from "../assets/images/red-x-icon.png";
import { Checkmark } from "react-checkmark";
import { useEffect, useState } from "react";

function Patient({
  name,
  lastName,
  age,
  createdAt,
  _id,
  genre,
  antecedent,
  bed,
  department,
  healthStatus,
}) {
  const {
    setEditPatient,
    deletePatient,
    viewStatsPatinet,
    sendIdToAppointment,
  } = useAppcontext();
  const [previousHealthStatus, setPreviousHealthStatus] =
    useState(healthStatus);
  useEffect(() => {
    if (healthStatus !== previousHealthStatus && healthStatus === "Bad") {
      alert("Health status changed to Bad!");
    }
    setPreviousHealthStatus(healthStatus);
  }, [healthStatus, previousHealthStatus]);
  let date = moment(createdAt);
  date = date.format("MMMM Do, YYYY");
  const iconColor = healthStatus === "Good" ? "green" : "red";
  return (
    <Wrapper>
      <header>
        {/* {name.charAt(0)} */}
        <div className="main-icon">
          <CiUser />
        </div>
        <div className="info">
          <h5 className="value">{name}</h5>
          <h5 className="value">{lastName}</h5>
        </div>
      </header>

      <div className="content">
        <h4 color="black">
          Status
          <PatientInfo
            icon={<Checkmark color={iconColor} />}
            text={healthStatus}
          />
        </h4>
        <div className="content-center">
          <PatientInfo icon={<FaTransgender />} text={genre} />
          <PatientInfo icon={<GiCandleLight />} text={age} />
          <PatientInfo icon={<MdPermDeviceInformation />} text={antecedent} />
          <PatientInfo icon={<FaCalendar />} text={date} />
          <PatientInfo icon={<FaCalendar />} text={department} />
          <PatientInfo icon={<FaBed />} text={bed} />
        </div>

        <footer>
          <div className="actions">
            <Link
              to="/"
              className="btn edit-btn"
              onClick={() => viewStatsPatinet(_id)}
            >
              Params Viatux
            </Link>
            <Link
              to="/add-patient"
              className="btn edit-btn"
              onClick={() => setEditPatient(_id)}
            >
              Edit
            </Link>
            <Link
              to="/Appointment"
              className="btn edit-btn"
              onClick={() => sendIdToAppointment(_id)}
            >
              Appointment
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => deletePatient(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
}

export default Patient;
