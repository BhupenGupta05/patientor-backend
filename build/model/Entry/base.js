"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const baseSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        required: true,
    },
    specialist: {
        type: String,
        required: true,
    },
    diagnosisCodes: [
        {
            type: String,
            ref: "Diagnosis",
        }
    ],
    description: {
        type: String,
        required: true,
    },
});
baseSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
baseSchema.plugin(mongoose_unique_validator_1.default);
const BaseEntry = mongoose_1.default.model("Base", baseSchema);
exports.default = BaseEntry;
