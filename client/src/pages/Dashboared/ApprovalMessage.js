import React from "react";

const approvalMessageStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh", // Assure que le contenu occupe toute la hauteur de la vue
};
function ApprovalMessage() {
  return (
    <div style={approvalMessageStyle}>
      <h1>Your account is awaiting administrator approval.</h1>
      <p>Please wait before you can log in.</p>
    </div>
  );
}

export default ApprovalMessage;
