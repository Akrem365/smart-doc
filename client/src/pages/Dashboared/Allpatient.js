import React, { useEffect, useState } from "react";
import { SearchContainer, PatientsContainer } from "../../components";
import io from "socket.io-client";

// const socket = io("http://192.168.1.2:5000");
// socket.on("connect", () => {
//   console.log("Connected to server");
// });
function Allpatient({ refreshPatients, setRefreshPatients }) {
  // useEffect(() => {
  //   console.log("useEffect is called");

  //   socket.addEventListener("notification", (data) => {
  //     console.log("Notification received:", data);
  //     alert(
  //       `Message: ${data.message}\nPatient Name: ${data.patientName}\nPatient Last Name: ${data.patientLastName}\nHealth Status: ${data.healthStatus}`
  //     );
  //     console.log("notification succes");
  //   });

  //   return () => {
  //     socket.off("notification");
  //   };
  // }, []);

  // Console de journalisation pour vérifier si le composant est rendu
  console.log("Allpatient component is rendered");

  return (
    <>
      <SearchContainer />
      <PatientsContainer
        refreshPatients={refreshPatients}
        setRefreshPatients={setRefreshPatients}
      />
    </>
  );
}

export default Allpatient;
