"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const tokenExtractor = (req, _res, next) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        const token = authorization.replace("Bearer ", "");
        req.token = token;
    }
    else {
        req.token = null;
    }
    next();
};
const isJwtPayload = (token) => {
    return typeof token === "object" && "id" in token;
};
const userExtractor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.token;
    console.log("Token: ", token);
    if (!token) {
        return res.status(401).json({ error: "token missing" });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (isJwtPayload(decodedToken)) {
            console.log("Decoded token: ", decodedToken);
            if (!decodedToken.id) {
                return res.status(401).json({ error: "token invalid" });
            }
            const user = yield user_1.default.findById(decodedToken.id);
            console.log("User: ", user);
            if (!user) {
                return res.status(401).json({ error: "user not found" });
            }
            req.user = user;
            next();
        }
        return;
    }
    catch (error) {
        return res.status(401).json({ error: "token invalid" });
    }
});
const requestLogger = (req, _res, next) => {
    console.log("Method:", req.method);
    console.log("Path:  ", req.path);
    console.log("Body:  ", req.body);
    console.log("---");
    next();
};
const unknownEndpoint = (_req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    limit: 50,
    message: 'You have exceeded your 50 requests per hour limit.',
    legacyHeaders: true,
});
const errorHandler = (error, _req, res, next) => {
    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    }
    else if (error.name === "JsonWebTokenError") {
        return res.status(400).json({ error: "invalid token" });
    }
    else if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "token expired" });
    }
    next(error);
    return;
};
exports.default = {
    tokenExtractor,
    userExtractor,
    requestLogger,
    unknownEndpoint,
    errorHandler,
};
