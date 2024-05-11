import { StatusCodes } from "http-status-codes";
import RendezVous from "../models/RendezVous.js";
import Patients from "../models/Patients.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const deleteRendezvousByPatientId = async (req, res) => {
  const { patientId } = req.params;
  const rv = await RendezVous.findOne({
    patient: patientId,
  });
  if (!rv) {
    throw new NotFoundError(
      `No rendez vous  found for patient with id ${patientId}`
    );
  }
  await RendezVous.deleteOne({ patient: patientId });
  res
    .status(StatusCodes.OK)
    .json({ message: "Rendezvous deleted successfully" });
};
const getAllRendezVous = async (req, res) => {
  const rv = await RendezVous.find().populate("patient");
  if (rv === 0) {
    res.status(StatusCodes.OK).json({ message: "No Rendez vous found" });
    return;
  }
  res.status(StatusCodes.OK).json(rv);
};
const createRendezVous = async (req, res) => {
  const { date, time, type, notes, name, lastName, age } = req.body;
  const { patientId } = req.params;
  if (!date || !time) {
    throw new BadRequestError("Please provide all values");
  }
  const patient = await Patients.findOne({ patient: patientId });
  if (!patient) {
    throw new NotFoundError(`No patient found with id ${patientId}`);
  }
  req.body.patient = patient._id;
  req.body.createdBy = req.user.userId;
  const rv = await RendezVous.create({
    ...req.body,
    createdBy: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ rv });
};
export { deleteRendezvousByPatientId, getAllRendezVous, createRendezVous };
