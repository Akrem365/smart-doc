import React, { useContext, useReducer } from "react";
import reducer from "./reducer";
import axios from "axios";

import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCES,
  LOGIN_USER_BEGIN,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCES,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_PATIENT_BEGIN,
  CREATE_PATIENT_SUCCES,
  CREATE_PATIENT_ERROR,
  GET_PATIENTS_BEGIN,
  GET_PATIENTS_SUCCESS,
  SET_EDIT_PATIENT,
  DELETE_PATIENT_BEGIN,
  EDIT_PATIENT_BEGIN,
  EDIT_PATIENT_SUCCES,
  EDIT_PATIENT_ERROR,
  VIEW_PARAMS_PATIENT,
  GET_ALLSTATS_SUCCESS,
  CLEAR_APPOINTMENT_VALUES,
  DISPLAY_ALERT_APPOINTMENT,
  SEND_TO_APPOINTMENT,
  ADD_APPOINTMENT_SUCCES,
  GET_APPOINTMENTS_SUCCESS,
  GET_NOT_APPROVMENT_USER_SUCCES,
  UPDATE_APPROVMENT,
  UPDATE_APPROVMENT_FALSE,
  UPDATE_PARAMS_VITAUX,
  FILE_PARAMS_VITAUX,
  GET_APPOINTMENTS_PATINETID_SUCCESS,
  GET_APPONTMENT_UPDATE,
  EDIT_APPOINTMENT_SUCCES,
  GET_APPOINTMENT_SUCCESS,
  CLEAR_VALUES_APPOINTMENT,
} from "./action";
const token = localStorage.getItem("token");
// const user = localStorage.getItem("user");
const user = null;
const userlocation = localStorage.getItem("location");
const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  showSidebar: false,
  // user: user ? JSON.parse(user) : null,
  user: user,
  token: token,
  userLocation: userlocation || "",
  PatientLocation: userlocation || "",
  isEditing: false,
  editPatientId: "",
  name: "",
  lastName: "",
  age: "",
  phoneNumber: "",
  genreOptions: ["Masculin", "Feminin"],
  genre: "Masculin",
  antecedentOptions: [
    "HTA",
    "Diabete",
    "dyslipidemie",
    "syndrome coronarien",
    "insuffisance cardiaque",
    "AVC",
    "autre",
  ],
  antecedent: "HTA",
  genderCounts: {
    Masculin: 0,
    Feminin: 0,
  },
  ageCounts: {},
  atcdCounts: {
    HTA: 0,
    Diabete: 0,
    dyslipidemie: 0,
    syndromeCoronarien: 0,
    insuffisanceCardiaque: 0,
    AVC: 0,
    autre: 0,
  },

  patients: [],
  totalPatients: 0,
  numOfPages: 1,
  page: 1,
  vitaux: [],
  appointment: [],

  date: "",

  typeOptions: ["Consultation", "Traitement", "Suivi", "Autre"],
  type: "Suivi",
  notes: "",
  AppontmentPatientId: "",
  role: "",
  notApproved: [],
  approvedYesNo: "",
  approvedLogin: "",
  bed: 0,
  department: "house",
  departmentOptions: ["house", "hospital", "clinic", "office"],
  // FileJson: [],
  appointmentPatientID: [],
  isEditing2: false,
  historiqueMesuresByPatId: [],
};

