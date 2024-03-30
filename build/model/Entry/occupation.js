"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const base_1 = __importDefault(require("./base"));
const occupationSchema = new mongoose_1.default.Schema({
    employerName: {
        type: String,
        required: true,
    },
    sickLeave: {
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    type: {
        type: String,
        required: true,
        enum: ["OccupationalHealthcare"],
    },
});
occupationSchema.plugin(mongoose_unique_validator_1.default);
const OccupationalHealthcareEntry = base_1.default.discriminator("Occupation", occupationSchema);
exports.default = OccupationalHealthcareEntry;
