import express from "express";
import authenticateUser from "../middleware/Auth.js";
const router = express.Router();
import {
  deleteRendezvousByPatientId,
  getAllRendezVous,
  createRendezVous,
  getRendezVousById,
  UpdateRendezVousByPatientId,
  deleteRendezVousIDTrue,
} from "../controller/RendezVousController.js";

router
  .route("/:rendezvousId")
  .delete(authenticateUser, deleteRendezvousByPatientId)
  .put(authenticateUser, UpdateRendezVousByPatientId);
router.route("/:patientId").post(authenticateUser, createRendezVous);
router
  .route("/patients/:patientId")
  .delete(authenticateUser, deleteRendezVousIDTrue);
router.route("/all").get(authenticateUser, getAllRendezVous);
router.route("/:patientId").get(authenticateUser, getRendezVousById);

export default router;
