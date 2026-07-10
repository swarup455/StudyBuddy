# StudyBuddy

StudyBuddy is a full-stack real-time collaboration platform that allows teams to work together in shared workspaces. Users can create channels, collaborate on documents in real time, and communicate through integrated group and private chats. The platform is designed to provide a smooth and responsive collaboration experience using modern web technologies.

## Live Demo

**Website:** https://vercel-studybuddy.vercel.app

---

## Features

### Real-Time Collaborative Editor

- Collaborate on documents with multiple users simultaneously.
- Changes are synchronized instantly using Yjs and y-websocket.
- Built with the Tiptap rich text editor for a modern editing experience.

### Real-Time Communication

- Group chat for every channel.
- Private one-to-one messaging between users.
- Online/offline presence updates.
- Typing indicators for active conversations.

### Channel Management

- Create new collaboration channels.
- Update channel details.
- Add or remove members.
- Delete channels when no longer needed.
- Organize workspaces for different teams or projects.

### User Authentication

- Secure registration and login using JWT authentication.
- Profile management with avatar support.
- Protected routes and authenticated API access.

### Responsive Interface

- Responsive design for desktop and mobile devices.
- Clean user interface built with Tailwind CSS.
- Fast navigation and optimized state management using Redux Toolkit.

---

## Tech Stack

### Frontend

- React
- Redux Toolkit
- Tailwind CSS
- Tiptap Editor
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Real-Time Technologies

- Socket.IO
- Yjs
- y-websocket

### Authentication

- JSON Web Tokens (JWT)

### Media Storage

- Cloudinary

---

## Project Structure

```
studybuddy/
├── client/
│   ├── src/
│   └── public/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   └── utils/
│
└── README.md
```

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/studybuddy.git
cd studybuddy
```

### Install dependencies

For the frontend:

```bash
cd client
npm install
```

For the backend:

```bash
cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the server directory and configure the required environment variables.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Run the application

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

---

## Future Improvements

- Notifications
- Video and voice calling
- File sharing inside channels
- Document version history
- Workspace roles and permissions
- Search across messages and documents

---

## License

This project is developed for learning and portfolio purposes.
