import { StatusCodes } from "http-status-codes";
import Patients from "../models/Patients.js";

import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import CheckPermission from "../utils/CheckPermission.js";
import ParamsVitaux from "../models/ParamsVitaux.js";
import fs from "fs";
import path from "path";
import os from "os"; // Importer os directement
const createPatient = async (req, res) => {
  console.log("Request Body:", req.body);

  const { name, lastName, age, bed, phoneNumber } = req.body;
  req.body.healthStatus = "Good";
  if (!name || !lastName || !age || !phoneNumber) {
    throw new BadRequestError("Please provide all values");
  }

  console.log("Creating patient...");
  req.body.createdBy = req.user.userId;
  const patient = await Patients.create(req.body);
  console.log("Patient created:", patient);

  const paramsVitaux = {
    patient: patient._id,
    fileName: patient._id.toString(),
    temperature: 0,
    tensionArterielle: {
      systolique: 0,
      diastolique: 0,
    },
    saturationOxygene: 0,
    glycemie: 0,
    frequenceRespiratoire: 0,
    frequenceCardiaque: 0,
    ecg: [],
  };
  console.log("Patient ID for file name:", paramsVitaux.fileName);
  try {
    await ParamsVitaux.create(paramsVitaux);
    console.log("ParamsVitaux created successfully");
  } catch (error) {
    console.error("Error creating ParamsVitaux:", error);
    // Gérer l'erreur comme vous le souhaitez, par exemple, envoyer une réponse d'erreur au client
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
  //fihcier json
  const patientData = {
    patient: patient._id,
    temperature: 0,
    tensionArterielle: {
      systolique: 0,
      diastolique: 0,
    },
    saturationOxygene: 0,
    glycemie: 0,
    frequenceRespiratoire: 0,
    frequenceCardiaque: 0,
    ecg: [],
    createdAt: new Date().toISOString(),
  };

  const desktopPath = "C:\\Users\\Akrem\\Desktop\\parametresVitaux";
  const desktopPath2 = "C:\\Users\\Akrem\\Desktop\\Update";
  const filePath2 = path.join(desktopPath2, `${patient._id}.json`);
  const filePath = path.join(desktopPath, `${patient._id}.json`);

  fs.writeFile(filePath2, JSON.stringify(patientData, null, 2), (err) => {
    if (err) {
      console.error("Error writing update file:", err);
    } else {
      console.log("update file created successfully:", filePath2);
    }
  });

  fs.writeFile(filePath, JSON.stringify(patientData, null, 2), (err) => {
    if (err) {
      console.error("Error writing patient file:", err);
    } else {
      console.log("Patient file created successfully:", filePath);
    }
  });
  res.status(StatusCodes.CREATED).json({ patient });
};

const getAllPatient = async (req, res) => {
  const patients = await Patients.find({ createdBy: req.user.userId });

  let genderCounts = {
    Masculin: 0,
    Feminin: 0,
  };

  // Initialisation des niveaux d'âge
  let ageCounts = {
    "0-10": 0,
    "11-20": 0,
    "21-30": 0,
    "31-40": 0,
    "41-50": 0,
    "51-60": 0,
    "61-70": 0,
    "71-80": 0,
    "81-90": 0,
    "91-100": 0,
  };

  let atcdCounts = {
    HTA: 0,
    Diabete: 0,
    Dyslipidemie: 0,
    SyndromeCoronarien: 0,
    InsuffisanceCardiaque: 0,
    AVC: 0,
    Autre: 0,
  };

  patients.forEach((patient) => {
    // Compter le genre
    if (patient.genre === "Masculin") {
      genderCounts.Masculin++;
    } else if (patient.genre === "Feminin") {
      genderCounts.Feminin++;
    }

    // Compter l'âge
    if (patient.age > 0 && patient.age <= 10) {
      ageCounts["0-10"]++;
    } else if (patient.age > 10 && patient.age <= 20) {
      ageCounts["11-20"]++;
    } else if (patient.age > 20 && patient.age <= 30) {
      ageCounts["21-30"]++;
    } else if (patient.age > 30 && patient.age <= 40) {
      ageCounts["31-40"]++;
    } else if (patient.age > 40 && patient.age <= 50) {
      ageCounts["41-50"]++;
    } else if (patient.age > 50 && patient.age <= 60) {
      ageCounts["51-60"]++;
    } else if (patient.age > 60 && patient.age <= 70) {
      ageCounts["61-70"]++;
    } else if (patient.age > 70 && patient.age <= 80) {
      ageCounts["71-80"]++;
    } else if (patient.age > 80 && patient.age <= 90) {
      ageCounts["81-90"]++;
    } else if (patient.age > 90 && patient.age <= 100) {
      ageCounts["91-100"]++;
    }

    // Compter les antécédents médicaux
    switch (patient.antecedent) {
      case "HTA":
        atcdCounts.HTA++;
        break;
      case "Diabete":
        atcdCounts.Diabete++;
        break;
      case "dyslipidemie":
        atcdCounts.Dyslipidemie++;
        break;
      case "syndrome coronarien":
        atcdCounts.SyndromeCoronarien++;
        break;
      case "insuffisance cardiaque":
        atcdCounts.InsuffisanceCardiaque++;
        break;
      case "AVC":
        atcdCounts.AVC++;
        break;
      case "autre":
        atcdCounts.Autre++;
        break;
      default:
        break;
    }
  });

  res.status(StatusCodes.OK).json({
    patients,
    totalPatients: patients.length,
    numOfPages: 1,
    genderCounts,
    ageCounts,
    atcdCounts,
  });
};

const updatePatient = async (req, res) => {
  const { id: patientId } = req.params;
  const { name, lastName, age } = req.body;
  if (!name || !lastName || !age) {
    throw new BadRequestError("Please provide all values");
  }
  const patient = await Patients.findOne({ _id: patientId });
  if (!patient) {
    throw new NotFoundError(`No job with id:${patientId}`);
  }
  // check permission

  CheckPermission(req.user, patient.createdBy);
  const updatePatient = await Patients.findOneAndUpdate(
    { _id: patientId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json(updatePatient);
};

const deletePatient = async (req, res) => {
  const { id: patientId } = req.params;

  const patient = await Patients.findOne({ _id: patientId });

  if (!patient) {
    throw new NotFoundError(`No patient with id ${patientId}`);
  }

  // Convert patient to Mongoose document
  const patientDoc = patient.toObject();

  // Check permission
  CheckPermission(req.user, patientDoc.createdBy);

  // Remove the patient document
  await Patients.deleteOne({ _id: patientId });

  await res.status(StatusCodes.OK).json({ msg: "Success! Patient removed" });
};
const getAllPatientID = async (req, res) => {
  try {
    const patients = await Patients.find({}, "_id");
    const response = {};
    patients.forEach((patient, index) => {
      response[`patient${index + 1}`] = patient._id;
    });
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error get id:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};

const showStats = async (req, res) => {
  res.send("show stats ");
};

export {
  createPatient,
  deletePatient,
  getAllPatient,
  updatePatient,
  showStats,
  getAllPatientID,
};
