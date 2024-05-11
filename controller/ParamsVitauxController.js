import { BadRequestError, NotFoundError } from "../errors/index.js";
import ParamsVitaux from "../models/ParamsVitaux.js";
import { StatusCodes } from "http-status-codes";
import Patients from "../models/Patients.js";
import User from "../models/User.js";
import fs, { readFileSync } from "fs";
import path from "path";
import Historique from "../models/Historique.js";
import io from "../server.js";
import transporter from "../utils/nodemailer.js";
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
const detectionAnomalies = async (data, patient) => {
  const user = await User.findById(patient.createdBy);

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
    const mailOptions = {
      from: "dakrem11@gmail.com",
      // to: user.email,
      to: "smartdoctor38@gmail.com",
      subject: "Anomalie détectée chez un patient",
      text: `Cher ${user.name},\n\nUne anomalie a été détectée chez ${patient.name} ${patient.lastName}.\n\nCordialement,\nTon application`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Erreur lors de l'envoi de l'e-mail :", error);
      } else {
        console.log("E-mail envoyé avec succès :", info.response);
      }
    });
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
  console.log(user.name);
  io.emit("notification", {
    message: "Data processed for Patient!",
    patientName: patient.name,
    patientLastName: patient.lastName,
    healthStatus: patient.healthStatus,
  });
};
const GetDataFromCarte = async (req, res) => {
  const {
    patientId,
    temperature,
    respiratoryRate,
    systolicBP,
    diastolicBP,
    oxygenSaturation,
    bloodGlucose,
    heartRate,
    selectedList,
  } = req.body;

  console.log(`Received data for patient ID ${patientId}:`, req.body);

  const desktopPath = "C:\\Users\\Akrem\\Desktop\\Update";
  const filePath = path.join(desktopPath, `${patientId}.json`);
  const patient = await Patients.findById(patientId);

  const dataToWrite = {
    temperature,
    tensionArterielle: {
      systolique: systolicBP,
      diastolique: diastolicBP,
    },
    saturationOxygene: oxygenSaturation,
    glycemie: bloodGlucose,
    frequenceRespiratoire: respiratoryRate,
    frequenceCardiaque: heartRate,
    ecg: selectedList,
    createdAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(dataToWrite, null, 2));
    console.log("Data written to file successfully!");
    detectionAnomalies(dataToWrite, patient);

    // io.emit("notification", { message: "Data processed successfully!" });
    console.log("Data processed event emitted successfully!");
    res.status(200).send("Data received and written to file successfully!");
  } catch (error) {
    console.error("Error emitting notification:", error);
    console.error("Error writing to file:", error);
    res.status(500).send("Error writing to file!");
  }
};
const updateParamsViatux = async (req, res) => {
  const { patientId } = req.params;
  const paramsVitaux = await ParamsVitaux.findOne({ patient: patientId });
  const patient = await Patients.findById(patientId);
  // const { name, lastName } = patient;

  const desktopPath = "C:\\Users\\Akrem\\Desktop\\Update";
  const filePath = path.join(desktopPath, `${patient._id}.json`);
  let newData = {};
  newData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  paramsVitaux.temperature = newData.temperature;
  paramsVitaux.tensionArterielle.systolique =
    newData.tensionArterielle.systolique;
  paramsVitaux.tensionArterielle.diastolique =
    newData.tensionArterielle.diastolique;
  paramsVitaux.saturationOxygene = newData.saturationOxygene;
  paramsVitaux.glycemie = newData.glycemie;
  paramsVitaux.frequenceRespiratoire = newData.frequenceRespiratoire;
  paramsVitaux.frequenceCardiaque = newData.frequenceCardiaque;
  paramsVitaux.ecg = newData.ecg;

  await paramsVitaux.save();
  // detectionAnomalies(newData, patient);
  try {
    const historiqueMesures = new Historique({
      patient: patientId,
      patient: patientId,
      temperature: newData.temperature,
      tensionArterielle: {
        systolique: newData.tensionArterielle.systolique,
        diastolique: newData.tensionArterielle.diastolique,
      },
      saturationOxygene: newData.saturationOxygene,
      glycemie: newData.glycemie,
      frequenceRespiratoire: newData.frequenceRespiratoire,
      frequenceCardiaque: newData.frequenceCardiaque,
      ecg: newData.ecg,
    });
    await historiqueMesures.save();
  } catch (error) {
    console.log("Error saving measures to historique:", error);
  }
  // const desktopPath2 = "C:\\Users\\Akrem\\Desktop\\parametresVitaux";
  // const filePath2 = path.join(desktopPath2, `${patientId}.json`);
  // let newData2 = [];
  // try {
  //   newData2 = JSON.parse(fs.readFileSync(filePath2, "utf8"));
  // } catch (error) {
  //   console.error("Error reading Params Vitaux file:", error);
  // }
  // if (!Array.isArray(newData2)) {
  //   newData2 = [];
  // }
  // let newDataEntry = {
  //   patient: patientId,
  //   temperature: newData.temperature,
  //   tensionArterielle: {
  //     systolique: newData.systolicBP,
  //     diastolique: newData.diastolicBP,
  //   },
  //   saturationOxygene: newData.oxygenSaturation,
  //   glycemie: newData.bloodGlucose,
  //   frequenceRespiratoire: newData.respiratoryRate,
  //   frequenceCardiaque: newData.heartRate,
  //   ecg: newData.ecgData,
  //   createdAt: new Date().toISOString(),
  // };
  // newData2.push(newDataEntry);
  // fs.writeFileSync(filePath2, JSON.stringify(newData2, null, 2), (err) => {
  //   if (err) {
  //     console.error("Error writing Params Vitaux file:", err);
  //   } else {
  //     console.log("Params Vitaux file updated successfully", filePath);
  //   }
  // });
  // res.status(StatusCodes.OK).json({ paramsVitaux });
  res.status(StatusCodes.OK).json(newData);
};

export {
  getParamsVitauxAllPatinets,
  DeleteParmasVitauxByPatientId,
  updateParamsViatux,
  getParamsVitauxByPatinetID,
  getParamsViatuxByPatientIdFileJson,
  GetDataFromCarte,
};
// getParmasVitauxByPatientId
