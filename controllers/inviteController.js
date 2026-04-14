import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import Student from '../models/Student.js';
import Session from '../models/Session.js';
import dotenv from 'dotenv';

dotenv.config();

// @desc    Send interview invitation
// @route   POST /api/send-invite
export const sendInvite = async (req, res) => {
  const { studentId, recruiterName } = req.body;

  try {
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const sessionId = uuidv4();
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
    const joinLink = `${appBaseUrl}/session/${sessionId}`;

    // Create session in DB
    const session = await Session.create({
      sessionId,
      studentId: student.studentId,
      studentName: student.name,
      studentEmail: student.email,
      recruiterName,
      joinLink,
    });

    // Email Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your preferred service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: `Interview Invitation from ${recruiterName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello ${student.name},</h2>
          <p>You have been invited for a 1-to-1 live interview session with <b>${recruiterName}</b>.</p>
          <p>Please click the link below to join the session at the scheduled time:</p>
          <a href="${joinLink}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px;">Join Interview Session</a>
          <br/><br/>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p>${joinLink}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Invitation sent successfully',
      sessionId,
      joinLink,
    });
  } catch (error) {
    console.error('Invite Error:', error);
    res.status(500).json({ message: 'Failed to send invitation', error: error.message });
  }
};
