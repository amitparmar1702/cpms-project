import Session from '../models/Session.js';

// @desc    Get session details
// @route   GET /api/session/:sessionId
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });

    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
