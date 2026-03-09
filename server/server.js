import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import { initSocket } from "./socket/socket.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

/* ===============================
   MIDDLEWARE
=============================== */

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   API ROUTES
=============================== */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/meta", skillRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/notifications", notificationRoutes);

/* ===============================
   SOCKET.IO
=============================== */

initSocket(server);

/* ===============================
   SERVE REACT BUILD
=============================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientPath));

/*
  React Router SPA fallback
  Express 5 safe version
*/
app.use((req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

/* ===============================
   SERVER START
=============================== */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});