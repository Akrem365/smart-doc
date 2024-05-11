import { StatusCodes } from "http-status-codes";
import RendezVous from "../models/RendezVous.js";
import Patients from "../models/Patients.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import twilio from "twilio";
import { twilioConfig } from "../utils/twliwo.js";
const { accountSid, authToken, twilioPhoneNumber } = twilioConfig;
const client = twilio(accountSid, authToken);

function sendSMS(to, message) {
  client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    })
    .then((message) => console.log(`SMS sent with ID: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error.message}`));
}

const deleteRendezvousByPatientId = async (req, res) => {
  //hedhi delete rendezVous bel id mta3 rendezVous (esm function ghalet)
  const { rendezvousId } = req.params;
  const rv = await RendezVous.findById(rendezvousId);
  if (!rv) {
    throw new NotFoundError(
      `No rendez vous  found for patient with id ${rendezvousId}`
    );
  }
  await RendezVous.deleteOne({ _id: rendezvousId });
  res
    .status(StatusCodes.OK)
    .json({ message: "Rendezvous deleted successfully" });
};
const deleteRendezVousIDTrue = async (req, res) => {
  //delete RendezVous bel id patient
  const { patientId } = req.params;
  const rv = await RendezVous.find({
    patient: patientId,
  });
  if (rv.length === 0 || !rv) {
    console.log(`No rendez vous found for patient with id ${patientId}`);
  }

  await RendezVous.deleteMany({ patient: patientId });
  res.status(StatusCodes.OK).json({ rv });
};
const UpdateRendezVousByPatientId = async (req, res) => {
  const {
    date,
    type,
    notes,
    name,
    lastName,
    age,
    bed,
    department,
    phoneNumber,
  } = req.body;
  const { rendezvousId } = req.params;

  try {
    const rv = await RendezVous.findOneAndUpdate(
      { _id: rendezvousId },
      req.body,
      { new: true }
    );

    if (!rv) {
      throw new NotFoundError(`No rendez vous found with id ${rendezvousId}`);
    }

    res.status(StatusCodes.OK).json(rv);
  } catch (error) {
    console.error("Error updating rendezvous:", error);
  }
};
const getAllRendezVous = async (req, res) => {
  const rv = await RendezVous.find({ createdBy: req.user.userId }).populate(
    "patient"
  );
  if (rv.length === 0) {
    res.status(StatusCodes.OK).json({ message: "No Rendez vous found" });
    return;
  }
  res.status(StatusCodes.OK).json(rv);
};
const getRendezVousById = async (req, res) => {
  const { patientId } = req.params;
  const rv = await RendezVous.find({ patient: patientId });
  if (!rv) {
    throw new NotFoundError(
      `No rendez vous  found for patient with id ${patientId}`
    );
  }
  res.status(StatusCodes.OK).json(rv);
};
const createRendezVous = async (req, res) => {
  const {
    date,

    type,
    notes,
    name,
    lastName,
    age,
    bed,
    department,
    phoneNumber,
  } = req.body;
  const { patientId } = req.params;
  if (!date) {
    throw new BadRequestError("Please provide all values");
  }
  // const patient = await Patients.findOne({ patient: patientId });
  // if (!patient) {
  //   throw new NotFoundError(`No patient found with id ${patientId}`);
  // }
  req.body.patient = patientId;
  req.body.createdBy = req.user.userId;

  const rv = await RendezVous.create({
    ...req.body,
    createdBy: req.user.userId,
  });
  const dateTime = new Date(date);
  const day = dateTime.getDate();
  const month = dateTime.getMonth() + 1;
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  // sendSMS(
  //   `+216${phoneNumber}`,
  //   `Cher ${name} ${lastName},
  //  Nous vous confirmons votre rendez-vous. Merci de vous présenter le ${day}/${month}/${year} à ${time}.`
  // );
  console.log(
    `+216${phoneNumber} Cher ${name} ${lastName}.
veuillez vous connecter le ${day}/${month}/${year}  à ${hours}:${minutes}  pour effectuer les mesures des contrôles.
En cas d'empechement ou non disponibilités veuillez nous contacter pour fixer un autre rendez-vous.`
  );

  res.status(StatusCodes.CREATED).json({ rv });
};
export {
  deleteRendezvousByPatientId,
  getAllRendezVous,
  createRendezVous,
  getRendezVousById,
  UpdateRendezVousByPatientId,
  deleteRendezVousIDTrue,
};
