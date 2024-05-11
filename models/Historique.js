import mongoose from "mongoose";

const HistoriqueSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    tensionArterielle: {
      systolique: {
        type: Number,
        required: true,
      },
      diastolique: {
        type: Number,
        required: true,
      },
    },
    saturationOxygene: {
      type: Number,
      required: true,
    },
    glycemie: {
      type: Number,
      required: true,
    },
    frequenceRespiratoire: {
      type: Number,
      required: true,
    },
    frequenceCardiaque: {
      type: Number,
      required: true,
    },
    ecg: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Historique", HistoriqueSchema);
