import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentName: String,
  studentEmail: String,
  recruiterName: {
    type: String,
    required: true,
  },
  joinLink: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'ended'],
    default: 'pending',
  },
  participants: {
    type: [String],
    default: [],
  }
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
