import { Router } from 'express';
import {createRoom, getRooms} from '../controllers/room.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router()

router.post('/rooms', authMiddleware, createRoom)
router.get('/rooms', authMiddleware, getRooms)

export default router