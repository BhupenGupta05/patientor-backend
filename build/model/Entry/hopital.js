"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const base_1 = __importDefault(require("./base"));
const hospitalSchema = new mongoose_1.default.Schema({
    discharge: {
        date: {
            type: Date,
            required: true,
        },
        criteria: {
            type: String,
            required: true,
        },
    },
    type: {
        type: String,
        required: true,
        enum: ["Hospital"],
    },
});
hospitalSchema.plugin(mongoose_unique_validator_1.default);
const HospitalEntry = base_1.default.discriminator("Hospital", hospitalSchema);
exports.default = HospitalEntry;
