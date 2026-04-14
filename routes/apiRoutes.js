import express from 'express';
import { getStudentById } from '../controllers/studentController.js';
import { sendInvite } from '../controllers/inviteController.js';
import { getSessionById } from '../controllers/sessionController.js';

const router = express.Router();

router.get('/student/:id', getStudentById);
router.post('/send-invite', sendInvite);
router.get('/session/:sessionId', getSessionById);

export default router;
