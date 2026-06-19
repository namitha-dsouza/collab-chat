import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded as { id: string; email: string };
        
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired, please login again" });
    }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}