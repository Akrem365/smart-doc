import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import Historique from "../models/Historique.js";
const GetHistoriqueByPatientId = async (req, res) => {
  const { patientID } = req.params;
  try {
    const history = await Historique.find({ patient: patientID });
    if (!history) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: `No history  found for patient with id ${patientID}`,
      });
    }
    res.status(StatusCodes.OK).json(history);
  } catch (error) {
    console.error("Error get history by patient id:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};
const GetHistorique = async (req, res) => {
  try {
    const history = await Historique.find();
    if (history.length === 0) {
      res.status(StatusCodes.OK).json({ message: "No history  found" });
      return;
    }
    res.status(StatusCodes.OK).json(history);
  } catch (error) {
    console.error("Error get history mesures:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};
export { GetHistoriqueByPatientId, GetHistorique };