const AppContext = React.createContext();
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  //Axios
  const authFetch = axios.create({
    baseURL: "https:/smart-doc-2.onrender.com/api/v1",
    // headers: {
    //   Authorization: `Bearer ${state.token}`,
    // },
  });
  // response interceptor
  authFetch.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // response
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // console.log(error.response);
      if (error.response.status === 401) {
        console.log("AUTH ERROR");
      }
      return Promise.reject(error);
    }
  );

  function displayAlert() {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("location");
  };
  const RegisterUSer = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/register", currentUser);
      // console.log(response);
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCES,
        payload: { user, token, location },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      // console.log(error.response);
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post("/api/v1/auth/login", currentUser);

      const { user, token, location } = data;
      const role = data.user.role;
      const approved = data.user.isApproved;
      console.log("----------------------------------");
      console.log(role);

      console.log(approved);
      dispatch({
        type: LOGIN_USER_SUCCES,
        payload: { user, token, location, role, approved },
      });
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const ToggleSideBar = () => {
    console.log("Toggle sidebar called");
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const LogoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);
      const { user, location, token } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      });
      addUserToLocalStorage({ user, location, token });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };
  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
    console.log(`${name} and  ${value}`);
  };
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };
  const createPatient = async () => {
    dispatch({ type: CREATE_PATIENT_BEGIN });

    try {
      const {
        name,
        lastName,
        genre,
        antecedent,
        age,
        bed,
        department,
        phoneNumber,
      } = state;
      await authFetch.post("/jobs", {
        name,
        lastName,
        genre,
        antecedent,
        age,
        bed,
        department,
        phoneNumber,
      });
      dispatch({ type: CREATE_PATIENT_SUCCES });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_PATIENT_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const getPatients = async () => {
    let url = `/jobs`;
    let url2 = `/paramsVitaux/all`;

    dispatch({ type: GET_PATIENTS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const response = await authFetch(url2);
      const data2 = response.data;
      // if (!data2) {
      //   console.log("no data for data2");
      // }
      // if (data2) {
      //   console.log("data2 existe");
      //   console.log(data2);
      // }

      const { patients, totalPatients, numOfPages, genderCounts } = data;

      console.log(`le vitaux est :${data2}`);

      console.log(data);
      console.log("-----------------------------");

      dispatch({
        type: GET_PATIENTS_SUCCESS,
        payload: {
          patients,
          totalPatients,
          numOfPages,
          genderCounts,
          vitaux: data2,
        },
      });
    } catch (error) {
      console.log(error.response);
      // LogoutUser();
    }
    clearAlert();
  };

  const setEditPatient = (id) => {
    console.log(`set edit patient :${id}`);
    dispatch({ type: SET_EDIT_PATIENT, payload: { id } });
  };
  const editPatient = async () => {
    dispatch({ type: EDIT_PATIENT_BEGIN });
    try {
      await authFetch.patch(`/jobs/${state.editPatientId}`, {
        name: state.name,
        lastName: state.lastName,
        genre: state.genre,
        antecedent: state.antecedent,
        age: state.age,
        bed: state.bed,
        department: state.department,
      });
      dispatch({ type: EDIT_PATIENT_SUCCES });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_PATIENT_ERROR,
        payload: { msg: error.response.data.msg },
      });
      clearAlert();
    }
  };

  const deletePatient = async (id) => {
    dispatch({ type: DELETE_PATIENT_BEGIN });
    try {
      await authFetch.delete(`/jobs/${id}`);
      await authFetch.delete(`/paramsVitaux/${id}`);
      await authFetch.delete(`/rendezVous//patients/${id}`);
      getPatients();
    } catch (error) {
      console.log(error.response);
      // LogoutUser();
    }
  };
  const viewStatsPatinet = async (id) => {
    console.log(`view stats :${id} `);
    dispatch({ type: VIEW_PARAMS_PATIENT, payload: { id } });
  };

  const getAllPatientStats = async () => {
    let url = `/jobs`;
    dispatch({ type: GET_PATIENTS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { totalPatients, genderCounts, ageCounts, atcdCounts } = data;
      console.log("-----------------------------");
      console.log(data);

      dispatch({
        type: GET_ALLSTATS_SUCCESS,
        payload: {
          totalPatients,
          genderCounts,
          ageCounts,
          atcdCounts,
        },
      });
    } catch (error) {
      console.log(error.response);
      LogoutUser();
    }
    clearAlert();
  };
  const clearValuesAppointment = () => {
    dispatch({ type: CLEAR_APPOINTMENT_VALUES });
  };
  function displayAlertAppointment() {
    dispatch({ type: DISPLAY_ALERT_APPOINTMENT });
    clearAlert();
  }

  const sendIdToAppointment = async (id) => {
    console.log(`Send to appoitnment id :${id}`);
    dispatch({ type: SEND_TO_APPOINTMENT, payload: { id } });
  };
  const createRendezVous = async (id) => {
    try {
      const {
        name,
        lastName,
        age,

        date,

        type,
        notes,
        bed,
        department,
        phoneNumber,
      } = state;
      await authFetch.post(`/rendezVous/${id}`, {
        name,
        lastName,
        age,
        patientId: id,
        date,

        type,
        notes,
        bed,
        department,
        phoneNumber,
      });
      dispatch({ type: ADD_APPOINTMENT_SUCCES });
      dispatch({ type: CLEAR_APPOINTMENT_VALUES });
    } catch (error) {
      console.log(error.response);
    }
  };
  const getAppointments = async () => {
    let url = `/rendezVous/all`;
    try {
      const { data } = await authFetch(url);
      dispatch({ type: GET_APPOINTMENTS_SUCCESS, payload: data });
    } catch (error) {
      console.log(error.response);
    }
  };
  const getAppointmentsByPatientId = async (id) => {
    dispatch({ type: GET_PATIENTS_BEGIN });
    let url = `/rendezVous/${id}`;
    try {
      const { data } = await authFetch(url);
      console.log(data);
      dispatch({ type: GET_APPOINTMENTS_PATINETID_SUCCESS, payload: data });
      dispatch({ type: GET_APPOINTMENT_SUCCESS });
    } catch (error) {
      console.log(error.response);
    }
  };
  const getAllUserNotApproved = async () => {
    let url = `/auth/notApproved`;

    try {
      const { data } = await authFetch(url);

      dispatch({ type: GET_NOT_APPROVMENT_USER_SUCCES, payload: data });
    } catch (error) {
      console.log(error.response);
    }
  };
  const updateUserApproval = async (id, isApproved) => {
    authFetch.put(`/auth/user/${id}/approve`, { isApproved });
    try {
      dispatch({ type: UPDATE_APPROVMENT });
    } catch (error) {
      console.log(error.response);
    }
  };
  const DeleteUserApprovalFalse = async (id) => {
    try {
      authFetch.delete(`/auth/delete/${id}`);
    } catch (error) {
      console.log(error.response);
    }
  };
  const DeleteAppointmnetById = async (id) => {
    try {
      await authFetch.delete(`/rendezVous/${id}`);
      await getAppointmentsByPatientId(id);
    } catch (error) {
      console.log(error.response);
    }
  };
  const getParamsVitauxByPatinetID = async (id) => {
    try {
      const response = await authFetch.get(`/paramsVitaux/${id}`);
      const data = response.data;
      return data;
      // console.log("new data ", data);
    } catch (error) {
      console.log(error.response);
    }
  };
  const updateParamsViatux = async (id) => {
    try {
      await authFetch.patch(`/paramsVitaux/${id}`);
    } catch (error) {
      console.log(error.response);
    }
  };
  const getParamsViatuxByPatientIdFileJson = async (id) => {
    try {
      // const response = await authFetch.get(`/paramsVitaux/Historique/${id}`);
      // const data = response.data;
      const response2 = await authFetch.get(`/historique/${id}`);
      const data2 = response2.data;
      dispatch({
        type: FILE_PARAMS_VITAUX,
        payload: {
          // data,
          data2,
        },
      });
      // console.log("Historique -----");
      // console.log(data2);
    } catch (error) {
      console.log(error.response);
    }
  };
  const setEditAppointment = async (id) => {
    console.log(`Send to appoitnment id :${id}`);
    dispatch({ type: GET_APPONTMENT_UPDATE, payload: { id } });
  };
  const EditAppointment = async () => {
    dispatch({ type: EDIT_PATIENT_BEGIN });
    try {
      await authFetch.put(`/rendezVous/${state.AppontmentPatientId}`, {
        name: state.name,
        lastName: state.lastName,
        age: state.age,
        date: state.date,
        type: state.type,
        notes: state.notes,
        bed: state.bed,
        department: state.department,
        phoneNumber: state.phoneNumber,
      });
      dispatch({ type: EDIT_APPOINTMENT_SUCCES });
      dispatch({ type: CLEAR_APPOINTMENT_VALUES });
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        RegisterUSer,
        loginUser,
        ToggleSideBar,
        LogoutUser,
        updateUser,
        handleChange,
        clearValues,
        createPatient,
        getPatients,
        setEditPatient,
        deletePatient,
        viewStatsPatinet,
        editPatient,
        getAllPatientStats,
        getAppointments,
        clearValuesAppointment,
        displayAlertAppointment,
        sendIdToAppointment,
        createRendezVous,
        getAllUserNotApproved,
        updateUserApproval,
        DeleteUserApprovalFalse,
        DeleteAppointmnetById,
        updateParamsViatux,
        getParamsVitauxByPatinetID,
        getParamsViatuxByPatientIdFileJson,
        getAppointmentsByPatientId,
        setEditAppointment,
        EditAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useAppcontext() {
  return useContext(AppContext);
}
export { AppProvider, initialState, useAppcontext };
