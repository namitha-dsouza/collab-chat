import { roomSchema } from '../schema'
import prisma from '../lib/prisma';

import { Response } from 'express'
import { AuthRequest } from '../types/express'

export const createRoom = async (req: AuthRequest, res: Response) => {

    try {
        const result = roomSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: result.error?.issues
            });
        }
        const room = await prisma.room.create({
            data: {
                name: result.data.name,
                createdBy: req.user!.id,
            }
        });
        return res.status(201).json(room);
    }catch (error: unknown) {
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
         orderBy: {
        createdAt: 'desc'
         }
    })
    return res.status(200).json(rooms)
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error)
    })
  }
}