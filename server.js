import express from "express";
import notFoundMiddleare from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import authenticateUser from "./middleware/Auth.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.use((socket, next) => {
  // Autoriser les connexions WebSocket depuis n'importe quelle origine
  socket.handshake.headers.origin = "*";
  next();
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  // Toutes les routes non définies ci-dessus seront servies par le frontend React
  app.get("*", (req, res) => {
    res.sendFile(
      "C:\\Users\\Akrem\\Desktop\\smart-doctor\\client\\build\\index.html"
    );
  });
}
app.use(express.json());
console.log("hello");

// Activer CORS avant la définition des routes
app.use(cors({ origin: "*" }));
app.use(cors({ origin: "http://localhost:3000" }));

//routes
import authRouter from "./routes/authRoute.js";
import PatientRouter from "./routes/PatientRoute.js";
import ParamsVitauxRouter from "./routes/ParamsViatuxRoute.js";
import rendezVousRouter from "./routes/rendezVousRoute.js";
import HistoriqueRoute from "./routes/HistoriqueRoute.js";
import { updateParamsViatux } from "./controller/ParamsVitauxController.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

app.get("/", (req, res) => {
  // throw new Error("error");
  res.json({ msg: "Welcome!" });
});
app.get("/api/v1", (req, res) => {
  res.json({ msg: "API " });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, PatientRouter);
app.use("/api/v1/paramsVitaux", ParamsVitauxRouter);
app.use("/api/v1/rendezVous", rendezVousRouter);
app.use("/api/v1/historique", HistoriqueRoute);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
export default io;
