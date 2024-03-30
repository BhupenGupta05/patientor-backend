"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const getNonSensitivePatientData = () => {
    return patients_1.default.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id, name, dateOfBirth, gender, occupation
    }));
};
const getPatientData = () => {
    return patients_1.default;
};
const getPatientById = (id) => {
    const patient = patients_1.default.find(p => p.id === id);
    return patient;
};
const addPatientData = (entry) => {
    const newPatientData = Object.assign({ id: (0, uuid_1.v1)() }, entry);
    patients_1.default.push(newPatientData);
    return newPatientData;
};
const addPatientEntry = (patientId, newEntry) => {
    console.log("New entry: ", newEntry);
    const existingPatient = patients_1.default.find(p => p.id === patientId);
    if (existingPatient) {
        const entryId = (0, uuid_1.v1)();
        newEntry.id = entryId;
        existingPatient.entries.push(newEntry);
    }
    else {
        console.log(`Patient with ID ${patientId} not found.`);
    }
};
exports.default = {
    getPatientData,
    getPatientById,
    getNonSensitivePatientData,
    addPatientData,
    addPatientEntry
};
