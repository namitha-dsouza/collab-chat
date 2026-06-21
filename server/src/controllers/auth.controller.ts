import { Request, Response } from 'express'
import { registerSchema, loginSchema } from '../schema'
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const SALT_ROUNDS = 10

export const registerUser = async (req: Request, res: Response) => {
    try {
        let { userName, email, password } = req.body;
        const result = registerSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: result.error?.issues
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email: result.data.email }
        })
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(result.data.password, SALT_ROUNDS);
        const user = await prisma.user.create({
            data: {
                userName: result.data.userName,
                email: result.data.email,
                password: hashedPassword
            },
        });
        return res.status(201).json({
            id: user.id,
            username: user.userName,
            email: user.email
        });
    } catch (error: unknown) {


        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const parsedLogin = loginSchema.safeParse(req.body)
        if (!parsedLogin.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: parsedLogin.error?.issues
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email: parsedLogin.data.email }
        })
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordResult = await bcrypt.compare(parsedLogin.data.password, existingUser.password);
        if (!passwordResult) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) throw new Error("JWT_SECRET is not defined");
        const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({
            id: existingUser.id,
            username: existingUser.userName,
            email: existingUser.email,
            token
        });
    } catch (error: unknown) {
        if (process.env.ENV === 'DEV') {
            return res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : String(error)
            });
        }
        return res.status(500).json({
            message: "Internal server error",

        });
    }
}


