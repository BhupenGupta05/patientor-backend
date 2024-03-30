"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const base_1 = __importDefault(require("./base"));
const healthSchema = new mongoose_1.default.Schema({
    healthCheckRating: {
        type: Number,
        required: true,
        min: 0,
        max: 3,
    },
    type: {
        type: String,
        required: true,
        enum: ["HealthCheck"],
    },
});
healthSchema.plugin(mongoose_unique_validator_1.default);
const HealthEntry = base_1.default.discriminator("Health", healthSchema);
exports.default = HealthEntry;
