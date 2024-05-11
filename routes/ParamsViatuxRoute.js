import express from "express";
const router = express.Router();
import {
  DeleteParmasVitauxByPatientId,
  getParamsVitauxAllPatinets,
  updateParamsViatux,
  getParamsVitauxByPatinetID,
  getParamsViatuxByPatientIdFileJson,
  GetDataFromCarte,
} from "../controller/ParamsVitauxController.js";

router.route("/all").get(getParamsVitauxAllPatinets);
router.route("/:patientId").delete(DeleteParmasVitauxByPatientId);
router.route("/:patientId").patch(updateParamsViatux);
router.route("/:patientId").get(getParamsVitauxByPatinetID);
router.route("/Historique/:patientId").get(getParamsViatuxByPatientIdFileJson);
router.route("/Data").post(GetDataFromCarte);

export default router;
