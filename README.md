# 🎓 StudyBuddy – Real-Time Group Study Platform

## 📖 Overview
StudyBuddy is a **virtual study room platform** where students can collaborate online.  
It combines **real-time shared notes**, **chat**, and **presence tracking** to make group studying fun and effective.  

Think of it as a **Google Docs + Slack hybrid**, designed for students.  

---

## ✨ Features
- 🔑 **Google Login (OAuth2)** – Quick and secure login for students.
- 📚 **Study Rooms** – Create or join rooms for specific subjects/exams.
- 📝 **Real-Time Notes** – Shared rich-text editor (Quill.js) with live typing.
- 💬 **Group Chat** – Instant messaging panel for discussion.
- 👥 **Presence Indicator** – See who is online and where they are typing.
- 🔄 **Auto-Save & History** – Notes are saved automatically with version history.
- 🔍 **Search Notes** – Redis-powered fast search across all study material.
- 🎥 **Optional Video Calls** – (WebRTC) Study face-to-face while writing notes.

---

## 🖼️ Interface
- **Dashboard** → Shows all study rooms + recent notes.
- **Study Room** →  
  - Center: Collaborative notes editor.  
  - Right: Chat panel.  
  - Left: Online users with avatars.  
- **Typing Rules** →  
  - Everyone can type, edits merge automatically.  
  - Text is temporarily color-coded by author.  
  - Owners can lock sections if needed.  

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React.js** – UI framework
- 📝 **Quill.js** – Rich text editor
- 🔌 **Socket.IO (client)** – Real-time sync
- 🎨 **Tailwind CSS** – Modern styling

### Backend
- 🚀 **Node.js + Express** – REST APIs + WebSocket server
- 🔌 **Socket.IO (server)** – Real-time communication
- 🗄️ **MongoDB Atlas** – Store users, rooms, notes, chats
- ⚡ **Redis** – Presence tracking + caching

### Authentication
- 🔑 **OAuth2 (Google Login)** – Easy student login
- 🔒 **JWT** – Session handling

### Optional Add-Ons
- 🎥 **WebRTC** – Video calls
- 📦 **Docker** – Containerized deployment
- ☁️ **Vercel/Render/Railway** – Hosting

---

## 🗂️ Database Models (Example)
- **User**: { name, email, avatar, rooms[] }
- **Room**: { name, createdBy, members[], notesId }
- **Note**: { roomId, content, versionHistory[] }
- **Chat**: { roomId, userId, message, timestamp }

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/studybuddy.git
cd studybuddy
