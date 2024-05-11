import mongoose from "mongoose";

const RendezVousSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["Consultation", "Traitement", "Suivi", "Autre"],
      default: "Suivi",
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    bed: {
      type: Number,
    },
    department: {
      type: String,
      enum: ["house", "hospital", "clinic", "office"],
      default: "house",
    },
    phoneNumber: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("RendezVous", RendezVousSchema);
