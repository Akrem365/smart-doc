import express from "express";
import Auth from "../middleware/Auth.js";
const router = express.Router();
import {
  GetHistoriqueByPatientId,
  GetHistorique,
} from "../controller/historiqueController.js";
router.route("/all").get(GetHistorique);
router.route("/:patientID").get(GetHistoriqueByPatientId);

export default router;
