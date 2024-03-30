"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const patientSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    ssn: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
    },
    occupation: {
        type: String,
        required: true,
    },
    entries: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Base",
        }
    ]
});
patientSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
patientSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model("Patient", patientSchema);
