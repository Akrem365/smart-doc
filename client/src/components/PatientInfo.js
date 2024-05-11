import React from "react";
import Wrapper from "../assets/wrappers/JobInfo";

function PatientInfo({ icon, text }) {
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <span className="value">{text}</span>
    </Wrapper>
  );
}

export default PatientInfo;
