import React, { useEffect, useState } from "react";
import "../../assets/wrappers/stats.css";
import { useAppcontext } from "../../context/appContext";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

function Appointment() {
  const {
    appointmentPatientID,
    getAppointmentsByPatientId,
    DeleteAppointmnetById,
    AppontmentPatientId,
    setEditAppointment,
    isLoading,
    name,
    lastName,
  } = useAppcontext();

  useEffect(() => {
    getAppointmentsByPatientId(AppontmentPatientId);
    console.log(appointmentPatientID);
  }, []);
  const [isDeleting, setisDeleting] = useState(false);

  if (isLoading || isDeleting) {
    return <Loading center />;
  }

  const handleDelete = async (id) => {
    setisDeleting(true);
    await DeleteAppointmnetById(id);

    setisDeleting(false);
  };

  const extractTimeFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <div className="memeLigne">
        <h1>Appointment List</h1>
        <Link to="/AddAppointment" className="btn btn-large ">
          Add Appointment
        </Link>
      </div>
      <h2>
        Patient: {name} {lastName}
      </h2>
      <section className="attendance">
        <div className="attendance-list">
          <table className="table">
            <thead>
              <tr>
                <th>Age</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Department</th>
                <th>Bed</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointmentPatientID && appointmentPatientID.length > 0 ? (
                appointmentPatientID.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.age}</td>
                    <td>{new Date(appointment.date).toLocaleDateString()}</td>
                    <td>{extractTimeFromDate(appointment.date)}</td>
                    <td>{appointment.type}</td>
                    <td>{appointment.department}</td>
                    <td>{appointment.bed}</td>
                    <td>{appointment.notes}</td>
                    <td>
                      <Link
                        to="/EditAppointment"
                        className="btn edit-btn"
                        onClick={() => setEditAppointment(appointment._id)}
                      >
                        edit
                      </Link>
                      <Link
                        className="btn delete-btn"
                        onClick={() => handleDelete(appointment._id)}
                        to="/all-patient"
                      >
                        Annuler
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No appointments available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default Appointment;
