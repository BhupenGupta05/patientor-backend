"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHealthCheckEntry = exports.validateOccupationalHealthcareEntry = exports.validateHospitalEntry = void 0;
const types_1 = require("./types/Patient/types");
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const parseName = (name) => {
    if (!isString(name)) {
        throw new Error("Incorrect name");
    }
    return name;
};
const parseSSN = (ssn) => {
    if (!isString(ssn)) {
        throw new Error("Incorrect ssn");
    }
    return ssn;
};
const parseOccupation = (occupation) => {
    if (!isString(occupation)) {
        throw new Error("Incorrect occupation");
    }
    return occupation;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDateOfBirth = (dateOfBirth) => {
    if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
        throw new Error("Incorrect date: " + dateOfBirth);
    }
    return new Date(dateOfBirth);
};
const isValidGender = (param) => {
    return Object.values(types_1.Gender).map(v => v.toString()).includes(param);
};
const parseGender = (gender) => {
    if (!isString(gender) || !isValidGender(gender)) {
        throw new Error("Incorrect gender: " + gender);
    }
    return gender;
};
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
        // we will just trust the data to be in correct form
        return [];
    }
    return object.diagnosisCodes;
};
// Validation function for HospitalEntry
const validateHospitalEntry = (entry) => {
    if (!entry.date || !entry.description || !entry.specialist || !entry.discharge || !entry.discharge.date || !entry.discharge.criteria) {
        console.log("Invalid entry", entry);
        throw new Error("Invalid HospitalEntry: Missing required fields");
    }
    return Object.assign(Object.assign({}, entry), { diagnosisCodes: parseDiagnosisCodes(entry) });
};
exports.validateHospitalEntry = validateHospitalEntry;
// Validation function for OccupationalHealthcareEntry
const validateOccupationalHealthcareEntry = (entry) => {
    if (!entry.date || !entry.description || !entry.specialist || !entry.employerName) {
        throw new Error("Invalid OccupationalHealthcareEntry: Missing required fields");
    }
    return Object.assign(Object.assign({}, entry), { diagnosisCodes: parseDiagnosisCodes(entry) });
};
exports.validateOccupationalHealthcareEntry = validateOccupationalHealthcareEntry;
// Validation function for HealthCheckEntry
const validateHealthCheckEntry = (entry) => {
    if (!entry.date || !entry.description || !entry.specialist || !entry.healthCheckRating === undefined) {
        throw new Error("Invalid HealthCheckEntry: Missing required fields");
    }
    return Object.assign(Object.assign({}, entry), { diagnosisCodes: parseDiagnosisCodes(entry) });
};
exports.validateHealthCheckEntry = validateHealthCheckEntry;
const parseHospitalEntry = (entry) => {
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
const parseOccupationalHealthcareEntry = (entry) => {
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
const parseHealthCheckEntry = (entry) => {
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
const parseEntries = (entries) => {
    return entries.map((entry) => {
        switch (entry.type) {
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
const toNewPatientEntry = (object) => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }
    if ("name" in object && "dateOfBirth" in object && "gender" in object && "occupation" in object && "ssn" in object && "entries" in object) {
        const newEntry = {
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
exports.default = toNewPatientEntry;
