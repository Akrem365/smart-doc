import React from "react";

function Historique({ actionHistory }) {
  return (
    <div className="action-history">
      <h2>Action History</h2>
      <ul>
        {actionHistory.map((action, index) => (
          <li key={index}>
            {action.userId} - {action.approved ? "Approved" : "Not Approved"} -{" "}
            {action.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Historique;
