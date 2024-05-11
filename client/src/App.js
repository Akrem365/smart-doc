import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Error, Register, Landing, ProtectedRoute } from "./pages";
import {
  AddPatient,
  AllPatient,
  Profile,
  Stats,
  StatistiqueAll,
  Appointment,
  AddAppointment,
  AdminDashboared,
  ApprovalMessage,
  HistoriqueParamsVitaux,
  Calendrier,
  EditAppointment,
} from "./pages/Dashboared";
import SharedLayout from "./pages/Dashboared/sharedLayout.js";
import { useAppcontext } from "./context/appContext.js";
import io from "socket.io-client";
import { useEffect, useState } from "react";
// const socket = io("http://192.168.1.2:5000");
const socket = io(`${window.location.origin}`);

socket.on("connect", () => {
  console.log("Connected to server");
});
function App() {
  const [refreshPatients, setRefreshPatients] = useState(false);
  useEffect(() => {
    console.log("useEffect is called");

    socket.addEventListener("notification", (data) => {
      console.log("Notification received:", data);
      alert(
        `Message: ${data.message}\nPatient Name: ${data.patientName}\nPatient Last Name: ${data.patientLastName}\nHealth Status: ${data.healthStatus}`
      );
      console.log("notification succes");
      setRefreshPatients(true);
    });

    return () => {
      socket.off("notification");
    };
  }, []);
  const { role } = useAppcontext();
  let dashboardRoute;

  if (role === "admin") {
    // Si le rôle est admin, afficher uniquement le tableau de bord
    dashboardRoute = (
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboared />} />
        {/* <Route path="historique" element={<Historique />} /> */}
      </Route>
    );
  } else {
    // Sinon, afficher les routes utilisateur normales
    dashboardRoute = (
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Stats />} />
        <Route path="statistique" element={<StatistiqueAll />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="all-patient"
          element={
            <AllPatient
              refreshPatients={refreshPatients}
              setRefreshPatients={setRefreshPatients}
            />
          }
        />
        <Route path="add-patient" element={<AddPatient />} />
        <Route path="Calendrier" element={<Calendrier />} />
        <Route path="AddAppointment" element={<AddAppointment />} />
        <Route path="Appointment" element={<Appointment />} />
        <Route path="EditAppointment" element={<EditAppointment />} />
        <Route path="HistoriqueVitaux" element={<HistoriqueParamsVitaux />} />
      </Route>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {dashboardRoute}
        <Route path="/Register" element={<Register />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/approvalMessage" element={<ApprovalMessage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
