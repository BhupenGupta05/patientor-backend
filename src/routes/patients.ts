import express from "express";
import toNewPatientEntry, { validateHealthCheckEntry, validateHospitalEntry, validateOccupationalHealthcareEntry } from "../utils";
import Patient from "../../model/patient";
import HospitalEntry from "../../model/Entry/hopital";
import OccupationalHealthcareEntry from "../../model/Entry/occupation";
import HealthEntry from "../../model/Entry/health";

const router = express.Router();


router.get("/", async (_req, res) => {
  try {
    const patients = await Patient.find({});
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
});


router.get("/:id", async (req, res) => {
  const {id} = req.params;

  try {
    const patient = await Patient.findById(id).populate("entries");
    res.json(patient);
  } catch (error) {
    res.status(404).json({ error: "Patient not found" });
  }
});


router.post("/:id/entries", async (req, res) => {
  const {id} = req.params;
  const{type, diagnosisCodes, ...entryData} = req.body;
  console.log(req.body);
  
  

  try {
    let validatedEntry;
    let newEntry;

    switch(type) {
    case "Hospital":
      validatedEntry = validateHospitalEntry(entryData);
      break;
    case "OccupationalHealthcare":
      validatedEntry = validateOccupationalHealthcareEntry(entryData);
      break;
    case "HealthCheck":
      validatedEntry = validateHealthCheckEntry(entryData);
      break;
    default:
      throw new Error(`Invalid entry type: ${type}`);
    }

    validatedEntry.diagnosisCodes = diagnosisCodes;
    validatedEntry.type = type;

    switch(validatedEntry.type) {
    case "Hospital":
      newEntry = new HospitalEntry(validatedEntry);
      break;
    case "OccupationalHealthcare":
      newEntry = new OccupationalHealthcareEntry(validatedEntry);
      break;
    case "HealthCheck":
      newEntry = new HealthEntry(validatedEntry);
      break;
    default:
      throw new Error(`Invalid entry type: ${type}`);
    }

    await newEntry.save();


    // Find the patient by ID
    const patient = await Patient.findById(id);

    // Check if patient exists
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Add the new entry's id to the patient's entries array
    patient.entries.push(newEntry.id);

    await patient.save();
    const populatedPatient = await patient.populate("entries");
    
    res.status(201).json(populatedPatient);
    
  } catch (error: any) {
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }

  // to remove the warning
  return;
});


router.post("/", async (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedPatient = await Patient.create(newPatientEntry);

    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;