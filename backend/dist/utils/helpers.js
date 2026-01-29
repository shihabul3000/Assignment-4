"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = exports.formatResponse = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config_1.config.jwtSecret, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
const formatResponse = (success, data, message) => {
    return {
        success,
        data,
        ...(message && { message }),
        timestamp: new Date().toISOString(),
    };
};
exports.formatResponse = formatResponse;
const parsePagination = (page, limit) => {
    const pageNum = parseInt(page, 10) || config_1.config.defaultPage;
    const limitNum = parseInt(limit, 10) || config_1.config.defaultLimit;
    return {
        page: Math.max(1, pageNum),
        limit: Math.min(Math.max(1, limitNum), config_1.config.maxLimit),
        skip: (Math.max(1, pageNum) - 1) * Math.min(Math.max(1, limitNum), config_1.config.maxLimit),
    };
};
exports.parsePagination = parsePagination;
