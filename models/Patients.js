import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
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
      default: "lastName",
    },
    age: {
      type: Number,
      min: 0,
    },
    genre: {
      type: String,
      enum: ["Masculin", "Feminin"],
      default: "Masculin",
    },
    antecedent: {
      type: String,
      enum: [
        "HTA",
        "Diabete",
        "dyslipidemie",
        "syndrome coronarien",
        "insuffisance cardiaque",
        "AVC",
        "autre",
      ],
      default: "HTA",
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
    healthStatus: {
      type: String,
      enum: ["Good", "Bad"],
      default: "Good",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);
export default mongoose.model("Patients", PatientSchema);
