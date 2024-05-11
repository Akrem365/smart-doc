import express, { Router } from "express";
import authenticateUser from "../middleware/Auth.js";
const router = express.Router();
import {
  createPatient,
  deletePatient,
  getAllPatient,
  updatePatient,
  showStats,
  getAllPatientID,
} from "../controller/PatientController.js";

router.route("/").post(createPatient).get(getAllPatient);
router.route("/stats").get(showStats);
router.route("/:id").delete(deletePatient).patch(updatePatient);
router.route("/PatientsID").get(getAllPatientID);

export default router;
