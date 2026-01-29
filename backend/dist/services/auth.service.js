"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const helpers_1 = require("../utils/helpers");
const errors_1 = require("../utils/errors");
const prisma = new client_1.PrismaClient();
exports.authService = {
    async register(input) {
        const { email, password, name, role = 'STUDENT' } = input;
        // Validation
        if (!email || !password || !name) {
            throw new errors_1.ValidationError('Email, password, and name are required');
        }
        if (password.length < 6) {
            throw new errors_1.ValidationError('Password must be at least 6 characters');
        }
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new errors_1.ConflictError('User with this email already exists');
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                role: role,
            },
        });
        // Create account with password
        await prisma.account.create({
            data: {
                userId: user.id,
                accountId: email,
                providerId: 'credential',
                password: hashedPassword,
            },
        });
        // Generate token
        const token = (0, helpers_1.generateToken)(user);
        return {
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token,
        };
    },
    async login(input) {
        const { email, password } = input;
        // Validation
        if (!email || !password) {
            throw new errors_1.ValidationError('Email and password are required');
        }
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
        });
        if (!user) {
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        // Check password
        // Check password
        const account = user.accounts.find((a) => a.providerId === 'credential');
        if (!account) {
            console.log(`Login failed: No credential account found for user ${email}`);
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        console.log(`Verifying password for ${email}. Hash: ${account.password?.substring(0, 10)}...`);
        const isValidPassword = await bcrypt_1.default.compare(password, account.password || '');
        console.log(`Password verification result: ${isValidPassword}`);
        if (!isValidPassword) {
            console.log(`Login failed: Invalid password for ${email}`);
            throw new errors_1.AuthenticationError('Invalid email or password');
        }
        // Generate token
        const token = (0, helpers_1.generateToken)(user);
        return {
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token,
        };
    },
    async getMe(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errors_1.AuthenticationError('User not found');
        }
        return { id: user.id, email: user.email, name: user.name, role: user.role };
    },
};
