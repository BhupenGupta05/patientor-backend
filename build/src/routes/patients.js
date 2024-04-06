"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = __importStar(require("../utils"));
const patient_1 = __importDefault(require("../../model/patient"));
const hopital_1 = __importDefault(require("../../model/Entry/hopital"));
const occupation_1 = __importDefault(require("../../model/Entry/occupation"));
const health_1 = __importDefault(require("../../model/Entry/health"));
const router = express_1.default.Router();
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield patient_1.default.find({});
        res.json(patients);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server error" });
    }
}));
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const patient = yield patient_1.default.findById(id).populate("entries");
        if (patient) {
            res.json(patient);
        }
        else {
            res.status(404).end();
        }
    }
    catch (error) {
        next(error);
    }
}));
router.post("/:id/entries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { type, diagnosisCodes } = _a, entryData = __rest(_a, ["type", "diagnosisCodes"]);
    console.log(req.body);
    try {
        let validatedEntry;
        let newEntry;
        switch (type) {
            case "Hospital":
                validatedEntry = (0, utils_1.validateHospitalEntry)(entryData);
                break;
            case "OccupationalHealthcare":
                validatedEntry = (0, utils_1.validateOccupationalHealthcareEntry)(entryData);
                break;
            case "HealthCheck":
                validatedEntry = (0, utils_1.validateHealthCheckEntry)(entryData);
                break;
            default:
                throw new Error(`Invalid entry type: ${type}`);
        }
        validatedEntry.diagnosisCodes = diagnosisCodes;
        validatedEntry.type = type;
        switch (validatedEntry.type) {
            case "Hospital":
                newEntry = new hopital_1.default(validatedEntry);
                break;
            case "OccupationalHealthcare":
                newEntry = new occupation_1.default(validatedEntry);
                break;
            case "HealthCheck":
                newEntry = new health_1.default(validatedEntry);
                break;
            default:
                throw new Error(`Invalid entry type: ${type}`);
        }
        yield newEntry.save();
        // Find the patient by ID
        const patient = yield patient_1.default.findById(id);
        // Check if patient exists
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }
        // Add the new entry's id to the patient's entries array
        patient.entries.push(newEntry.id);
        yield patient.save();
        const populatedPatient = yield patient.populate("entries");
        res.status(201).json(populatedPatient);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error", message: error.message });
    }
    // to remove the warning
    return;
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPatientEntry = (0, utils_1.default)(req.body);
        const addedPatient = yield patient_1.default.create(newPatientEntry);
        res.json(addedPatient);
    }
    catch (error) {
        let errorMessage = "Something went wrong.";
        if (error instanceof Error) {
            errorMessage += " Error: " + error.message;
        }
        res.status(400).send(errorMessage);
    }
}));
exports.default = router;
