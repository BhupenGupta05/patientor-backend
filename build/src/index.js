"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.config)();
const diagnosis_1 = __importDefault(require("./routes/diagnosis"));
const patients_1 = __importDefault(require("./routes/patients"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
console.log("connecting to", process.env.MONGODB_URL);
mongoose_1.default.set("strictQuery", false);
mongoose_1.default.connect(process.env.MONGODB_URL)
    .then(() => {
    console.log("connected to MongoDB");
})
    .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
});
app.use(express_1.default.json());
app.get("/api/ping", (_req, res) => {
    console.log("someone pinged here");
    res.send("pong");
});
app.use("/api/diagnoses", diagnosis_1.default);
app.use("/api/patients", patients_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
