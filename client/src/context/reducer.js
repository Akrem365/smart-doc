import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCES,
  REGISTER_USER_ERROR,
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
  CREATE_PATIENT_ERROR,
  CREATE_PATIENT_SUCCES,
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
import { initialState } from "./appContext";
const reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: "Please provide all values",
    };
  }
  if (action.type === DISPLAY_ALERT_APPOINTMENT) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: "",
      alertType: "",
      alertText: "",
    };
  }

  if (action.type === REGISTER_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === REGISTER_USER_SUCCES) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      PatientLocation: action.payload.location,
      userLocation: action.payload.location,
      showAlert: true,
      alertType: "succes",
      alertText: "User Created! Redirecting...",
    };
  }
  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === LOGIN_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === LOGIN_USER_SUCCES) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      PatientLocation: action.payload.location,
      userLocation: action.payload.location,
      role: action.payload.role,
      showAlert: true,
      alertType: "succes",
      alertText: "Login Successful! Redirecting...",
      approvedLogin: action.payload.approved,
    };
  }
  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      token: null,
      PatientLocation: "",
      userLocation: "",
    };
  }

  if (action.type === UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      PatientLocation: action.payload.location,
      userLocation: action.payload.location,
      showAlert: true,
      alertType: "succes",
      alertText: "User Profile Updated!",
    };
  }
  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      [action.payload.name]: action.payload.value,
    };
  }
  if (action.type === CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editPatientId: "",
      name: "",
      lastName: "",
      age: "",
      genre: "Masculin",
      antecedent: "HTA",
      phoneNumber: "",
    };
    return {
      ...state,
      ...initialState,
    };
  }
  if (action.type === CREATE_PATIENT_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === CREATE_PATIENT_SUCCES) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "New Patient Created!",
    };
  }
  if (action.type === CREATE_PATIENT_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === GET_PATIENTS_BEGIN) {
    return {
      ...state,
      showAlert: false,
      isLoading: true,
    };
  }
  if (action.type === GET_PATIENTS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      patients: action.payload.patients,
      totalPatients: action.payload.totalPatients,
      numOfPages: action.payload.numOfPages,
      genderCounts: action.payload.genderCounts,
      vitaux: action.payload.vitaux,
    };
  }
  if (action.type === SET_EDIT_PATIENT) {
    const patient = state.patients.find((pat) => pat._id === action.payload.id);

    const { _id, name, lastName, age, genre, antecedent, phoneNumber } =
      patient;
    return {
      ...state,
      isEditing: true,
      editPatientId: _id,
      name,
      lastName,
      age,
      genre,
      antecedent,
      phoneNumber,
    };
  }
  if (action.type === DELETE_PATIENT_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === EDIT_PATIENT_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === EDIT_PATIENT_SUCCES) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Patient Updated!",
    };
  }
  if (action.type === EDIT_PATIENT_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }
  if (action.type === VIEW_PARAMS_PATIENT) {
    const patient = state.patients.find((pat) => pat._id === action.payload.id);
    // if (patient) {
    //   console.log("patient existe");
    // }
    const params = Array.isArray(state.vitaux)
      ? state.vitaux.find((param) => param.patient._id === action.payload.id)
      : null;

    const { _id, name, lastName, age, genre, antecedent } = patient;
    const vitaux = params ? params : null;

    return {
      ...state,
      // isEditing: true,
      editPatientId: _id,
      name,
      lastName,
      age,
      genre,
      antecedent,
      vitaux: vitaux,
    };
  }
  if (action.type === GET_ALLSTATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      totalPatients: action.payload.totalPatients,
      genderCounts: action.payload.genderCounts,
      ageCounts: action.payload.ageCounts,
      atcdCounts: action.payload.atcdCounts,
    };
  }
  if (action.type === CLEAR_APPOINTMENT_VALUES) {
    const initialState = {
      isEditing: false,
      editPatientId: "",
      name: "",
      lastName: "",
      age: "",
      date: "",
      time: "",
      type: state.defaultAppointment,
      note: "",
      phoneNumber: "",
      bed: "",
      department: "house",
    };
    return {
      ...state,
      ...initialState,
    };
  }
  if (action.type === SEND_TO_APPOINTMENT) {
    const patient = state.patients.find((pat) => pat._id === action.payload.id);

    const { _id, name, lastName, age, phoneNumber } = patient;
    return {
      ...state,
      AppontmentPatientId: _id,
      name,
      lastName,
      age,
      phoneNumber,
    };
  }
  if (action.type === ADD_APPOINTMENT_SUCCES) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Appointment Created!",
    };
  }
  if (action.type === GET_APPOINTMENTS_SUCCESS) {
    return {
      ...state,
      appointment: action.payload,
    };
  }
  if (action.type === GET_NOT_APPROVMENT_USER_SUCCES) {
    return {
      ...state,
      notApproved: action.payload,
    };
  }
  if (action.type === UPDATE_APPROVMENT) {
    return {
      ...state,
      approvedYesNo: false,
    };
  }
  if (action.type === UPDATE_APPROVMENT_FALSE) {
    return {
      ...state,
      approvedYesNo: false,
    };
  }
  if (action.type === UPDATE_PARAMS_VITAUX) {
    return {
      ...state,
      isLoading: false,
      vitaux: action.payload.vitaux,
    };
  }
  if (action.type === FILE_PARAMS_VITAUX) {
    return {
      ...state,
      historiqueMesuresByPatId: action.payload.data2,
      // FileJson: action.payload.data,
    };
  }
  if (action.type === GET_APPOINTMENTS_PATINETID_SUCCESS) {
    return {
      ...state,
      appointmentPatientID: action.payload,
    };
  }
  if (action.type === GET_APPONTMENT_UPDATE) {
    const rv = state.appointmentPatientID.find(
      (pat) => pat._id === action.payload.id
    );

    const {
      _id,
      name,
      lastName,
      age,
      phoneNumber,
      date,
      type,
      bed,
      department,
      notes,
    } = rv;
    return {
      ...state,
      type,
      bed,
      department,
      notes,

      AppontmentPatientId: _id,
      name,
      lastName,
      age,
      phoneNumber,
      date,
    };
  }
  if (action.type === EDIT_APPOINTMENT_SUCCES) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Appointment Success!",
    };
  }
  if (action.type === GET_APPOINTMENT_SUCCESS) {
    return {
      ...state,
      isLoading: false,
    };
  }

  throw new Error(`No such action :${action.type}`);
};
export default reducer;
