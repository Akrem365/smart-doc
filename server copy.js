import express from "express";

import notFoundMiddleare from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import authenticateUser from "./middleware/Auth.js";

import dotenv from "dotenv";
import connectDB from "./db/connect.js";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
const app = express();

//routes
import authRouter from "./routes/authRoute.js";
import PatientRouter from "./routes/PatientRoute.js";
import ParamsVitauxRouter from "./routes/ParamsViatuxRoute.js";
import rendezVousRouter from "./routes/rendezVousRoute.js";
import HistoriqueRoute from "./routes/HistoriqueRoute.js";
import { updateParamsViatux } from "./controller/ParamsVitauxController.js";
import fs from "fs";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
console.log("hello");

app.get("/", (req, res) => {
  // throw new Error("error");
  res.json({ msg: "Welcome!" });
});
app.get("/api/v1", (req, res) => {
  res.json({ msg: "API " });
});
let paramsVitaux = {
  ecgData: [],
  temperature: 0,
  heartRate: 0,
  systolicBP: 0,
  diastolicBP: 0,
  oxygenSaturation: 0,
  bloodGlucose: 0,
  respiratoryRate: 0,
};
app.post("/trigger-esp32", async (req, res) => {
  const {
    ecgData,
    temperature,
    heartRate,
    systolicBP,
    diastolicBP,
    oxygenSaturation,
    bloodGlucose,
    respiratoryRate,
  } = req.body;
  paramsVitaux = {
    ecgData,
    temperature,
    heartRate,
    systolicBP,
    diastolicBP,
    oxygenSaturation,
    bloodGlucose,
    respiratoryRate,
  };
  const desktopPath = "C:\\Users\\Akrem\\Desktop\\updateEsp32";
  const filePath = path.join(desktopPath, "update.json");

  try {
    fs.writeFileSync(filePath, JSON.stringify(paramsVitaux, null, 2));
    console.log("Données écrites dans le fichier avec succès !");
    res.status(200).send("Données reçues et écrites avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'écriture dans le fichier :", error);
    res.status(500).send("Erreur lors de l'écriture dans le fichier !");
  }
  console.log("Requête reçue depuis ESP32 :", req.body);

  console.log("Données ECG :", ecgData);
  console.log("Température :", temperature);
  console.log("Fréquence cardiaque :", heartRate);
  console.log("systolicBP :", systolicBP);
  console.log("diastolicBP :", diastolicBP);
  console.log("oxygenSaturation :", oxygenSaturation);
  console.log("bloodGlucose :", bloodGlucose);
  console.log("respiratoryRate :", respiratoryRate);

  // res.status(200).send("Données reçues avec succès !");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, PatientRouter);
app.use("/api/v1/paramsVitaux", ParamsVitauxRouter);
app.use("/api/v1/rendezVous", rendezVousRouter);
app.use("/api/v1/historique", HistoriqueRoute);

app.use(notFoundMiddleare);
app.use(errorHandler);
// const port = 5000;
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
