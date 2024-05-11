import { BadRequestError, NotFoundError } from "../errors/index.js";
import ParamsVitaux from "../models/ParamsVitaux.js";
import { StatusCodes } from "http-status-codes";
import Patients from "../models/Patients.js";
import fs, { readFileSync } from "fs";
import path from "path";
import Historique from "../models/Historique.js";
const DeleteParmasVitauxByPatientId = async (req, res) => {
  const { patientId } = req.params;

  const paramsVitaux = await ParamsVitaux.findOne({
    patient: patientId,
  });
  if (!paramsVitaux) {
    throw new NotFoundError(
      `No params Vitaux found for patient with id ${patientId}`
    );
  }
  await ParamsVitaux.deleteOne({ patient: patientId });
  res.status(StatusCodes.OK).json({ paramsVitaux });
};

const getParamsVitauxAllPatinets = async (req, res) => {
  const paramsViatux = await ParamsVitaux.find().populate("patient");
  if (paramsViatux.length === 0) {
    res.status(StatusCodes.OK).json({ message: "No params Viatux found" });
    return;
  }
  res.status(StatusCodes.OK).json(paramsViatux);
};
const getParamsVitauxByPatinetID = async (req, res) => {
  const { patientId } = req.params;

  try {
    const paramsVitaux = await ParamsVitaux.findOne({
      patient: patientId,
    }).populate("patient");

    if (!paramsVitaux) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: `No params Vitaux found for patient with id ${patientId}`,
      });
    }

    res.status(StatusCodes.OK).json(paramsVitaux);
  } catch (error) {
    console.error("Error fetching params vitaux:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
const getParamsViatuxByPatientIdFileJson = async (req, res) => {
  const { patientId } = req.params;
  const desktopPath2 = "C:\\Users\\Akrem\\Desktop\\parametresVitaux";
  const filePath2 = path.join(desktopPath2, `${patientId}.json`);
  let newData2 = [];
  try {
    newData2 = JSON.parse(fs.readFileSync(filePath2, "utf8"));
  } catch (error) {
    console.error("Error reading Params Vitaux file:", error);
  }

  res.status(StatusCodes.OK).json(newData2);
};
const detectionAnomalies = (data, patient) => {
  let anomalyDetected = false;
  if (data.temperature < 36.5 || data.temperature > 37.5) {
    anomalyDetected = true;
  }
  if (data.heartRate < 60 || data.heartRate > 100) {
    anomalyDetected = true;
  }
  if (data.glycemie < 70 || data.glycemie > 110) {
    anomalyDetected = true;
  }
  if (
    data.systolicBP < 100 ||
    data.systolicBP > 140 ||
    data.diastolicBP > 90 ||
    data.diastolicBP < 60
  ) {
    anomalyDetected = true;
  }
  if (data.respiratoryRate > 20 || data.respiratoryRate < 12) {
    anomalyDetected = true;
  }
  if (data.oxygenSaturation < 95 || data.oxygenSaturation > 100) {
    anomalyDetected = true;
  }
  if (anomalyDetected) {
    console.log(
      `une anomalie a été détectée chez patient ${patient.name} ${patient.lastName}`
    );
    patient.healthStatus = "Bad";
  }
  if (!anomalyDetected) {
    console.log(
      `Aucune anomalie détectée chez patient ${patient.name} ${patient.lastName}`
    );
    patient.healthStatus = "Good";
  }
  patient.save();
};
const updateParamsViatux = async (req, res) => {
  const { patientId } = req.params;
  const paramsVitaux = await ParamsVitaux.findOne({ patient: patientId });
  const patient = await Patients.findById(patientId);
  // const { name, lastName } = patient;

  const desktopPath = "C:\\Users\\Akrem\\Desktop\\updateEsp32";
  const filePath = path.join(desktopPath, "update.json");
  let newData = {};
  newData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  paramsVitaux.temperature = newData.temperature;
  paramsVitaux.tensionArterielle.systolique = newData.systolicBP;
  paramsVitaux.tensionArterielle.diastolique = newData.diastolicBP;
  paramsVitaux.saturationOxygene = newData.oxygenSaturation;
  paramsVitaux.glycemie = newData.bloodGlucose;
  paramsVitaux.frequenceRespiratoire = newData.respiratoryRate;
  paramsVitaux.frequenceCardiaque = newData.heartRate;
  paramsVitaux.ecg = newData.ecgData;

  await paramsVitaux.save();
  detectionAnomalies(newData, patient);
  try {
    const historiqueMesures = new Historique({
      patient: patientId,
      patient: patientId,
      temperature: newData.temperature,
      tensionArterielle: {
        systolique: newData.systolicBP,
        diastolique: newData.diastolicBP,
      },
      saturationOxygene: newData.oxygenSaturation,
      glycemie: newData.bloodGlucose,
      frequenceRespiratoire: newData.respiratoryRate,
      frequenceCardiaque: newData.heartRate,
      ecg: newData.ecgData,
    });
    await historiqueMesures.save();
  } catch (error) {
    console.log("Error saving measures to historique:", error);
  }
  const desktopPath2 = "C:\\Users\\Akrem\\Desktop\\parametresVitaux";
  const filePath2 = path.join(desktopPath2, `${patientId}.json`);
  let newData2 = [];
  try {
    newData2 = JSON.parse(fs.readFileSync(filePath2, "utf8"));
  } catch (error) {
    console.error("Error reading Params Vitaux file:", error);
  }
  if (!Array.isArray(newData2)) {
    newData2 = [];
  }
  let newDataEntry = {
    patient: patientId,
    temperature: newData.temperature,
    tensionArterielle: {
      systolique: newData.systolicBP,
      diastolique: newData.diastolicBP,
    },
    saturationOxygene: newData.oxygenSaturation,
    glycemie: newData.bloodGlucose,
    frequenceRespiratoire: newData.respiratoryRate,
    frequenceCardiaque: newData.heartRate,
    ecg: newData.ecgData,
    createdAt: new Date().toISOString(),
  };
  newData2.push(newDataEntry);
  fs.writeFileSync(filePath2, JSON.stringify(newData2, null, 2), (err) => {
    if (err) {
      console.error("Error writing Params Vitaux file:", err);
    } else {
      console.log("Params Vitaux file updated successfully", filePath);
    }
  });
  // res.status(StatusCodes.OK).json({ paramsVitaux });
  res.status(StatusCodes.OK).json(newData);
};

export {
  getParamsVitauxAllPatinets,
  DeleteParmasVitauxByPatientId,
  updateParamsViatux,
  getParamsVitauxByPatinetID,
  getParamsViatuxByPatientIdFileJson,
};
// getParmasVitauxByPatientId
