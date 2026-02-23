import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import { initSocket } from "./socket/socket.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/meta", skillRoutes);

const server = http.createServer(app);

//Attach socket to HTTP server
initSocket(server);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the Alumni NEST API");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`server is running at http://localhost:${PORT}`);
});
