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
} from "./pages/Dashboared";
import SharedLayout from "./pages/Dashboared/sharedLayout.js";
import { useAppcontext } from "./context/appContext.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
          <Route path="all-patient" element={<AllPatient />} />
          <Route path="add-patient" element={<AddPatient />} />
          <Route path="Appointment" element={<Appointment />} />
          <Route path="AddAppointment" element={<AddAppointment />} />
        </Route>
        <Route path="/Register" element={<Register />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
