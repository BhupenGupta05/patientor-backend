import { DiagnosisEntry } from "./types/Diagnosis/types";
import { HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from "./types/Entry/types";
import { Entry, Gender, NewPatientEntry } from "./types/Patient/types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseName = (name: unknown): string => {
  if(!isString(name)) {
    throw new Error("Incorrect name");
  }
  return name;
};

const parseSSN = (ssn: unknown): string => {
  if(!isString(ssn)) {
    throw new Error("Incorrect ssn");
  }
  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if(!isString(occupation)) {
    throw new Error("Incorrect occupation");
  }
  return occupation;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};


const parseDateOfBirth = (dateOfBirth: unknown): Date => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("Incorrect date: " + dateOfBirth);
  }
  return new Date(dateOfBirth);
};

const isValidGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if(!isString(gender) || !isValidGender(gender)) {
    throw new Error("Incorrect gender: " + gender);
  }
  return gender;
};

const parseDiagnosisCodes = (object: unknown): Array<DiagnosisEntry["code"]> =>  {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<DiagnosisEntry["code"]>;
  }
  
  return object.diagnosisCodes as Array<DiagnosisEntry["code"]>;
};

// Validation function for HospitalEntry
export const validateHospitalEntry = (entry: any): HospitalEntry => {
  if (!entry.date || !entry.description || !entry.specialist || !entry.discharge || !entry.discharge.date || !entry.discharge.criteria) {
    console.log("Invalid entry", entry);
    throw new Error("Invalid HospitalEntry: Missing required fields");
  }
  return {...entry, diagnosisCodes: parseDiagnosisCodes(entry)};
};

// Validation function for OccupationalHealthcareEntry
export const validateOccupationalHealthcareEntry = (entry: any): OccupationalHealthcareEntry => {
    
  if (!entry.date || !entry.description || !entry.specialist || !entry.employerName ) {
    throw new Error("Invalid OccupationalHealthcareEntry: Missing required fields");
  }
  return {...entry ,diagnosisCodes: parseDiagnosisCodes(entry)};
};

// Validation function for HealthCheckEntry
export const validateHealthCheckEntry = (entry: any): HealthCheckEntry => {
    
  if (!entry.date || !entry.description || !entry.specialist || !entry.healthCheckRating === undefined) {
    throw new Error("Invalid HealthCheckEntry: Missing required fields");
  }
  return {...entry, diagnosisCodes: parseDiagnosisCodes(entry)};
};


const parseHospitalEntry = (entry: any): HospitalEntry => {
  return {
    id: entry.id,
    date: entry.date,
    description: entry.description,
    specialist: entry.specialist,
    diagnosisCodes: entry.diagnosisCodes,
    discharge: entry.discharge,
    type: entry.type
  };
};

const parseOccupationalHealthcareEntry = (entry: any): OccupationalHealthcareEntry => {
  return {
    id: entry.id,
    date: entry.date,
    description: entry.description,
    specialist: entry.specialist,
    diagnosisCodes: entry.diagnosisCodes,
    employerName: entry.employerName,
    sickLeave: entry.sickLeave,
    type: entry.type
  };
};

const parseHealthCheckEntry = (entry: any): HealthCheckEntry => {
  return {
    id: entry.id,
    date: entry.date,
    description: entry.description,
    specialist: entry.specialist,
    diagnosisCodes: entry.diagnosisCodes,
    healthCheckRating: entry.healthCheckRating,
    type: entry.type
  };
};
  
// It worked
const parseEntries = (entries: any): Entry[] => {
  return entries.map((entry: any) => {
    switch(entry.type) {
    case "Hospital":
      return parseHospitalEntry(entry);
    case "OccupationalHealthcare":
      return parseOccupationalHealthcareEntry(entry);
    case "HealthCheck":
      return parseHealthCheckEntry(entry);
    default:
      throw new Error(`Invalid entry type: ${entry.type}`);
    }
  });
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if ( !object || typeof object !== "object" ) {
    throw new Error("Incorrect or missing data");
  }

  if ("name" in object && "dateOfBirth" in object && "gender" in object && "occupation" in object && "ssn" in object && "entries" in object) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      ssn: parseSSN(object.ssn),
      entries: parseEntries(object.entries) 
    };
    return newEntry;
  }
  throw new Error("Incorrect data: some fields are missing");
};

export default toNewPatientEntry;