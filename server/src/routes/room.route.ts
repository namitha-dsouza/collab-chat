import { Router } from 'express';
import {createRoom, getMessages, getRooms} from '../controllers/room.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const router = Router()

router.post('/rooms', authMiddleware, createRoom)
router.get('/rooms', authMiddleware, getRooms)
router.get('/rooms/:roomId/messages', authMiddleware, getMessages)

export default router