import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppcontext } from "../../context/appContext";
const localizer = momentLocalizer(moment);
function Calendrier() {
  const { appointment, getAppointments } = useAppcontext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAppointments();
    setLoading(false);
  }, []);

  console.log(appointment);
  if (!getAppointments || !appointment) {
    return <h1>Chargement des données...</h1>;
  }
  const formatRendezVous = () => {
    if (!Array.isArray(appointment) || appointment.length === 0) {
      return [];
    }
    return appointment.map((rdv) => ({
      title: `${rdv.name} ${rdv.lastName}`,
      start: moment(rdv.date).toDate(),
      end: moment(rdv.date).add(1, "hour").toDate(),
    }));
  };
  return (
    <div style={{ height: 600 }}>
      {loading ? (
        <p>Chargement des données...</p>
      ) : appointment.length === 0 ? (
        <p>Aucun rendez-vous à afficher.</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={formatRendezVous()}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: 50 }}
        />
      )}
    </div>
  );
}

export default Calendrier;
