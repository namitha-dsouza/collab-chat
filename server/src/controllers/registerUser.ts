import { Request, Response } from 'express'
import { registerSchema } from '../schema/auth.schema'
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs'
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


