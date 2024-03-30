import patientData from "../../data/patients";
import { NonSensitivePatientData, PatientEntry, NewPatientEntry, Entry } from "../types/Patient/types";
import {v1 as uuid} from "uuid";


const getNonSensitivePatientData = (): NonSensitivePatientData[] => {
  return patientData.map(({id, name, dateOfBirth, gender, occupation}) => ({
    id, name, dateOfBirth, gender, occupation
  }));
};

const getPatientData = (): PatientEntry[] => {
  return patientData;
};

const getPatientById = (id: string): PatientEntry | undefined => {
  const patient = patientData.find(p => p.id === id);

  return patient;
};

const addPatientData = (entry: NewPatientEntry): PatientEntry => {
  const newPatientData = {
    id: uuid(),
    ...entry
  };
  patientData.push(newPatientData);
  return newPatientData;
};


const addPatientEntry = (patientId: string, newEntry: Entry): void => {
  console.log("New entry: ",newEntry);
    
  const existingPatient = patientData.find(p => p.id === patientId);

  if(existingPatient) {
    const entryId = uuid();
    newEntry.id = entryId;
        
    existingPatient.entries.push(newEntry);
  } else {
    console.log(`Patient with ID ${patientId} not found.`);
  }
};

export default {
  getPatientData,
  getPatientById,
  getNonSensitivePatientData,
  addPatientData,
  addPatientEntry
};