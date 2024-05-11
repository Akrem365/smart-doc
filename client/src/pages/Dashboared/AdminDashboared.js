import React, { useEffect, useState } from "react";
import { useAppcontext } from "../../context/appContext";
import { format } from "date-fns";

function AdminDashboard() {
  const {
    notApproved,
    getAllUserNotApproved,
    updateUserApproval,
    DeleteUserApprovalFalse,
  } = useAppcontext();
  const [loading, setLoading] = useState(true);
  const [actionHistory, setActionHistory] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("actionHistory");
    if (storedHistory) {
      setActionHistory(JSON.parse(storedHistory));
    }

    const fetchData = async () => {
      await getAllUserNotApproved();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChangeApprovment = async (userId) => {
    try {
      await updateUserApproval(userId, true);
      await getAllUserNotApproved();
      updateActionHistory(userId, true);
    } catch (error) {
      console.log("Error updating approval:", error);
    }
  };

  const handleChangeApprovmentNo = async (userId) => {
    try {
      await DeleteUserApprovalFalse(userId);
      await getAllUserNotApproved();
      updateActionHistory(userId, false);
    } catch (error) {
      console.log("Error updating approval:", error);
    }
  };

  const updateActionHistory = (userId, approved) => {
    const user = notApproved.notApproved.find((user) => user._id === userId);
    if (!user) return;

    const action = {
      registrationNumber: user.registrationNumber,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      approved,
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [...actionHistory, action];
    setActionHistory(updatedHistory);
    localStorage.setItem("actionHistory", JSON.stringify(updatedHistory));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="attendance">
      <div className="attendance-list">
        <h1>User List</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Registration Number</th>
              <th>Role</th>
              <th>Approvement</th>
            </tr>
          </thead>
          <tbody>
            {notApproved.notApproved.length === 0 ? (
              <tr>
                <td colSpan="7">No users yet...</td>
              </tr>
            ) : (
              notApproved.notApproved.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.location}</td>
                  <td>{user.registrationNumber}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleChangeApprovment(user._id)}>
                      YES
                    </button>
                    <button onClick={() => handleChangeApprovmentNo(user._id)}>
                      NO
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="action-history">
        <h2>Action History</h2>
        <ul>
          {actionHistory.map((action, index) => (
            <li key={index}>
              {action.name} {action.lastName} ({action.registrationNumber}) -{" "}
              {action.role} - {action.approved ? "Approved" : "Not Approved"} -{" "}
              {format(new Date(action.timestamp), "dd/MM/yyyy hh:mm:ss a")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AdminDashboard;
