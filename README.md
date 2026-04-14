# Recruitment Interview Backend

A robust Node.js backend for 1-to-1 recruitment interviews, featuring WebRTC signaling and automated email invitations.

## 🚀 Setup Instructions

1. **Install Dependencies**
   ```bash
   cd interview-backend
   npm install
   ```

2. **Environment Configuration**
   Edit the `.env` file with your credentials:
   - `MONGO_URI`: Your MongoDB connection string.
   - `EMAIL_USER`: Your Gmail/Email address.
   - `EMAIL_PASS`: Your App Password (for Gmail, generate via Google Account Security).

3. **Start the Server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

## 📡 API Endpoints

- `GET /api/student/:id`: Fetch student details.
- `POST /api/invite`: Send an interview invite (requires `studentId` and `recruiterName`).
- `GET /api/session/:sessionId`: Get session/meeting details.

## 🔌 Socket.io Events (WebRTC Signaling)

- `join-room`: Join a specific session.
- `offer`: Send WebRTC offer.
- `answer`: Send WebRTC answer.
- `ice-candidate`: Exchange connectivity candidates.
- `leave-room`: Exit the session.

## 📁 Project Structure

```
/interview-backend
  /config       - Database connection
  /controllers  - Business logic
  /models       - Mongoose schemas
  /routes       - API route definitions
  /socket       - Real-time signaling
  server.js     - Entry point
```
